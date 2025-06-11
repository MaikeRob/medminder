// components/AppointmentItem.tsx

import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

// Interface que define o formato de um agendamento
export interface Appointment {
  id: number;
  time: string;
  selectedDays: boolean[]; // Array com 7 elementos para cada dia da semana
}

// Propriedades que o componente espera receber
interface AppointmentItemProps {
  appointment: Appointment;
  onUpdate: (appointment: Appointment) => void;
}

const daysOfWeek = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export default function AppointmentItem({ appointment, onUpdate }: AppointmentItemProps) {
  // Função para alternar a seleção de um dia específico
  const handleToggleDay = (index: number) => {
    const newSelectedDays = [...appointment.selectedDays];
    newSelectedDays[index] = !newSelectedDays[index];
    onUpdate({ ...appointment, selectedDays: newSelectedDays });
  };

  // Atualiza o horário do agendamento
  const handleTimeChange = (text: string) => {
    onUpdate({ ...appointment, time: text });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.timeInput}
        value={appointment.time}
        onChangeText={handleTimeChange}
        placeholder="HH:MM"
      />
      <View style={styles.daysContainer}>
        {daysOfWeek.map((day, index) => (
          <TouchableOpacity key={index} onPress={() => handleToggleDay(index)}>
            <Text style={[styles.dayText, appointment.selectedDays[index] && styles.daySelected]}>
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  timeInput: {
    width: 60,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 4,
    textAlign: 'center',
  },
  daysContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayText: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    color: '#333',
  },
  daySelected: {
    backgroundColor: '#007AFF',
    color: '#fff',
    borderColor: '#007AFF',
  },
});
