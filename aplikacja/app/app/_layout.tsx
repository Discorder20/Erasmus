import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native"
import { createDrawerNavigator } from "@react-navigation/drawer"
import * as SplashScreen from "expo-splash-screen"
import { StatusBar } from "expo-status-bar"
import { useEffect } from "react"
import "react-native-reanimated"
import { useFonts } from "expo-font"
import { Image, View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { useColorScheme } from "@/hooks/useColorScheme"

import MyMapScreen from "./(tabs)/mapScreen"
import InCreate from "./(tabs)/inCreate"
import AllGames from "@/components/app/AllGames"
import LastGames from "@/components/app/LastGames"

SplashScreen.preventAutoHideAsync()

const Drawer = createDrawerNavigator()


export default function RootLayout({ handleSignOut, getGames, getCities, getTags }: { handleSignOut: () => Promise<void>; getGames: () => Promise<any[]>; getCities: () => Promise<any[]>; getTags: () => Promise<any[]>;}) {

  function SignOut () : React.JSX.Element {
    handleSignOut();
    return (<View></View>);
  }

  const ProvidedAllGames = () => <AllGames getGames={getGames} getCities={getCities} getTags={getTags}/>

  const drawerScreens = [
    // { name: "UŻYTKOWNIK", id: "User", component: InCreate, icon: require("@/assets/images/user.png") },
    // { name: "WYSZUKAJ GRĘ", id: "Find", component: InCreate, icon: require("@/assets/images/lupa.png") },
    { name: "OSTATNIE GRY", id: "LastGames", component: LastGames, icon: require("@/assets/images/zegar.png") },
    // { name: "USTAWIENIA", id: "Settings", component: InCreate, icon: require("@/assets/images/settings.png") },
    // { name: "USTAWIENIA", id: "Settings", component: InCreate, icon: require("@/assets/images/settings.png") },
    { name: "WSZYSTKIE GRY", id: "AllGames", component: ProvidedAllGames },
    // { name: "Mapa", id: "Map", component: MyMapScreen },
    { name: "Wyloguj się", id: "Wyloguj się", component: SignOut },
  ]

  const CustomDrawerContent = (props: any) => {
    return (
      <View style={styles.drawerContainer}>
        {drawerScreens.map((item) => (
          <TouchableOpacity
            key={item.name}
            onPress={() => props.navigation.navigate(item.name)}
            style={styles.drawerItem}
          >
            <Image source={item.icon} style={{...styles.icon, backgroundColor: colorScheme === "dark" ? "white" : undefined}} />
            <Text style={{...styles.drawerText, color: colorScheme === "dark" ? "white" : "black"}}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )
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
        initialRouteName="OSTATNIE GRY"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: true,
          swipeEnabled: true
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
})