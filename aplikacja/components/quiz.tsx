import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import { RadioButton } from 'react-native-paper';
import { Dimensions } from 'react-native';

export type QuestionType = 'options' | 'number' | 'string';

export interface Question {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | number;
  hint: string;
}

interface QuizProps {
  questions: Question[];
  triggerText: string;
  submitText: string;
  onCompleted: (duration: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, triggerText, submitText, onCompleted }) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState<string | number>('');
  const [showHint, setShowHint] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (showQuiz && !quizCompleted && startTime === null) {
      setStartTime(Date.now());
    }
  }, [showQuiz, quizCompleted, startTime]);

  const handleAnswer = () => {
    const question = questions[currentQuestion];
    if (answer.toString().toLowerCase() === question.correctAnswer.toString().toLowerCase()) {
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
      setShowHint(true);
    }
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    switch (question.type) {
      case 'options':
        return (
          <RadioButton.Group  onValueChange={(value) => setAnswer(value)} value={answer.toString()}>
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

  if (!showQuiz) {
    return (
      <TouchableOpacity style={styles.showQuizButton} onPress={() => setShowQuiz(true)}>
        <Text style={styles.showQuizButtonText}>{triggerText}</Text>
      </TouchableOpacity>
    );
  }

  if (quizCompleted) {
    return (
      <View style={styles.container}>
        <Text style={styles.congratsMessage}>Congratulations! You've completed the quiz!</Text>
        <TouchableOpacity
          style={styles.hideQuizButton}
          onPress={() => {
            setShowQuiz(false);
            setQuizCompleted(false);
            setCurrentQuestion(0);
            setStartTime(null);
          }}
        >
          <Text style={styles.hideQuizButtonText}>Hide Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const width = Dimensions.get('window').width
  const height = Dimensions.get('window').height

  return (
    <ScrollView style={{width: width, height: height}} contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => setShowQuiz(false)}>
        <X size={24} color="#4A90E2" />
      </TouchableOpacity>
      <Text style={styles.question}>{questions[currentQuestion].question}</Text>
      {renderQuestion()}
      <TouchableOpacity style={styles.submitButton} onPress={handleAnswer}>
        <Text style={styles.submitButtonText}>{submitText}</Text>
      </TouchableOpacity>
      {showHint && (
        <Text style={styles.hint}>Hint: {questions[currentQuestion].hint}</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  showQuizButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  showQuizButtonText: {
    color: 'white',
    fontSize: 18,
  },
  closeButton: {
    alignSelf: 'flex-end',
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
});

export default Quiz;
