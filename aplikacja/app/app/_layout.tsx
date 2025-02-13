import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native"
import { createDrawerNavigator } from "@react-navigation/drawer"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { useEffect, useState } from "react"
import { useFonts } from "expo-font"
import { Image, View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native"
import { useColorScheme } from "@/hooks/useColorScheme"
import { Ionicons } from '@expo/vector-icons'; // Możesz zainstalować tę bibliotekę, aby użyć ikon

import MyMapScreen from "./(tabs)/mapScreen"
import InCreate from "./(tabs)/inCreate"

SplashScreen.preventAutoHideAsync()

const Drawer = createDrawerNavigator()

export default function RootLayout({ handleSignOut, getGames }: { handleSignOut: () => Promise<void>, getGames: () => Promise<{ id: number, title: string, Description: string }[]> }) {
  const [games, setGames] = useState<any[]>([]);
  const [isGamesOpen, setIsGamesOpen] = useState(false);

  function SignOut(): React.JSX.Element {
    handleSignOut();
    return (<View></View>);
  }

  const fetchGames = async () => {
    const gamesData = await getGames();
    setGames(gamesData);
  };

  // Fetch games on component mount
  useEffect(() => {
    fetchGames();
  }, []);

  const drawerScreens = [
    { name: "UŻYTKOWNIK", id: "User", component: InCreate, icon: require("@/assets/images/user.png") },
    { name: "WYSZUKAJ GRĘ", id: "Find", component: InCreate, icon: require("@/assets/images/lupa.png") },
    { name: "OSTATNIE GRY", id: "Last", component: InCreate, icon: require("@/assets/images/zegar.png") },
    { name: "USTAWIENIA", id: "Settings", component: InCreate, icon: require("@/assets/images/settings.png") },
    { name: "Mapa", id: "Map", component: MyMapScreen },
    { name: "Wyloguj się", id: "Wyloguj się", component: SignOut },
  ]

  const toggleGamesList = () => {
    setIsGamesOpen(!isGamesOpen);
  };

  const CustomDrawerContent = (props: any) => {
    return (
      <View style={styles.drawerContainer}>
        {drawerScreens.map((item) => (
          <TouchableOpacity
            key={item.name}
            onPress={() => props.navigation.navigate(item.name)}
            style={styles.drawerItem}
          >
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.drawerText}>{item.name}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={toggleGamesList} style={styles.drawerItem}>
          <Ionicons name={isGamesOpen ? "chevron-up" : "chevron-down"} size={24} color="black" />
          <Text style={styles.drawerText}>Wszystkie Gry</Text>
        </TouchableOpacity>

        {isGamesOpen && (
          <FlatList
            data={games}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => console.log(`Wybrano grę: ${item.title}`)} style={styles.gameItem}>
                <Text style={styles.gameTitle}>{item.title}</Text>

                <Text style={styles.gameDescription}>
                  {item.Description?.length > 50
                    ? `${item.Description.substring(0, 50)}...`
                    : item.Description || 'Brak opisu'}
                </Text>

                <TouchableOpacity onPress={() => console.log(`Gra: ${item.title}`)} style={styles.playButton}>
                  <Text style={styles.playButtonText}>Graj</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.gameList}
          />
        )}
      </View>
    );
  }

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
      <Drawer.Navigator
        initialRouteName="Mapa"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: true,
          swipeEnabled: true,
        }}
      >
        {drawerScreens.map((item) => (
          <Drawer.Screen
            key={item.id}
            name={item.name}
            component={item.component}
            options={{
              drawerIcon: ({ color, size }) => <Image source={item.icon} style={[styles.icon, { tintColor: color }]} />,
            }}
          />
        ))}
      </Drawer.Navigator>
      <StatusBar />
    </ThemeProvider>
  )
}

// Style
const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingVertical: 20,
    paddingTop: 60,
    paddingHorizontal: 15,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  drawerText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333",
  },
  gameList: {
    paddingLeft: 15,  // Odstęp dla listy gier
  },
  gameItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  gameDescription: {
    fontSize: 14,
    color: "#777",
    marginBottom: 12,
  },
  playButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  playButtonText: {
    color: "#fff",
    fontSize: 16,
  },
})
