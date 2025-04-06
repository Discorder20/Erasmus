import React from 'react';
import { ScrollView, StyleSheet, Text, View, Image, Linking, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReadmeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{marginTop: -30}}>
        <Image
          source={require('@/assets/images/erasmus.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>🌍 Płockie Mapy</Text>

        <Text style={styles.sectionTitle}>🧭 O projekcie</Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>„Płockie Mapy”</Text> to inicjatywa zrealizowana w ramach programu <Text style={styles.bold}>Erasmus+</Text> we współpracy ze szkołą. Projekt ma ułatwić korzystanie z gier w orientacji
          przestrzennej dla użytkowników mobilnych.
        </Text>

        <Text style={styles.sectionTitle}>🛠️ Tech Stack</Text>
        <Text style={styles.text}>
          Aplikacja została stworzona przy użyciu <Text style={styles.bold}>React Native</Text> oraz <Text style={styles.bold}>Expo</Text>, co pozwoliło na szybkie uruchomienie projektu mobilnego. Obsługuje geolokalizację,
          zapisywanie danych w formacie <Text style={styles.bold}>GeoJSON</Text> oraz interakcję z mapą w czasie rzeczywistym.
        </Text>

        <Text style={styles.sectionTitle}>👥 Zespół</Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Architekt Rozwiązania, Team Leader:</Text> Michał Borzuchowski{'\n'}
          <Text style={styles.bold}>Backend Developer, DevOps:</Text> Mateusz Smolarek{'\n'}
          <Text style={styles.bold}>Mobile Development, Frontend:</Text> Paweł Krzeszewski, Jakub Gajewski, Kinga Fabrykiewicz, Wiktor Twardowski, Marcel Fusik{'\n'}
          <Text style={styles.bold}>UI, projektowanie:</Text> Natalia Gorgolewska{'\n'}
          <Text style={styles.bold}>Projektanci Bazy Danych:</Text> Wiktor Lutowski, Filip Bujalski{'\n'}
          <Text style={styles.bold}>Opiekunowie Projektu:</Text> Jeziorska Małgorzata, Milewski Adam
        </Text>

        <Text style={styles.sectionTitle}>📱 Główne funkcje aplikacji</Text>
        <Text style={styles.text}>
          • System do korzystania z gier terenowych pobieranych z chmury (FastAPI, MySQL){'\n'}
          • Automatyczny zapis ostatnio rozegranych gier terenowych{'\n'}
          • Wykorzystanie elementów lokalizacji w grach terenowych (GeoJSON, Expo-Locations){'\n'}
          • Szyfrowany system Logowania i Rejestracji{'\n'}
          • Mechanika punktacji i czasu
        </Text>

        <Text style={styles.sectionTitle}>🔗 Repozytorium</Text>
              <TouchableOpacity onPress={() => Linking.openURL('https://github.com/Discorder20/Erasmus')}>
        <Text style={styles.link}>https://github.com/Discorder20/Erasmus</Text>
              </TouchableOpacity>
        <Text style={styles.link}>https://github.com/Discorder20/Erasmus</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingVertical: 0,
    backgroundColor: '#fff',
  },
  logo: {
    height: 100,
    width: '100%',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  bold: {
    fontWeight: 'bold',
  },
  link: {
    color: '#1e90ff',
    fontSize: 16,
    marginTop: 8,
  },
});
