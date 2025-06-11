import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Button,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import AppointmentItem, { Appointment } from '../../components/AppointmentItem';
import { useMedication } from '../../contexts/MedicationContext';
import { MedicationType } from '@/interfaces';

export default function MedicationConfig() {
  const { medication } = useMedication();
  const { id} = useLocalSearchParams();
  const router = useRouter();


  const [medicationName, setMedicationName] = useState(medication?.name || '');
  const [medicationType, setMedicationType] = useState<MedicationType>(medication?.type || 'pilula');

  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 1, time: '08:00', selectedDays: Array(7).fill(false) },
  ]);

  useEffect(() => {
    if (medication?.name) setMedicationName(medication?.name);
    if (medication?.type) setMedicationType(medication?.type);
  }, [medication?.name, medication?.type]);

  const addAppointment = () => {
    const newAppointment: Appointment = {
      id: appointments.length + 1,
      time: '',
      selectedDays: Array(7).fill(false),
    };
    setAppointments([...appointments, newAppointment]);
  };

  const updateAppointment = (updatedAppointment: Appointment) => {
    setAppointments(
      appointments.map(appt => (appt.id === updatedAppointment.id ? updatedAppointment : appt))
    );
  };

  // Header fixo que aparece antes da lista dos agendamentos
  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ID: {id}</Text>
      </View>

      {/* Campos de edição */}
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Nome: </Text>
        <TextInput
          style={styles.textInput}
          value={medicationName}
          onChangeText={setMedicationName}
          placeholder="Digite o nome do medicamento"
        />
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Tipo: </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={medicationType}
            onValueChange={(itemValue) => setMedicationType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Injeção" value="injecao" />
            <Picker.Item label="Pílula" value="pilula" />
            <Picker.Item label="Xarope" value="xarope" />
            <Picker.Item label="Gotejamento" value="gotejamento" />
            <Picker.Item label="Comprimido" value="comprimido" />
            <Picker.Item label="Spray" value="spray" />
          </Picker>
        </View>
      </View>

      {/* Seção de agendamentos: header da área de horários */}
      <View style={styles.scheduleContainer}>
        <View style={styles.scheduleHeader}>
          <Text style={styles.scheduleTitle}>Horários</Text>
          <TouchableOpacity onPress={addAppointment} style={styles.addButton}>
            <MaterialIcons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  // Footer da lista (por exemplo, botão de salvar alterações)
  const renderFooter = () => (
    <View style={styles.saveButtonContainer}>
      <Button
        title="Salvar alterações"
        onPress={() => {
          // Lógica de salvamento
          console.log({ id, medicationName, medicationType, appointments });
        }}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <AppointmentItem appointment={item} onUpdate={updateAppointment} />
        )}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    // Como o header fixo já aparece como parte do assunto do FlatList, não precisamos mais usar position absolute aqui
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  fieldContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    width: 80,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  picker: {
    height: 55,
    width: '100%',
  },
  scheduleContainer: {
    marginVertical: 20,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 50,
  },
  saveButtonContainer: {
    marginVertical: 20,
  },
});
