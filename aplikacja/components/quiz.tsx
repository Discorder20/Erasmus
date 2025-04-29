import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions, Modal, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import { X } from 'lucide-react-native';
import { RadioButton } from 'react-native-paper';
import * as Location from 'expo-location';

export type QuestionType = 'options' | 'number' | 'string' | 'map';

export interface Question {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  hint: string;
  pointX?: number;
  pointY?: number;
  points: number;
}

interface QuizProps {
  questions: Question[];
  triggerText: string;
  submitText: string;
  title: string;
  description: string;
  addToAS: () => void;
  onCompleted: (duration: number, points: number) => void;
}

const Quiz: React.FC<QuizProps> = ({
  questions,
  triggerText,
  submitText,
  title,
  description,
  addToAS,
  onCompleted
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [showStartPage, setShowStartPage] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState<string | number>('');
  const [showHint, setShowHint] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!modalVisible) {
      console.log('modal closed')
    }
  }, [modalVisible]);

  // Request location permissions on component mount
  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
      }
    };
    
    requestLocationPermission();
  }, []);

  // Start timer when quiz begins
  useEffect(() => {
    if (modalVisible && !showStartPage && !quizCompleted && startTime === null) {
      setStartTime(Date.now());
      setTotalPoints(0);
    }
  }, [modalVisible, showStartPage, quizCompleted, startTime]);

  const calculateDistance = (coord1: { latitude: number, longitude: number }, coord2: { latitude: number, longitude: number }) => {
    const R = 6371; // Radius of Earth in km
    const dLat = (coord2.latitude - coord1.latitude) * (Math.PI / 180);
    const dLon = (coord2.longitude - coord1.longitude) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coord1.latitude * (Math.PI / 180)) *
      Math.cos(coord2.latitude * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const handleAnswer = () => {
    const question = questions[currentQuestion];
    const isCorrect = answer.toString().toLowerCase() === question.correctAnswer.toString().toLowerCase();
    
    if (isCorrect) {
      // Calculate points - deduct 10% per attempt, minimum 0
      const pointsEarned = Math.max(question.points - (attempts * (question.points * 0.1)), 0);
      setTotalPoints(totalPoints + pointsEarned);
      moveToNextQuestion();
    } else {
      setAttempts(attempts + 1);
      setShowHint(true);
    }
  };

  const handleMapAnswer = async () => {
    try {
      const question = questions[currentQuestion];
      const location = await Location.getCurrentPositionAsync({});
      
      // Check if user is within 100 meters of the target location
      const distance = calculateDistance(
        { latitude: location.coords.latitude, longitude: location.coords.longitude },
        { latitude: question.pointX as number, longitude: question.pointY as number }
      );
      
      if (distance < 0.1) { // 0.1 km = 100 meters
        const pointsEarned = Math.max(question.points - (attempts * (question.points * 0.1)), 0);
        setTotalPoints(totalPoints + pointsEarned);
        moveToNextQuestion();
      } else {
        setAttempts(attempts + 1);
        setShowHint(true);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      setShowHint(true);
    }
  };

  const moveToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswer('');
      setShowHint(false);
      setAttempts(0);
    } else {
      // Quiz completed
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    setQuizCompleted(true);
    const endTime = Date.now();
    const duration = startTime ? (endTime - startTime) / 1000 : 0; // Duration in seconds
    onCompleted(duration, totalPoints);
  };

  const openModal = () => {
    setModalVisible(true);
    setShowStartPage(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetQuiz();
  };

  const startQuiz = () => {
    setShowStartPage(false);
    addToAS();
  };

  const resetQuiz = () => {
    setShowStartPage(true);
    setQuizCompleted(false);
    setCurrentQuestion(0);
    setStartTime(null);
    setAnswer('');
    setShowHint(false);
    setTotalPoints(0);
    setAttempts(0);
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    
    switch (question.type) {
      case 'options':
        return (
          <RadioButton.Group onValueChange={(value) => setAnswer(value)} value={answer.toString()}>
            {question.options?.map((option, index) => (
              <View key={index} style={styles.radioOption}>
                <RadioButton value={option} color="#4A90E2" />
                <Text style={styles.radioOptionText}>{option}</Text>
              </View>
            ))}
          </RadioButton.Group>
        );
      case 'number':
        return (
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={answer.toString() === '0' ? '0' : answer.toString() || ''}
            onChangeText={(text) => setAnswer(text ? parseInt(text) : '')}
            placeholder="Enter your answer"
          />
        );
      case 'string':
        return (
          <TextInput
            style={styles.input}
            value={answer.toString() === '0' ? '0' : answer.toString() || ''}
            onChangeText={setAnswer}
            placeholder="Enter your answer"
          />
        );
      default:
        return null;
    }
  };

  // Render modal content based on current state
  const renderModalContent = () => {
    if (showStartPage) {
      return (
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <X size={24} color="#4A90E2" />
          </TouchableOpacity>
          
          <Text style={styles.startPageTitle}>{title}</Text>
          <Text style={styles.startPageDescription}>{description}</Text>
          
          <TouchableOpacity style={styles.startButton} onPress={startQuiz}>
            <Text style={styles.startButtonText}>Rozpocznij Quiz</Text>
          </TouchableOpacity>
        </View>
      );
    } 
    
    if (quizCompleted) {
      return (
        <View style={styles.modalContent}>
          <Text style={styles.congratsMessage}>Gratulacje! Zakończyłeś quiz!</Text>
          <Text style={styles.progressText}>Zdobyte punkty: {totalPoints}</Text>
          <Text style={styles.progressText}>
            Czas trwania: {Math.floor((Date.now() - (startTime as number)) / 1000)} sekund
          </Text>
          <TouchableOpacity style={styles.hideQuizButton} onPress={closeModal}>
            <Text style={styles.hideQuizButtonText}>Zamknij Quiz</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    // Question screen
    const currentQ = questions[currentQuestion];
    const isMapQuestion = currentQ.type === 'map';
    
    return (
      <View style={styles.modalContent}>
        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
          <X size={24} color="#4A90E2" />
        </TouchableOpacity>
        
        <Text style={styles.progressText}>
          {isMapQuestion ? 'Zadanie z mapą' : `Pytanie ${currentQuestion + 1} z ${questions.length}`}
        </Text>
        <Text style={styles.question}>{currentQ.question}</Text>
        
        {!isMapQuestion && renderQuestion()}
        
        <TouchableOpacity 
          style={[styles.submitButton, (!answer && !isMapQuestion) ? styles.submitButtonDisabled : null]} 
          onPress={isMapQuestion ? handleMapAnswer : handleAnswer}
          disabled={!answer && !isMapQuestion}
        >
          <Text style={styles.submitButtonText}>
            {isMapQuestion ? 'Sprawdź moją lokalizację' : submitText}
          </Text>
        </TouchableOpacity>
        
        {showHint && (
          <Text style={styles.hint}>Podpowiedź: {currentQ.hint}</Text>
        )}
      </View>
    );
  };

  return (
    <>
      <TouchableOpacity style={styles.showQuizButton} onPress={openModal}>
        <Text style={styles.showQuizButtonText}>{triggerText}</Text>
      </TouchableOpacity>
      
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
        // This is crucial - prevent modal from closing on Android back button
        hardwareAccelerated={true}
      >
        <TouchableWithoutFeedback>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContentWrapper}>
                  {renderModalContent()}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentWrapper: {
    width: width * 0.9,
    maxHeight: height * 0.8,
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  showQuizButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    height: 50,
    justifyContent: 'center',
  },
  showQuizButtonText: {
    color: 'white',
    fontSize: 18,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 5,
  },
  progressText: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 10,
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2C3E50',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioOptionText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#34495E',
  },
  input: {
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  submitButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#B3D9FF',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
  },
  hint: {
    marginTop: 20,
    fontSize: 16,
    fontStyle: 'italic',
    color: '#7F8C8D',
  },
  congratsMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 20,
  },
  hideQuizButton: {
    backgroundColor: '#4A90E2',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  hideQuizButtonText: {
    color: 'white',
    fontSize: 18,
  },
  startPageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 20,
  },
  startPageDescription: {
    fontSize: 16,
    color: '#34495E',
    marginBottom: 30,
    lineHeight: 22,
  },
  startButton: {
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Quiz;