import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Dimensions, Modal } from 'react-native';
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
  pointX?: number,
  pointY?: number,
  points: number
}

interface QuizProps {
  questions: Question[];
  triggerText: string;
  submitText: string;
  title: string;
  description: string;
  onCompleted: (duration: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ 
  questions, 
  triggerText, 
  submitText, 
  title, 
  description, 
  onCompleted 
}) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showStartPage, setShowStartPage] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState<string | number>('');
  const [showHint, setShowHint] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [points, setPoints] = useState(-1);

  useEffect(() => {
    if (showQuiz && !quizCompleted && startTime === null) {
      setStartTime(Date.now());
    }
  }, [showQuiz, quizCompleted, startTime]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
    })();
  }, []);


  const handleAnswer = () => {
    if (points === -1) {
      setPoints(questions[currentQuestion].points);
    }
    const question = questions[currentQuestion];
    if (answer.toString().toLowerCase() === question.correctAnswer.toString().toLowerCase()) {
      setTotalPoints(totalPoints + points);
      setPoints(-1);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setAnswer('');
        setShowHint(false);
      } else {
        // Quiz completed
        setQuizCompleted(true);
        const endTime = Date.now();
        const duration = startTime ? (endTime - startTime) / 1000 : 0; // Duration in seconds
        onCompleted(duration);
      }
    } else {
      setPoints(points - 10);
      setShowHint(true);
    }
  };

  const calculateDistance = (coord1 : {latitude: number, longitude: number}, coord2 : {latitude: number, longitude: number}) => {
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

  const handleMapAnswer = async () => {
    if (points === -1) {
      setPoints(questions[currentQuestion].points);
    }
    const question = questions[currentQuestion];
    console.log('pobieranie lokalizacji')
    let location = await Location.getCurrentPositionAsync({});
    console.log('pobieranie lokalizacji v2')
    if (calculateDistance({latitude: location.coords.latitude, longitude: location.coords.longitude}, {latitude: question.pointX as number, longitude: question.pointY as number}) < 0.1) {
      setTotalPoints(totalPoints + points);
      setPoints(-1);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setAnswer('');
        setShowHint(false);
      } else {
        // Quiz completed
        setQuizCompleted(true);
        const endTime = Date.now();
        const duration = startTime ? (endTime - startTime) / 1000 : 0; // Duration in seconds
        onCompleted(duration);
      }
    } else {
      setPoints(points - 10);
      setShowHint(true);
    }
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
    setShowQuiz(true);
  };

  const resetQuiz = () => {
    setShowQuiz(false);
    setShowStartPage(false);
    setQuizCompleted(false);
    setCurrentQuestion(0);
    setStartTime(null);
    setAnswer('');
    setShowHint(false);
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
            value={answer.toString()}
            onChangeText={(text) => setAnswer(parseInt(text) || '')}
            placeholder="Enter your answer"
          />
        );
      case 'string':
        return (
          <TextInput
            style={styles.input}
            value={answer.toString()}
            onChangeText={setAnswer}
            placeholder="Enter your answer"
          />
        );
    }
  };

  // Render the trigger button
  if (!modalVisible) {
    return (
      <TouchableOpacity style={styles.showQuizButton} onPress={openModal}>
        <Text style={styles.showQuizButtonText}>{triggerText}</Text>
      </TouchableOpacity>
    );
  }

  // Render the modal content
  let modalContent;
  
  if (showStartPage) {
    modalContent = (
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
  } else if (quizCompleted) {
    modalContent = (
      <View style={styles.modalContent}>
        <Text style={styles.congratsMessage}>Gratulacje! Zakończyłeś quiz!</Text>
        <Text style={styles.progressText}>Zdobyte punkty: {totalPoints}</Text>
        <Text style={styles.progressText}>Czas trwania: {Math.floor((Date.now() - (startTime as number)) / 1000)} sekund</Text>
        <TouchableOpacity
          style={styles.hideQuizButton}
          onPress={closeModal}
        >
          <Text style={styles.hideQuizButtonText}>Zamknij Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (showQuiz) {
    modalContent = questions[currentQuestion].type === 'map' ? (
      <View style={styles.modalContent}>
      <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
        <X size={24} color="#4A90E2" />
      </TouchableOpacity>
      
      <Text style={styles.progressText}>Zadanie z mapą</Text>
      <Text style={styles.question}>{questions[currentQuestion].question}</Text>
      
      <TouchableOpacity 
        style={[styles.submitButton]} 
        onPress={handleMapAnswer}
      >
        <Text style={styles.submitButtonText}>{'sprawdź moją lokalizację'}</Text>
      </TouchableOpacity>
      
      {showHint && (
        <Text style={styles.hint}>Podpowiedź: {questions[currentQuestion].hint}</Text>
      )}
    </View>
    ) : (
      <View style={styles.modalContent}>
        <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
          <X size={24} color="#4A90E2" />
        </TouchableOpacity>
        
        <Text style={styles.progressText}>Pytanie {currentQuestion + 1} z {questions.length}</Text>
        <Text style={styles.question}>{questions[currentQuestion].question}</Text>
        
        {renderQuestion()}
        
        <TouchableOpacity 
          style={[styles.submitButton, !answer ? styles.submitButtonDisabled : null]} 
          onPress={handleAnswer}
          disabled={!answer}
        >
          <Text style={styles.submitButtonText}>{submitText}</Text>
        </TouchableOpacity>
        
        {showHint && (
          <Text style={styles.hint}>Podpowiedź: {questions[currentQuestion].hint}</Text>
        )}
      </View>
    );
  }

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
      >
        <View style={styles.modalOverlay}>
          {modalContent}
        </View>
      </Modal>
    </>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.9,
    maxHeight: height * 0.8,
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
    height: 50
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