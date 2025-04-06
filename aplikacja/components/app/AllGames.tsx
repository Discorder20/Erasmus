import { useEffect, useState, useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import { FlatList, View, Text, TouchableOpacity, StyleSheet, Alert, TextInput, Platform, ScrollView } from "react-native";
import { useFonts } from "expo-font";
import Quiz, { type Question, type QuestionType } from "../quiz";
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


const handleQuizCompleted = (duration: number) => {
  console.log(`Quiz completed in ${duration} seconds`);
  // You can add more logic here, such as sending the result to a server
}

const mockQuestion : Question = {
  id: -1,
  correctAnswer: 'none',
  hint: 'no hint for mock',
  question: 'this is a mock question, if you see it, there are questions missing',
  type: 'string',
  points: 0
}

export default function AllGamesScreen({ 
  getGames, 
  getCities, 
  getTags 
}: { 
  getGames: (filters: { 
    tag?: string; 
    name?: string; 
    author?: string; 
    date?: string; 
    city?: string; 
    sort?: string; 
    skip?: number; 
  }) => Promise<any[]>; 
  getCities: () => Promise<any[]>; 
  getTags: () => Promise<any[]> 
}) {
  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });
  
  const [games, setGames] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState({
    tag: undefined,
    name: undefined,
    author: undefined,
    date: undefined,
    city: undefined,
    sort: undefined,
  });
  
  // Input state for controlled components
  const [inputValues, setInputValues] = useState({
    name: '',
    author: '',
    date: '',
  });
  
  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setInputValues(prev => ({ ...prev, [field]: value }));
  };
  
  // Apply filters when the apply button is clicked
  const applyFilters = () => {
    setFilters((prev: any) => {
      return {
        ...prev,
        name: inputValues.name || undefined,
        author: inputValues.author || undefined,
        date: inputValues.date || undefined,
      }
    });
    fetchGames();
  };

  const fetchGames = async () => {
    setLoading(true);
    try {
      const gamesData = await getGames(filters);
      setGames(gamesData);
    } catch (error) {
      console.error("Error fetching games:", error);
      Alert.alert("Error", "Failed to fetch games list.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCities = async () => {
    try {
      const citiesData = await getCities();
      setCities(citiesData);
    } catch (error) {
      console.error("Error fetching cities:", error);
      Alert.alert("Error", "Failed to fetch cities list.");
    }
  };

  const fetchTags = async () => {
    try {
      const tagsData = await getTags();
      setTags(tagsData);
    } catch (error) {
      console.error("Error fetching tags:", error);
      Alert.alert("Error", "Failed to fetch tags list.");
    }
  };

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

        let hint = task.Hints;
        try {
          hint = JSON.parse(hint); 
        }catch (e) {
          hint = undefined;
        }

        task["Task Type"] == "Choice Task" ? console.log(options[task["Corrcect Option Index"]]) : null


        const mappedTask: Question = {
          id: task["Task Number"],
          type: taskTypeMap[task["Task Type"]] || "string",  
          question: task.Question,
          correctAnswer: task.Answer || (task["Corrcect Option Index"] ? options[task["Corrcect Option Index"]] : undefined),  
          hint: hint || undefined, 
          options: options || undefined,  
          pointX: task.CoordX || undefined, 
          pointY: task.CoordY || undefined, 
          points: task.Points || undefined,
        };
  
        questions.push(mappedTask);
      });
    });
  
    return questions;
  };

  const saveGameToStorage = async (gameData: any) => {
  try {
    const storedData = await AsyncStorage.getItem("openedGames");
    const openedGames = storedData ? JSON.parse(storedData) : [];

    const exists = openedGames.some((game: any) => game.title === gameData.title);

    if (!exists) {
      openedGames.push(gameData);
      await AsyncStorage.setItem("openedGames", JSON.stringify(openedGames));
      console.log("Gra zapisana:", gameData.title);
    }
  } catch (error) {
    console.error("Błąd zapisu gry:", error);
  }
};
  

  // Initial data loading
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }

    const fetchData = async () => {
      setTags(await getTags());
      setCities(await getCities());
      fetchGames();
    };

    fetchData();
  }, [loaded]);

  // Fetch games when filters change

  // Reset filters function
  const resetFilters = () => {
    setFilters({
      tag: undefined,
      name: undefined,
      author: undefined,
      date: undefined,
      city: undefined,
      sort: undefined,
    });
    setInputValues({
      name: '',
      author: '',
      date: '',
    });
  };

  if (!loaded) {
    return null; // Still loading fonts
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={() => setFiltersVisible(!filtersVisible)} 
        style={styles.toggleButton}
      >
        <Text style={styles.toggleButtonText}>
          {filtersVisible ? "Ukryj Filtry" : "Pokaż Filtry"}
        </Text>
      </TouchableOpacity>
      
      {filtersVisible && (
        <>
        <ScrollView style={styles.filterSection}>
          <Text style={styles.pickerLabel}>Wybierz tag:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={filters.tag}
              onValueChange={(value) => setFilters(prev => ({ ...prev, tag: value }))}
              style={{...styles.picker, ...(Platform.OS === 'ios' ? { height: 150, margin: 0, padding: 0 } : {})}}
              mode={"dialog"}
            >
              <Picker.Item label="Wybierz tag" value={undefined} />
              {tags.length > 0 ? (
                tags.map((tag, index) => (
                  <Picker.Item key={index} label={tag.name} value={tag.name} />
                ))
              ) : (
                <Picker.Item label="Brak dostępnych tagów" value={undefined} />
              )}
            </Picker>
          </View>

          <TextInput
            placeholder="Wprowadź nazwę gry"
            value={inputValues.name}
            onChangeText={(value) => handleInputChange("name", value)}
            style={styles.input}
          />

          <TextInput
            placeholder="Wprowadź autora"
            value={inputValues.author}
            onChangeText={(value) => handleInputChange("author", value)}
            style={styles.input}
          />

          <TextInput
            placeholder="Wprowadź datę (yyyy-mm-dd)"
            value={inputValues.date}
            onChangeText={(value) => handleInputChange("date", value)}
            style={styles.input}
          />

          <Text style={styles.pickerLabel}>Wybierz miasto:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={filters.city}
              onValueChange={(value) => setFilters(prev => ({ ...prev, city: value }))}
              style={{...styles.picker, ...(Platform.OS === 'ios' ? { height: 150, margin: 0, padding: 0 } : {})}}
              mode={"dialog"}
            >
              <Picker.Item label="Wybierz miasto" value={undefined} />
              {cities.length > 0 ? (
                cities.map((city, index) => (
                  <Picker.Item key={index} label={city.name} value={city.name} />
                ))
              ) : (
                <Picker.Item label="Brak dostępnych miast" value={undefined} />
              )}
            </Picker>
          </View>

          <Text style={styles.pickerLabel}>Sortuj po:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={filters.sort}
              onValueChange={(value) => setFilters(prev => ({ ...prev, sort: value }))}
              style={{...styles.picker, ...(Platform.OS === 'ios' ? { height: 150, margin: 0, padding: 0 } : {})}}
              mode={"dialog"}
            >
              <Picker.Item label="Wybierz opcję" value={undefined} />
              <Picker.Item label="Tag" value="tag" />
              <Picker.Item label="Name" value="name" />
              <Picker.Item label="Author" value="author" />
              <Picker.Item label="Date" value="date" />
              <Picker.Item label="City" value="city" />
            </Picker>
          </View>

        </ScrollView>
      <View style={styles.buttonRow}>
            <TouchableOpacity 
              onPress={applyFilters} 
              style={styles.applyButton}
            >
              <Text style={styles.buttonText}>Zastosuj Filtry</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={resetFilters} 
              style={styles.resetButton}
            >
              <Text style={styles.buttonText}>Zresetuj</Text>
            </TouchableOpacity>
          </View>

          </>

      )}
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Ładowanie gier...</Text>
        </View>
      ) : games.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nie znaleziono gier</Text>
        </View>
      ) : (
        <FlatList
          data={games}
          renderItem={({ item }) => {return (
            <View style={styles.gameItem}>
              <View style={styles.gameTextContainer}>
                <Text style={styles.gameTitle}>{item.title}</Text>
                <Text style={styles.gameDescription}>
                  {item.Description?.length > 70 
                    ? `${item.Description.substring(0, 70)}...` 
                    : item.Description || "No description available"}
                </Text>
                {item.tag && (
                  <View style={styles.tagContainer}>
                    <Text style={styles.tagText}>{item.tag}</Text>
                  </View>
                )}
              </View>
              <Quiz
                questions={item.Tasks.length > 0 ? mapTasksToQuestions([item.Tasks || []]) : [mockQuestion]}
                addToAS={() => {
                  console.log("saveGameToStorage is being called");
                  saveGameToStorage(item);
                }}
                triggerText="Rozpocznij Quiz"
                submitText="Zatwierdź odpowiedź"
                onCompleted={handleQuizCompleted}
                title={item.title}
                description={item.Description}
              />
            </View>
          )}}
          keyExtractor={(item, index) => (item.id ? item.id.toString() : `game-${index}`)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  toggleButton: {
    padding: 12,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
  },
  toggleButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  filterSection: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    height: 500,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    backgroundColor: "#fafafa",
    fontSize: 16,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 8,
    marginBottom: 4,
    color: "#333",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 8,

    backgroundColor: "#fafafa",
    overflow: "hidden",
  },
  picker: {
    height: 60,
    width: "100%",
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingBottom: 10
  },
  applyButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  resetButton: {
    backgroundColor: "#f44336",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  refreshButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  gameItem: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  gameTextContainer: {
    flex: 1,
    marginRight: 15,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  gameDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  tagContainer: {
    backgroundColor: "#e0f7fa",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginVertical: 5,
  },
  tagText: {
    color: "#00838f",
    fontSize: 12,
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  listContent: {
    paddingBottom: 20,
  },
});