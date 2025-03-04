import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native"
import { createDrawerNavigator } from "@react-navigation/drawer"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react"
import "react-native-reanimated"
import { useFonts } from "expo-font"
import { Image, View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native"
import { useColorScheme } from "@/hooks/useColorScheme"
import { DefaultApi } from '@/src/client';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

SplashScreen.preventAutoHideAsync()

export default function LoginScreen({handleRegistrationSwitch, handleLogin} : {handleRegistrationSwitch: () => void, handleLogin: (login : string, password : string) => Promise<void>}) {
  const colorScheme = useColorScheme()
  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) {
    return null
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <LoginForm handleLogin={handleLogin} handleRegistrationSwitch={handleRegistrationSwitch} />
      <StatusBar />
    </ThemeProvider>
  )
}

function LoginForm({handleRegistrationSwitch, handleLogin} : {handleRegistrationSwitch: () => void, handleLogin: (login : string, password : string) => Promise<void>}) {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isPressedLogin, setIsPressedLogin] = useState(false);
  const [isPressedRegister, setIsPressedRegister] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    handleLogin(login, password)
  };

  const goToRegistration = async () => {
    handleRegistrationSwitch();
  };

  return (
    <View style={loginStyles.container}>
      <Image
        source={require('@/assets/images/erasmus.png')}
        style={loginStyles.logo}
      />
      <Text style={loginStyles.title}>ERASMUS 2025</Text>
      <Text style={loginStyles.subtitle}>Panel logowania</Text>
      <TextInput
        placeholder="Login"
        placeholderTextColor="#5F5F5F"
        style={loginStyles.input}
        value={login}
        onChangeText={(text) => setLogin(text)}
      />
      <TextInput
        placeholder="Hasło"
        placeholderTextColor="#5F5F5F"
        style={loginStyles.input}
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
      />

      <TouchableOpacity
        style={[
          loginStyles.buttonLogin,
          isPressedLogin && { backgroundColor: '#0056B3' },
        ]}
        onPressIn={() => setIsPressedLogin(true)}
        onPressOut={() => setIsPressedLogin(false)}
        onPress={handleSubmit}
      >
        <Text style={loginStyles.buttonText}>ZALOGUJ SIĘ</Text>
      </TouchableOpacity>

      <Text style={loginStyles.orText}>LUB</Text>

      <TouchableOpacity
        style={[
            loginStyles.buttonRegister,
          isPressedRegister && { backgroundColor: '#218838' },
        ]}
        onPressIn={() => setIsPressedRegister(true)}
        onPressOut={() => setIsPressedRegister(false)}
        onPress={goToRegistration}
      >
        <Text style={loginStyles.buttonText}>STWÓRZ KONTO</Text>
      </TouchableOpacity>
    </View>
  );
}

const loginStyles = StyleSheet.create({
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