import React, { useState } from 'react';
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
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { ScheduleConfig } from '../../components/ScheduleConfig';
import { MedicationType, FrequencyType, Schedule } from '@/interfaces';
import { medicationService } from '../../data/medicationService';

export default function NewMedication() {
  const router = useRouter();

  const [medicationName, setMedicationName] = useState('');
  const [medicationType, setMedicationType] = useState<MedicationType>('comprimido');
  const [nameError, setNameError] = useState('');
  
  // Estado do horário
  const [schedule, setSchedule] = useState<Schedule>({
    id: Date.now().toString(),
    medicationId: '',
    time: '08:00',
    selectedDays: [true, true, true, true, true, true, true],
    frequency: 'daily',
    dayOfMonth: 1,
    checked: false,
  });

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

  const validateForm = () => {
    // Limpar erro anterior
    setNameError('');
    
    // Validar nome do medicamento
    if (!medicationName.trim()) {
      setNameError('O nome do medicamento é obrigatório');
      return false;
    }
    
    if (medicationName.trim().length < 2) {
      setNameError('O nome deve ter pelo menos 2 caracteres');
      return false;
    }
    
    return true;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    // Gerar ID único para o novo medicamento
    const newId = Date.now().toString();
    
    const newMedication = {
      id: newId,
      name: medicationName.trim(),
      type: medicationType,
      schedule: {
        ...schedule,
        id: Date.now().toString(),
        medicationId: newId,
      },
    };
    
    // Salvar usando o serviço
    medicationService.saveMedication(newMedication);
    console.log('Novo medicamento salvo:', newMedication);
    
    // Mostrar confirmação
    Alert.alert(
      'Sucesso',
      'Medicamento adicionado com sucesso!',
      [
        {
          text: 'OK',
          onPress: () => router.back()
        }
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
          <Text style={styles.headerTitle}>Adicionar Medicamento</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Campos de edição */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Nome:</Text>
          <TextInput
            style={[styles.textInput, nameError ? styles.textInputError : null]}
            value={medicationName}
            onChangeText={(text) => {
              setMedicationName(text);
              if (nameError) setNameError(''); // Limpar erro quando usuário digita
            }}
            placeholder="Digite o nome do medicamento"
          />
        </View>
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

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
          <Button title="Adicionar Medicamento" onPress={handleSave} />
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
  textInputError: {
    borderColor: '#ff0000',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginLeft: 96, // Alinhar com o campo de input
    marginTop: -5,
    marginBottom: 5,
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
}); 