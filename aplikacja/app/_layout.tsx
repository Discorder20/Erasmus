import { useEffect, useState } from "react"
import RootLayout from "./app/_layout"
import LoginScreen from "@/components/app/Login"
import RegistrationScreen from "@/components/app/Registration"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { View, ActivityIndicator, Text, SafeAreaView } from "react-native"
import { DefaultApi } from "@/src/client"
import { Alert } from "react-native"

async function checkIsLogged(): Promise<boolean> {
  const token = await AsyncStorage.getItem("token")
  return token !== null
}

export default function Layout() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [signPage, setSignPage] = useState<'login' | 'register'>('login');

  useEffect(() => {
    checkIsLogged()
      .then((loggedIn) => {
        setIsLogged(loggedIn)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error checking login status:", error)
        setIsLoading(false)
      })
  }, [])

  const handleLoginSwitch = () => {
    setSignPage('login');
  }

  const handleLogin = async (login : string, password : string) => {
    let api = new DefaultApi();
        try {
          const response = await api.logInLoginPost(login, password);
    
          if (response?.data) {
            await AsyncStorage.setItem('token', response.data.token);
            setIsLogged(true);
          } else {
            Alert.alert("Błąd logowania", "Brak danych w odpowiedzi.");
          }
        } catch (error : any) {
           console.log(error);
          if (error?.response) {
            Alert.alert("Błąd logowania", "Sprawdź dane logowania.");
          } else if (error?.request) {
            Alert.alert("Błąd logowania", "Brak połączenia z serwerem.");
          } else {
            Alert.alert("Błąd logowania", "Wystąpił nieoczekiwany błąd.");
          }
        }
  }

  const handleRegisterSwitch = () => {
    setSignPage('register');
  }

  const handleRegister = async (login: string, password: string, firstName: string, lastName: string, email: string, telephoneNumber: string) => {
    let api = new DefaultApi();
    try {
      const response = await api.signUpSignupPost(
        login,
        password,
        firstName,
        lastName,
        email,
        telephoneNumber
      );

      if (response?.data) {
        await AsyncStorage.setItem('token', response.data.token);
        setIsLogged(true);
      } else {
        Alert.alert("Błąd rejestracji", "Brak danych w odpowiedzi.");
      }
    } catch (error : any) {
      if (error?.response) {
        Alert.alert("Błąd rejestracji", "Sprawdź poprawność wprowadzonych danych.");
      } else if (error?.request) {
        Alert.alert("Błąd rejestracji", "Brak połączenia z serwerem.");
      } else {
        Alert.alert("Błąd rejestracji", "Wystąpił nieoczekiwany błąd.");
      }
    }
  }

  const getGames = async () => {
    let api = new DefaultApi();
    try {
      const response = await api.searchForGameNameSearchForGameNamePost("Wyjście z domu", "id", 0);

      console.log("API response:", response);

      if (response?.data) {
        return response.data;
        console.log("API response:", response.data);
      } else {
        Alert.alert("Błąd pobierania gier", "Brak danych w odpowiedzi.");
        return [];
      }
    } catch (error: any) {
      console.log(error);
      if (error?.response) {
        Alert.alert("Błąd pobierania gier", "Sprawdź poprawność wprowadzonych danych.");
      } else if (error?.request) {
        Alert.alert("Błąd pobierania gier", "Brak połączenia z serwerem.");
      } else {
        Alert.alert("Błąd pobierania gier", "Wystąpił nieoczekiwany błąd.");
      }
    }  
    return [];
  }

  
  const handleSignOut = async () => {
    await AsyncStorage.removeItem('token');
    setIsLogged(false);
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (isLogged) {
    return (
        <RootLayout handleSignOut={handleSignOut} getGames={getGames}/>
    )
  }

  return ( 
    signPage === 'login' ? <LoginScreen handleLogin={handleLogin} handleRegistrationSwitch={handleRegisterSwitch}/> : <RegistrationScreen handleRegister={handleRegister} handleLoginSwitch={handleLoginSwitch}/>
  )
}

