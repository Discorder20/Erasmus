import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView
} from 'react-native';
import * as FastApi from '@/src/client';
import { useNavigation } from '@react-navigation/native';

export default function RegistrationScreen() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [rPassword, setRPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [telephoneNumber, setTelephoneNumber] = useState('');
  const [isPressedRegister, setIsPressedRegister] = useState(false);
  const [isPressedBack, setIsPressedBack] = useState(false);
  const navigation = useNavigation();

  const handleRegister = async () => {
    try {
      const response = await FastApi.signUpSignupPost(
        login,
        password,
        firstName,
        lastName,
        email,
        telephoneNumber
      );

      console.log(response);

      if (response?.data) {
        Alert.alert("Rejestracja zakończona!", "Możesz teraz się zalogować.");
      } else {
        Alert.alert("Błąd rejestracji", "Brak danych w odpowiedzi.");
      }
    } catch (error) {
      if (error?.response) {
        Alert.alert("Błąd rejestracji", "Sprawdź poprawność wprowadzonych danych.");
        console.error("Błąd odpowiedzi:", error.response);
      } else if (error?.request) {
        Alert.alert("Błąd rejestracji", "Brak połączenia z serwerem.");
        console.error("Błąd połączenia:", error.request);
      } else {
        Alert.alert("Błąd rejestracji", "Wystąpił nieoczekiwany błąd.");
        console.error("Nieoczekiwany błąd:", error.message);
      }
    }
  };

  const backToLogin = async () => {
      navigation.navigate('Login');
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/erasmus.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>ERASMUS 2025</Text>
      <Text style={styles.subtitle}>Rejestracja</Text>

      <TextInput
        placeholder="Imię"
        style={styles.input}
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
      />

      <TextInput
        placeholder="Nazwisko"
        style={styles.input}
        value={lastName}
        onChangeText={(text) => setLastName(text)}
      />

      <TextInput
        placeholder="Login"
        style={styles.input}
        value={login}
        onChangeText={(text) => setLogin(text)}
      />

      <TextInput
        placeholder="E-mail"
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      <TextInput
        placeholder="Numer telefonu"
        style={styles.input}
        value={telephoneNumber}
        onChangeText={(text) => setTelephoneNumber(text)}
      />

      <TextInput
        placeholder="Hasło"
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
      />

      <TextInput
        placeholder="Powtórz hasło"
        style={styles.input}
        value={rPassword}
        onChangeText={(text) => setRPassword(text)}
        secureTextEntry={true}
      />

      <TouchableOpacity
        style={[
          styles.buttonRegister,
          isPressedRegister && { backgroundColor: '#0056B3' },
        ]}
        onPressIn={() => setIsPressedRegister(true)}
        onPressOut={() => setIsPressedRegister(false)}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>UTWÓRZ KONTO</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>LUB</Text>

      <TouchableOpacity
        style={[
          styles.buttonBack,
          isPressedBack && { backgroundColor: '#218838' },
        ]}
        onPressIn={() => setIsPressedBack(true)}
        onPressOut={() => setIsPressedBack(false)}
        onPress={backToLogin}
      >
        <Text style={styles.buttonText}>POWRÓT</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    overflow: 'auto',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3081e2',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  buttonBack: {
    width: '100%',
    height: 50,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonRegister: {
    width: '100%',
    height: 50,
    backgroundColor: '#28A745',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    fontSize: 16,
    color: '#000',
    marginVertical: 10,
  },
});