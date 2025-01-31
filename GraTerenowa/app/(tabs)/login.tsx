import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {DefaultApi} from '@/src/client';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isPressedLogin, setIsPressedLogin] = useState(false);
  const [isPressedRegister, setIsPressedRegister] = useState(false);
  const navigation = useNavigation();

  const handleLogin = async () => {
    try {
      const response = await LogInLoginPost(login, password);
      console.log(response);

      if (response?.data) {
        Alert.alert("Zalogowano pomyślnie!", "Witaj w aplikacji!");
      } else {
        Alert.alert("Błąd logowania", "Brak danych w odpowiedzi.");
      }
    } catch (error) {
       console.log(error);
      if (error?.response) {
        Alert.alert("Błąd logowania", "Sprawdź dane logowania.");
        console.error("Błąd odpowiedzi:", error.response);
      } else if (error?.request) {
        Alert.alert("Błąd logowania", "Brak połączenia z serwerem.");
        console.error("Błąd połączenia:", error.request);
      } else {
        Alert.alert("Błąd logowania", "Wystąpił nieoczekiwany błąd.");
        console.error("Nieoczekiwany błąd:", error.message);
      }
    }
  };

  const goToRegistration = async () => {
    navigation.navigate('Registration');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/erasmus.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>ERASMUS 2025</Text>
      <Text style={styles.subtitle}>Panel logowania</Text>
      <TextInput
        placeholder="Login"
        style={styles.input}
        value={login}
        onChangeText={(text) => setLogin(text)}
      />
      <TextInput
        placeholder="Hasło"
        style={styles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
      />

      <TouchableOpacity
        style={[
          styles.buttonLogin,
          isPressedLogin && { backgroundColor: '#0056B3' },
        ]}
        onPressIn={() => setIsPressedLogin(true)}
        onPressOut={() => setIsPressedLogin(false)}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>ZALOGUJ SIĘ</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>LUB</Text>

      <TouchableOpacity
        style={[
          styles.buttonRegister,
          isPressedRegister && { backgroundColor: '#218838' },
        ]}
        onPressIn={() => setIsPressedRegister(true)}
        onPressOut={() => setIsPressedRegister(false)}
        onPress={goToRegistration}
      >
        <Text style={styles.buttonText}>STWÓRZ KONTO</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
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
  buttonLogin: {
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