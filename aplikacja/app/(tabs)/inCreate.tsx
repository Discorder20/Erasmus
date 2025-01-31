import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

export default function InCreate() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>W budowie</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3081e2',
    marginBottom: 5,
  },
});