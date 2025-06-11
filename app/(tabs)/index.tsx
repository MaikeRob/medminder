import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import Header from '../../components/Header';
import Medication from '../../components/Medication';
import { SafeAreaView } from 'react-native-safe-area-context';
import medications from "../../data/data.json";
import { MedicationProvider } from '@/contexts/MedicationContext';

export default function App() {

  return (
    <SafeAreaView style={styles.container}>
        <Header text="Medicamentos" button />
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
