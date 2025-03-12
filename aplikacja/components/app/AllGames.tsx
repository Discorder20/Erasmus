import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { FlatList, View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from "react-native";
import { useFonts } from "expo-font";
import Quiz, {type Question} from "../quiz";
<<<<<<< HEAD

const questions: Question[] = [
  {
    id: 1,
    type: "options",
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
    hint: 'It\'s known as the "City of Light".',
  },
  {
    id: 2,
    type: "number",
    question: "How many continents are there?",
    correctAnswer: 7,
    hint: "It's between 6 and 8.",
  },
  {
    id: 3,
    type: "string",
    question: "What is the largest planet in our solar system?",
    correctAnswer: "Jupiter",
    hint: "It's named after the king of the Roman gods.",
  },
  {
    id: 4,
    type: "options",
    question: "Which of these is not a primary color?",
    options: ["Red", "Blue", "Green", "Yellow"],
    correctAnswer: "Green",
    hint: "Primary colors are Red, Blue, and Yellow.",
  },
  {
    id: 5,
    type: "number",
    question: "How many sides does a triangle have?",
    correctAnswer: 3,
    hint: 'It\'s in the name "tri-angle".',
  },
  {
    id: 6,
    type: "string",
    question: "What is the chemical symbol for gold?",
    correctAnswer: "Au",
    hint: 'It comes from the Latin word "aurum".',
  },
  {
    id: 7,
    type: "options",
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Mars",
    hint: "It's named after the Roman god of war.",
  },
  {
    id: 8,
    type: "number",
    question: "In what year did World War II end?",
    correctAnswer: 1945,
    hint: "It was in the mid-1940s.",
  },
  {
    id: 9,
    type: "string",
    question: "Who painted the Mona Lisa?",
    correctAnswer: "Leonardo da Vinci",
    hint: "He was an Italian polymath of the Renaissance.",
  },
  {
    id: 10,
    type: "options",
    question: "Which of these is not a type of cloud?",
    options: ["Cumulus", "Stratus", "Nimbus", "Nebulus"],
    correctAnswer: "Nebulus",
    hint: "Three of these are real cloud types, one is made up.",
  },
  {
    id: 11,
    type: "number",
    question: "How many teeth does an adult human typically have?",
    correctAnswer: 32,
    hint: "It's between 30 and 34.",
  },
  {
    id: 12,
    type: "string",
    question: "What is the largest ocean on Earth?",
    correctAnswer: "Pacific",
    hint: "It covers more than 30% of the Earth's surface.",
  },
  {
    id: 13,
    type: "options",
    question: "Which of these is not a programming language?",
    options: ["Python", "Java", "C++", "Giraffe"],
    correctAnswer: "Giraffe",
    hint: "Three of these are popular programming languages, one is an animal.",
  },
  {
    id: 14,
    type: "number",
    question: "How many players are on a standard soccer team on the field?",
    correctAnswer: 11,
    hint: "It's between 10 and 12.",
  },
  {
    id: 15,
    type: "string",
    question: "What is the capital of Japan?",
    correctAnswer: "Tokyo",
    hint: "It's the world's largest metropolitan area.",
  },
  {
    id: 16,
    type: "options",
    question: "Which of these is not a type of rock?",
    options: ["Igneous", "Sedimentary", "Metamorphic", "Photosynthetic"],
    correctAnswer: "Photosynthetic",
    hint: "Three of these are geological terms, one is biological.",
  },
  {
    id: 17,
    type: "number",
    question: "How many bones are in the adult human body?",
    correctAnswer: 206,
    hint: "It's just over 200.",
  },
  {
    id: 18,
    type: "string",
    question: 'Who wrote the play "Romeo and Juliet"?',
    correctAnswer: "William Shakespeare",
    hint: 'He\'s often referred to as the "Bard of Avon".',
  },
  {
    id: 19,
    type: "options",
    question: "Which of these is not a type of blood group?",
    options: ["A", "B", "AB", "D"],
    correctAnswer: "D",
    hint: "The main blood groups are A, B, AB, and O.",
  },
  {
    id: 20,
    type: "number",
    question: "In what year did the first iPhone come out?",
    correctAnswer: 2007,
    hint: "It was in the late 2000s.",
  },
]

const handleQuizCompleted = (duration: number) => {
  console.log(`Quiz completed in ${duration} seconds`)
  // You can add more logic here, such as sending the result to a server
}
=======
import RNPickerSelect from 'react-native-picker-select';
import _ from 'lodash';
import { useCallback } from 'react';
>>>>>>> 41cbaf1 (Adding filtering and sorting of games)

const questions: Question[] = [
  {
    id: 1,
    type: "options",
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
    hint: 'It\'s known as the "City of Light".',
  },

]

const handleQuizCompleted = (duration: number) => {
  console.log(`Quiz completed in ${duration} seconds`);
  // You can add more logic here, such as sending the result to a server
}

export default function AllGamesScreen({ getGames, getCities, getTags }: { getGames: (filters: { tag?: string; name?: string; author?: string; date?: string; city?: string; sort?: string; skip?: number; }) => Promise<any[]>; getCities: () => Promise<any[]>; getTags: () => Promise<any[]> }) {
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

  const fetchGames = async () => {
        setLoading(true);
        try {
            console.log("Aktualne filtry:", filters);
            const gamesData = await getGames(filters);
            console.log("Pobrane gry:", gamesData);
            setGames(gamesData);
        } catch (error) {
            console.error("Błąd pobierania gier:", error);
            Alert.alert("Błąd", "Nie udało się pobrać listy gier.");
        } finally {
            setLoading(false);
        }
    };

  const fetchCities = async () => {
      try {
          const citiesData = await getCities();
          console.log("Pobrane miasta:", citiesData);
          setCities(citiesData);
      } catch (error) {
          console.error("Błąd pobierania miast:", error);
          Alert.alert("Błąd", "Nie udało się pobrać listy miast.");
      }
  };

  const fetchTags = async () => {
      try {
          const tagsData = await getTags();
          console.log("Pobrane tagi:", tagsData);
          setTags(tagsData);
      } catch (error) {
          console.error("Błąd pobierania tagów:", error);
          Alert.alert("Błąd", "Nie udało się pobrać listy tagów.");
      }
  };

  const handleInputChange = useCallback(
    _.debounce((field, value) => {
      setFilters(prev => ({ ...prev, [field]: value }));
    }, 1000),
    []
  );

  useEffect(() => {
      if (loaded) {
        SplashScreen.hideAsync();
      }
        fetchGames();
        fetchCities();
        fetchTags();
  }, [filters, loaded]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Ładowanie gier...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setFiltersVisible(!filtersVisible)} style={styles.toggleButton}>
        <Text style={styles.toggleButtonText}>{filtersVisible ? "Ukryj filtry" : "Pokaż filtry"}</Text>
      </TouchableOpacity>
      {filtersVisible && (
        <View style={styles.filterSection}>

          <RNPickerSelect
            placeholder={{ label: "Wybierz tag", value: null }}
            onValueChange={(value) => setFilters(prev => ({ ...prev, tag: value }))}
            items={tags.length > 0 ? tags.map(tag => ({ label: tag.name, value: tag.name })) : [{ label: "Brak dostępnych tagów", value: null }]}
            value={filters.tag}
          />

          <TextInput
            placeholder="Wpisz nazwę"
            value={filters.name}
            onChangeText={(value) => handleInputChange("name", value)}
            style={styles.input}
          />

          <TextInput
            placeholder="Wpisz autora"
            value={filters.author}
            onChangeText={(value) => handleInputChange("author", value)}
            style={styles.input}
          />

          <TextInput
            placeholder="Wpisz datę(rrrr-mm-dd)"
            value={filters.date}
            onChangeText={(value) => handleInputChange("date", value)}
            style={styles.input}
          />

          <RNPickerSelect
            placeholder={{ label: "Wybierz miasto", value: null }}
            onValueChange={(value) => setFilters(prev => ({ ...prev, city: value }))}
            items={cities.length > 0 ? cities.map(city => ({ label: city.name, value: city.name })) : [{ label: "Brak dostępnych miast", value: null }]}
            value={filters.city}
          />

          <RNPickerSelect
            placeholder={{ label: "Wybierz sposób sortowania sortowanie", value: null }}
            onValueChange={(value) => setFilters(prev => ({ ...prev, sort: value }))}
            items={[{ label: "Tag", value: "tag" }, { label: "Nazwa", value: "name" }, { label: "Autor", value: "author" }, { label: "Data", value: "date" }, { label: "Miasto", value: "city" }]}
            value={filters.sort}
          />
        </View>
      )}
      {games.length === 0 ? (
          <Text>Brak gier do wyświetlenia</Text>
      ) : (
        <FlatList
          data={games}
          renderItem={({ item }) => (
            <View style={styles.gameItem}>
              <View style={styles.gameTextContainer}>
                <Text style={styles.gameTitle}>{item.title}</Text>
                <Text style={styles.gameDescription}>{item.Description?.length > 70 ? `${item.Description.substring(0, 70)}...` : item.Description || "Brak opisu"}</Text>
              </View>
<<<<<<< HEAD
                <Quiz
                  questions={questions}
                  triggerText="Start Quiz"
                  submitText="Submit Answer"
                  onCompleted={handleQuizCompleted}
                  title={item.title}
                  description={item.Description}
                />
=======
              <Quiz
                questions={questions}
                triggerText="Start Quiz"
                submitText="Submit Answer"
                onCompleted={handleQuizCompleted}
                title={item.title}
                description={item.Description}
              />
>>>>>>> 41cbaf1 (Adding filtering and sorting of games)
            </View>
          )}
          keyExtractor={(item, index) => (item.id ? item.id.toString() : `game-${index}`)}
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
  toggleButton: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
    marginBottom: 10
  },
  toggleButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold"
  },
  filterSection: {
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
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
