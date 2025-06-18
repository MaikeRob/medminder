import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import Header from '../../components/Header';
import Medication from '../../components/Medication';
import { SafeAreaView } from 'react-native-safe-area-context';
import { medicationService } from '../../data/medicationService';
import { MedicationInterface } from '../../interfaces';
import { useRouter, useFocusEffect } from 'expo-router';

export default function App() {
  const [medications, setMedications] = useState<MedicationInterface[]>([]);
  const router = useRouter();

  const loadMedications = () => {
    const allMedications = medicationService.getAllMedications();
    setMedications(allMedications);
  };

  // Recarrega os medicamentos quando a tela volta ao foco
  useFocusEffect(
    React.useCallback(() => {
      loadMedications();
    }, [])
  );

  const handleAddMedication = () => {
    router.push('/medications/new');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header text="Medicamentos" button onPress={handleAddMedication} />
      <FlatList
        data={medications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Medication medicationObject={item} />
        )}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  listContent: {
    paddingTop: 50,  // ajusta conforme altura do Header,
    alignItems: 'center',
  },
});
