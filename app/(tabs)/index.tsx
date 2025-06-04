import React from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import Header from '../../components/Header';
import Medication from '../../components/Medication';
import { SafeAreaView } from 'react-native-safe-area-context';

const medications = [
  { id: '1', name: 'Xarope', type: 'xarope' },
  { id: '2', name: 'Dipirona', type: 'gotejamento' },
  { id: '3', name: 'Omeprazol', type: 'pilula' },
  { id: '4', name: 'Metilcobalamina', type: 'injecao' },
];

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Header text="Medicamentos" button />
      <FlatList
        data={medications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Medication name={item.name} type={item.type as any} />
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
