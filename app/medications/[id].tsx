import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Button,
  ScrollView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { ScheduleConfig } from '../../components/ScheduleConfig';
import { MedicationType, FrequencyType, Schedule } from '@/interfaces';
import { medicationService } from '../../data/medicationService';

export default function MedicationConfig() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Buscar medicamento diretamente do serviço
  const medication = medicationService.getMedicationById(id as string);

  const [medicationName, setMedicationName] = useState(medication?.name || '');
  const [medicationType, setMedicationType] = useState<MedicationType>(medication?.type ? medication.type : 'comprimido');
  
  // Estado do horário
  const [schedule, setSchedule] = useState<Schedule>({
    id: medication?.schedule?.id || Date.now().toString(),
    medicationId: id as string,
    time: medication?.schedule?.time || '08:00',
    selectedDays: medication?.schedule?.selectedDays || [true, true, true, true, true, true, true],
    frequency: medication?.schedule?.frequency || 'daily',
    dayOfMonth: medication?.schedule?.dayOfMonth || 1,
    checked: medication?.schedule?.checked || false,
  });

  useEffect(() => {
    if (medication?.name) {
      setMedicationName(medication.name);
    }
    if (medication?.type) setMedicationType(medication.type);
    if (medication?.schedule) setSchedule(medication.schedule);
  }, [medication]);

  const handleTimeChange = (time: string) => {
    setSchedule(prev => ({ ...prev, time }));
  };

  const handleDaysChange = (selectedDays: boolean[]) => {
    setSchedule(prev => ({ ...prev, selectedDays }));
  };

  const handleFrequencyChange = (frequency: FrequencyType) => {
    setSchedule(prev => ({ ...prev, frequency }));
  };

  const handleDayOfMonthChange = (dayOfMonth: number) => {
    setSchedule(prev => ({ ...prev, dayOfMonth }));
  };

  const handleSave = () => {
    const updatedMedication = {
      id: id as string,
      name: medicationName,
      type: medicationType,
      schedule: {
        ...schedule,
        medicationId: id as string,
      },
    };
    
    // Salvar usando o serviço
    medicationService.saveMedication(updatedMedication);
    console.log('Medicamento salvo:', updatedMedication);
    
    // Voltar para a tela anterior
    router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      'Excluir Medicamento',
      `Tem certeza que deseja excluir "${medicationName}"? Esta ação não pode ser desfeita.`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            // Excluir o medicamento
            medicationService.deleteMedication(id as string);
            console.log('Medicamento excluído:', id);
            
            // Mostrar confirmação e voltar
            Alert.alert(
              'Medicamento Excluído',
              'O medicamento foi excluído com sucesso.',
              [
                {
                  text: 'OK',
                  onPress: () => router.back()
                }
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Configurar Medicamento</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Campos de edição */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Nome:</Text>
          <TextInput
            style={styles.textInput}
            value={medicationName}
            onChangeText={setMedicationName}
            placeholder="Digite o nome do medicamento"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Tipo:</Text>
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

        {/* Configuração de horário */}
        <ScheduleConfig
          time={schedule.time}
          onTimeChange={handleTimeChange}
          selectedDays={schedule.selectedDays}
          onDaysChange={handleDaysChange}
          frequency={schedule.frequency}
          onFrequencyChange={handleFrequencyChange}
          dayOfMonth={schedule.dayOfMonth}
          onDayOfMonthChange={handleDayOfMonthChange}
        />

        {/* Botão de salvar */}
        <View style={styles.saveButtonContainer}>
          <Button title="Salvar alterações" onPress={handleSave} />
        </View>

        {/* Botão de excluir */}
        <View style={styles.deleteButtonContainer}>
          <Button 
            title="Excluir Medicamento" 
            onPress={handleDelete}
            color="#ff0000"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
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
  fieldContainer: {
    marginVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    width: 80,
    fontWeight: '500',
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  saveButtonContainer: {
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  deleteButtonContainer: {
    marginVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 30,
  },
});
