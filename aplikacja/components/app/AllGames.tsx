import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { FlatList, View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useFonts } from "expo-font";

export default function AllGamesScreen({ getGames }: { getGames: () => Promise<any[]> }) {
  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGames = async () => {
    try {
      const gamesData = await getGames();
      setGames(gamesData);
    } catch (error) {
      console.error("Błąd pobierania gier:", error);
      Alert.alert("Błąd", "Nie udało się pobrać listy gier.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
    fetchGames();
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
              <TouchableOpacity style={styles.playButton}>
                <Text style={styles.playButtonText}>Graj</Text>
              </TouchableOpacity>
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
