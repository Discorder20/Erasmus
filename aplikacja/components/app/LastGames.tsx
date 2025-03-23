import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { FlatList, View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useFonts } from "expo-font";
import Quiz, { type Question, type QuestionType } from "../quiz";
import AsyncStorage from "@react-native-async-storage/async-storage";

const handleQuizCompleted = (duration: number) => {
  console.log(`Quiz completed in ${duration} seconds`)
  // You can add more logic here, such as sending the result to a server
}

const mapTasksToQuestions = (tasksArray: any[][]): Question[] => {
    const questions: Question[] = [];
  
    const taskTypeMap: Record<string, QuestionType> = {
      "Choice Task": "options",
      "Number Task": "number",
      "Text Task": "string",
      "Location Task": "map",
    };
  
    tasksArray.forEach((tasks) => {
      tasks.forEach((task) => {

        let options = task.Options;
        try {
          options = JSON.parse(options); 
        }catch (e) {
          options = undefined;
        }

        const mappedTask: Question = {
          id: task["Task Number"],
          type: taskTypeMap[task["Task Type"]] || "string",  
          question: task.Question,
          correctAnswer: task.Answer || task["Corrcect Option Index"] || undefined,  
          hint: task.Hints || undefined, 
          options: options || undefined,  
          pointX: task.CoordX || undefined, 
          pointY: task.CoordY || undefined,  
        };
  
        questions.push(mappedTask);
      });
    });

    console.log(questions);
  
    return questions;
  };

export default function AllGamesScreen() {
  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGames = async () => {
    setLoading(true);
    try {
      const storedGames = await AsyncStorage.getItem("games");
      const gamesData = storedGames ? JSON.parse(storedGames) : [];
      setGames(gamesData);
    } catch (error) {
      console.error("Błąd pobierania gier z AsyncStorage:", error);
      Alert.alert("Błąd", "Nie udało się załadować gier.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeApp = async () => {
      if (loaded) {
        await SplashScreen.hideAsync();
      }

      try {
        const storedGames = await AsyncStorage.getItem("games");
        if (!storedGames) {
          const initialGames = [
            {
              id: 1,
              title: "Sylwester u Zduniaka",
              City: "Gąbin",
              DateOfCreation: "2024-12-31",
              Description: "Impreza sylwestrowa ze wstępem wolnym dla każdego w Przytułach",
              Tag: "",
              Tags: ["Zabawa", "Ciekawe", "Nie zdrowe"],
              Tasks: [],
              User: "Filip",
            },
            {
              id: 2,
              title: "Rowerowe szaleństwo",
              City: "Gąbin",
              DateOfCreation: "2025-01-13",
              Description: "Zapraszam wszystkich zainteresowanych do wspólnych szaleństw na Pump Tracku. Wszyscy mile widziani.",
              Tag: "",
              Tags: ["Sport", "Dla każdego", "Wyczynowe"],
              Tasks: [],
              User: "Wiktor",
            },
          ];
          await AsyncStorage.setItem("games", JSON.stringify(initialGames));
        }
      } catch (error) {
        console.error("Błąd zapisu gier do AsyncStorage:", error);
      }

      fetchGames();
    };

    initializeApp();
  }, [loaded]);


  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Ładowanie gier...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {games.length === 0 ? (
        <Text>Brak gier do wyświetlenia</Text>
      ) : (
        <FlatList
          data={games}
          renderItem={({ item }) => (
            <View style={styles.gameItem}>
              <View style={styles.gameTextContainer}>
                <Text style={styles.gameTitle}>{item.title}</Text>
                <Text style={styles.gameDescription}>
                  {item.Description?.length > 70
                    ? `${item.Description.substring(0, 70)}...`
                    : item.Description || "Brak opisu"}
                </Text>
              </View>
                <Quiz
                  questions={mapTasksToQuestions([item.Tasks || []])}
                  triggerText="Rozpocznij Quiz"
                  submitText="Zatwierdź odpowiedź"
                  onCompleted={handleQuizCompleted}
                  title={item.title}
                  description={item.Description}
                />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  gameItem: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    justifyContent: 'center',
    alignItems: 'center'
  },
  gameTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  gameDescription: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  playButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  playButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
});