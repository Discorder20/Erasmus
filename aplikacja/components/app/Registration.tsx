import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native"
import { createDrawerNavigator } from "@react-navigation/drawer"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react"
import "react-native-reanimated"
import { useFonts } from "expo-font"
import { Image, View, Text, TouchableOpacity, StyleSheet, TextInput, ScrollView } from "react-native"
import { useColorScheme } from "@/hooks/useColorScheme"
import { DefaultApi } from '@/src/client';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

SplashScreen.preventAutoHideAsync()
let api = new DefaultApi();

export default function RegistrationScreen({handleLoginSwitch, handleRegister} : {handleLoginSwitch: () => void, handleRegister: (login: string, password: string, firstName: string, lastName: string, email: string, telephoneNumber: string) => Promise<void>}) {
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
      <RegistrationForm handleRegister={handleRegister} handleLoginSwitch={handleLoginSwitch}/>
      <StatusBar />
    </ThemeProvider>
  )
}

function RegistrationForm({handleLoginSwitch, handleRegister} : {handleLoginSwitch: () => void, handleRegister: (login: string, password: string, firstName: string, lastName: string, email: string, telephoneNumber: string) => Promise<void>}) {
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

  const handleSumbit = async () => {
    handleRegister(login, password, firstName, lastName, email, telephoneNumber)
  };

  const backToLogin = async () => {
      handleLoginSwitch();
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
        onPress={handleSumbit}
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

const styles : any = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: 20,
      overflow: 'scroll',
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