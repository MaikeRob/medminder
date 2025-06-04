import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type MedicationType = 'injecao' | 'pilula' | 'xarope' | 'gotejamento' | 'comprimido' | 'spray';

interface MedicationProps {
  name: string;
  type: MedicationType;
}

const typeIcons: Record<MedicationType, string> = {
  injecao: 'needle',
  pilula: 'pill',
  xarope: 'bottle-tonic',
  gotejamento: 'water',
  comprimido: 'tablet',
  spray: 'spray-bottle',
};

export default function Medication({ name, type }: MedicationProps) {
  const iconName = typeIcons[type];

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{name}</Text>
      <MaterialCommunityIcons name={iconName} size={32} color="black" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 5,

    // Sombra para iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,

    // Sombra para Android
    elevation: 2,
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});
