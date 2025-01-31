import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
//import { Image } from 'expo-image';

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3081e2',
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },

  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },

  buttonCreate: {
    width: '100%',
    height: 50,
    backgroundColor: '#28A745',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonReturn: {
    width: '100%',
    height: 50,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  text: {
    color: '#fff',
    fontSize: 18,
  },

  TextOr: {
    fontSize: 16,
    color: '#000',
    marginVertical: 10,
  },

  logo: {
    width: 250,
    height: 250,
    marginBottom: 20,
  }
});

export default function Home() {
   const [isPressedCreate, setIsPressedCreate] = useState(false);
   const [isPressedReturn, setIsPressedReturn] = useState(false);
      return (
        <View style={styles.body}>
          <Image source={require('@/assets/images/erasmus.png')} style={styles.logo} />
          <Text style={styles.title}>ERASMUS 2025</Text>
          <Text style={styles.subtitle}>Rejerstracja</Text>
          <TextInput placeholder="Login" style={styles.input} />
          <TextInput placeholder="Hasło" style={styles.input} secureTextEntry={true} />
          <TextInput placeholder='Powtórz hasło' style={styles.input} secureTextEntry={true}/>
          <TouchableOpacity style={[ styles.buttonCreate,  isPressedCreate && { backgroundColor: '#28A745' }, ]}
            onPress={() => setIsPressedCreate(true)}><Text style={styles.text}>UTWÓRZ KONTO</Text></TouchableOpacity>
          <Text style={styles.TextOr}>LUB</Text>
           <TouchableOpacity style={[ styles.buttonReturn, isPressedReturn && { backgroundColor: '#007BFF' }, ]} onPress={() => setIsPressedReturn(true)} >
                  <Text style={styles.text}>POWRÓT</Text>
           </TouchableOpacity>
        </View>
      );
    }
    