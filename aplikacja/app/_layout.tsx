import { useEffect, useState } from "react"
import RootLayout from "./app/_layout"
import LoginScreen from "@/components/app/Login"
import RegistrationScreen from "@/components/app/Registration"
import AllGamesScreen from "@/components/app/AllGames"
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

const getGames = async (filters: {
    tag?: string;
    name?: string;
    author?: string;
    date?: string;
    city?: string;
    sort?: string;
    skip?: number;
} = {}) => {
    let api = new DefaultApi();
    try {
        const response = await api.searchForGameSearchForGamePost(
            filters.tag,
            filters.name,
            filters.author,
            filters.date,
            filters.city,
            filters.sort,
            filters.skip || 0
        );

        if (!response?.data || !Array.isArray(response.data)) {
            Alert.alert("Błąd pobierania gier", "Nieprawidłowa odpowiedź z serwera.");
            return [];
        }

        if (response.data.length === 0) {
            Alert.alert("Brak wyników", "Nie znaleziono żadnych gier.");
            return [];
        }

        const gameMap = new Map();

        response.data.forEach(game => {
            if (!game?.id) return;

            if (gameMap.has(game.id)) {
                const existingGame = gameMap.get(game.id);
                existingGame.Tag = existingGame.Tag ? `${existingGame.Tag}, ${game.Tag || ""}` : game.Tag || "";
            } else {
                gameMap.set(game.id, { ...game, Tag: game.Tag || "" });
            }
        });

        return Array.from(gameMap.values());

    } catch (error) {
        // console.error("Błąd pobierania gier:", error);

        // if (error?.response) {
        //     Alert.alert("Błąd pobierania gier", `Błąd serwera: ${error.response.status}`);
        // } else if (error?.request) {
        //     Alert.alert("Błąd pobierania gier", "Brak odpowiedzi od serwera. Sprawdź połączenie internetowe.");
        // } else {
        //     Alert.alert("Błąd pobierania gier", "Wystąpił nieoczekiwany błąd.");
        // }
        return [];
    }
};


  const getCities = async () => {
      let api = new DefaultApi();
      try {
          const response = await api.getCitiesCitiesPost();

          if (!response?.data || !Array.isArray(response.data)) {
              // Alert.alert("Błąd pobierania miast", "Nieprawidłowa odpowiedź z serwera.");
              // return [];
          }

          if (response.data.length === 0) {
              // Alert.alert("Brak wyników", "Nie znaleziono dostępnych miast.");
              return [];
          }

          return response.data;
      } catch (error) {
          // console.error("Błąd pobierania miast:", error);

          // if (error?.response) {
          //     Alert.alert("Błąd pobierania miast", `Błąd serwera: ${error.response.status}`);
          // } else if (error?.request) {
          //     Alert.alert("Błąd pobierania miast", "Brak odpowiedzi od serwera. Sprawdź połączenie internetowe.");
          // } else {
          //     Alert.alert("Błąd pobierania miast", "Wystąpił nieoczekiwany błąd.");
          // }
          return [];
      }
  };


  const getTags = async () => {
      let api = new DefaultApi();
      try {
          const response = await api.getTagsTagsPost();

          if (!response?.data || !Array.isArray(response.data)) {
              Alert.alert("Błąd pobierania tagów", "Nieprawidłowa odpowiedź z serwera.");
              return [];
          }

          if (response.data.length === 0) {
              Alert.alert("Brak wyników", "Nie znaleziono dostępnych tagów.");
              return [];
          }

          return response.data;
      } catch (error) {
          console.error("Błąd pobierania tagów:", error);

          // if (error?.response) {
          //     Alert.alert("Błąd pobierania tagów", `Błąd serwera: ${error.response.status}`);
          // } else if (error?.request) {
          //     Alert.alert("Błąd pobierania tagów", "Brak odpowiedzi od serwera. Sprawdź połączenie internetowe.");
          // } else {
          //     Alert.alert("Błąd pobierania tagów", "Wystąpił nieoczekiwany błąd.");
          // }
          return [];
      }
  };


  
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
      <>
        <RootLayout handleSignOut={handleSignOut} getGames={getGames} getCities={getCities} getTags={getTags}/>

      </>
    );
  }

  return (
      signPage === 'login' ? <LoginScreen handleLogin={handleLogin} handleRegistrationSwitch={handleRegisterSwitch}/> : <RegistrationScreen handleRegister={handleRegister} handleLoginSwitch={handleLoginSwitch}/>
    )


  }

