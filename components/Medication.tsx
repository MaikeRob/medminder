import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { MedicationInterface } from '../interfaces';
import { MedicationType } from '../interfaces';

interface MedicationProps {
  medicationObject: MedicationInterface;
}

const typeIcons: Record<MedicationType, string> = {
  injecao: 'needle',
  xarope: 'bottle-tonic',
  gotejamento: 'water',
  comprimido: 'pill',
  spray: 'spray-bottle',
};

export default function Medication({ medicationObject }: MedicationProps) {
  const router = useRouter();
  const iconName = typeIcons[medicationObject.type as MedicationType] || 'help-circle';

  function navigateToMedicationScreen(id: string) {
    router.push(`/medications/${id}`);
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigateToMedicationScreen(medicationObject.id)}
    >
      <Text style={styles.text}>{medicationObject.name}</Text>
      <MaterialCommunityIcons name={iconName as any} size={32} color="black" />
    </TouchableOpacity>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});
