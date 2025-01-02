import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';

export default function LoginScreen() {
  const [isPressedLogin, setIsPressedLogin] = useState(false);
  const [isPressedRegister, setIsPressedRegister] = useState(false);

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: '',
        }}
        style={styles.logo}
      />
      <Text style={styles.title}>ERASMUS 2025</Text>
      <Text style={styles.subtitle}>Panel logowania</Text>
      <TextInput placeholder="Login" style={styles.input} />
      <TextInput placeholder="Hasło" style={styles.input} secureTextEntry={true} />

      <TouchableOpacity
        style={[
          styles.buttonLogin,
          isPressedLogin && { backgroundColor: '#0056B3' },
        ]}
        onPressIn={() => setIsPressedLogin(true)}
        onPressOut={() => setIsPressedLogin(false)}
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
    width: 100,
    height: 100,
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
