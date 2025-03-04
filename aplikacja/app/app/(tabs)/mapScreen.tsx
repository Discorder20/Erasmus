import React, { useState, useRef } from 'react';
import { StyleSheet, View, FlatList, Text, ScrollView, TouchableOpacity, Clipboard, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as FileSystem from 'expo-file-system';

export default function App() {
  const [markers, setMarkers] = useState<any>([]);
  const [isListVisible, setIsListVisible] = useState(false);
  const [isJsonVisible, setIsJsonVisible] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const mapRef = useRef<any>(null); // Referencja do MapView

  const handleMapPress = (event : any) => {
    const { coordinate } = event.nativeEvent;
    setMarkers([...markers, coordinate]);
  };

  const handleMarkerPress = (coordinate : any) => {
    const radius = 20;
    setMarkers(markers.filter((marker : any) => {
      const distance = Math.sqrt(
        Math.pow(marker.latitude - coordinate.latitude, 2) +
        Math.pow(marker.longitude - coordinate.longitude, 2)
      );
      return distance > radius / 100000;
    }));
  };

  const toggleListVisibility = () => {
    setIsListVisible(!isListVisible);
  };

  const toggleJsonVisibility = async () => {
    setIsJsonVisible(!isJsonVisible);

    if (!isJsonVisible) {
      const jsonData = JSON.stringify({
        type: "FeatureCollection",
        features: markers.map((marker : any) => ({
          type: "Feature",
          properties: {},
          geometry: {
            type: "Point",
            coordinates: [marker.longitude, marker.latitude],
          },
        })),
      }, null, 2);

      const filePath = FileSystem.documentDirectory + 'markers.json';
      await FileSystem.writeAsStringAsync(filePath, jsonData);
      console.log(`JSON saved to: ${filePath}`);
    }
  };

  const copyJsonToClipboard = () => {
    const jsonData = JSON.stringify({
      type: "FeatureCollection",
      features: markers.map((marker : any) => ({
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: [marker.longitude, marker.latitude],
        },
      })),
    }, null, 2);
    Clipboard.setString(jsonData);
    alert('JSON copied to clipboard!');
  };

  const handleListItemPress = (coordinate : any) => {
    mapRef.current.animateToRegion({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }, 1000); // Adjust the animation duration as needed
  };

  const handleJsonInputChange = (input : any) => {
    setJsonInput(input);
  };

  const handleJsonParse = () => {
    try {
      const newMarkers = JSON.parse(jsonInput).features;
      if (Array.isArray(newMarkers)) {
        const combinedMarkers = [...markers, ...newMarkers.map(feature => ({
          latitude: feature.geometry.coordinates[1],
          longitude: feature.geometry.coordinates[0]
        }))];
        setMarkers(combinedMarkers);
        alert('Markers added successfully!');
      } else {
        alert('Invalid JSON format');
      }
    } catch (error) {
      alert('Error parsing JSON');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        onPress={handleMapPress}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {markers.map((marker : any, index : any) => (
          <Marker
            key={index}
            coordinate={marker}
            onPress={() => handleMarkerPress(marker)}
          />
        ))}
      </MapView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleListVisibility}>
          <Text style={styles.buttonText}>
            {isListVisible ? 'Hide Markers List' : 'Show Markers List'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={toggleJsonVisibility}>
          <Text style={styles.buttonText}>
            {isJsonVisible ? 'Hide Markers JSON' : 'Show Markers JSON'}
          </Text>
        </TouchableOpacity>

        {isListVisible && (
          <FlatList
            style={styles.scrollableContainer}
            data={markers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleListItemPress(item)}>
                <Text style={styles.listItem}>
                  Marker {markers.indexOf(item) + 1}: Latitude {item.latitude.toFixed(6)}, Longitude {item.longitude.toFixed(6)}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}

        {isJsonVisible && (
          <ScrollView style={styles.scrollableContainer}>
            <Text style={styles.jsonOutput}>
              {JSON.stringify({
                type: "FeatureCollection",
                features: markers.map((marker : any) => ({
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "Point",
                    coordinates: [marker.longitude, marker.latitude],
                  },
                })),
              }, null, 2)}
            </Text>
            <TouchableOpacity style={styles.button} onPress={copyJsonToClipboard}>
              <Text style={styles.buttonText}>Copy JSON to Clipboard</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.jsonInput}
              multiline
              value={jsonInput}
              onChangeText={handleJsonInputChange}
              placeholder="Paste JSON here"
            />
            <TouchableOpacity style={styles.button} onPress={handleJsonParse}>
              <Text style={styles.buttonText}>Add Markers from JSON</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  bottomContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  listItem: {
    padding: 10,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  jsonOutput: {
    padding: 10,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginTop: 10,
  },
  scrollableContainer: {
    maxHeight: 500,
    marginTop: 10,
  },
  jsonInput: {
    height: 200,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    marginTop: 40,
    backgroundColor: '#f9f9f9',
  }
});
