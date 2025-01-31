import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useFonts } from 'expo-font';
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';

import HomeScreen from './(tabs)/index';
import LoginScreen from './(tabs)/login';
import MyMapScreen from './(tabs)/mapScreen';
import RegistrationScreen from './(tabs)/registration';
import InCreate from './(tabs)/inCreate';

SplashScreen.preventAutoHideAsync();

const Drawer = createDrawerNavigator();

const drawerScreens = [
  { name: 'Home', component: HomeScreen, icon: require('@/assets/images/home.png') },
  { name: 'UŻYTKOWNIK', component: InCreate, icon: require('@/assets/images/user.png') },
  { name: 'KREATOR GIER', component: InCreate, icon: require('@/assets/images/notatnik.png') },
  { name: 'WYSZUKAJ GRĘ', component: InCreate, icon: require('@/assets/images/lupa.png') },
  { name: 'OSTSTNIE GRY', component: InCreate, icon: require('@/assets/images/zegar.png') },
  { name: 'USTAWIENIA', component: InCreate, icon: require('@/assets/images/settings.png') },
  { name: 'Login', component: LoginScreen},
  { name: 'Map', component: MyMapScreen},

];

const CustomDrawerContent = (props) => {
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
    </View>
  );
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      {drawerScreens.map((item) => (
        <Drawer.Screen key={item.name} name={item.name} component={item.component} />
      ))}

      <Drawer.Screen name="Registration" component={RegistrationScreen} />
    </Drawer.Navigator>
  );
}

// Style
const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  drawerText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
});
