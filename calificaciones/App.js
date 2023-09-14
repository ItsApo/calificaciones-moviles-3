import React from 'react';
import { View, Text } from 'react-native';
import Formulario from './src/components/formulario';
import styles from './src/styles/styles';

export default function App() {
  return (
    <View style={styles.centerFormulario}>
      <Text style={[styles.title, styles.grande]}>Calificaciones</Text>
      <Formulario />
    </View>
  );
}
