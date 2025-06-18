import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Platform, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FrequencyType } from '../interfaces';

interface ScheduleConfigProps {
  time: string;
  onTimeChange: (time: string) => void;
  selectedDays: boolean[];
  onDaysChange: (days: boolean[]) => void;
  frequency: FrequencyType;
  onFrequencyChange: (frequency: FrequencyType) => void;
  dayOfMonth?: number;
  onDayOfMonthChange?: (day: number) => void;
}

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const FREQUENCY_OPTIONS = [
  { label: 'Diário', value: 'daily' },
  { label: 'Semanal', value: 'weekly' },
  { label: 'Mensal', value: 'monthly' },
];

// Gerar opções de dias do mês (1-31)
const DAYS_OF_MONTH = Array.from({ length: 31 }, (_, i) => i + 1);

export function ScheduleConfig({
  time,
  onTimeChange,
  selectedDays,
  onDaysChange,
  frequency,
  onFrequencyChange,
  dayOfMonth = 1,
  onDayOfMonthChange
}: ScheduleConfigProps) {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);
  const [showDayOfMonthPicker, setShowDayOfMonthPicker] = useState(false);

  // Converter string de tempo para Date
  const getTimeFromString = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // Converter Date para string de tempo
  const getTimeString = (date: Date) => {
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      onTimeChange(getTimeString(selectedDate));
    }
  };

  const toggleDay = (index: number) => {
    const newDays = [...selectedDays];
    newDays[index] = !newDays[index];
    onDaysChange(newDays);
  };

  const selectAllDays = () => {
    onDaysChange(Array(7).fill(true));
  };

  const selectWeekdays = () => {
    onDaysChange([false, true, true, true, true, true, false]);
  };

  const selectWeekend = () => {
    onDaysChange([true, false, false, false, false, false, true]);
  };

  const getActiveDaysText = () => {
    const activeDays = selectedDays
      .map((selected, index) => selected ? DAYS[index] : null)
      .filter(day => day !== null);
    
    if (activeDays.length === 7) return 'Todos os dias';
    if (activeDays.length === 5 && !selectedDays[5] && !selectedDays[6]) return 'Segunda a Sexta';
    if (activeDays.length === 2 && selectedDays[5] && selectedDays[6]) return 'Fim de semana';
    return activeDays.join(', ');
  };

  const getFrequencyText = () => {
    switch (frequency) {
      case 'daily':
        return 'Diário';
      case 'weekly':
        return 'Semanal';
      case 'monthly':
        return `Mensal (dia ${dayOfMonth})`;
      default:
        return '';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Configurar Lembrete</Text>
      
      {/* Horário */}
      <TouchableOpacity 
        style={styles.timeSelector}
        onPress={() => setShowTimePicker(true)}
      >
        <View style={styles.timeDisplay}>
          <Text style={styles.timeLabel}>Horário</Text>
          <Text style={styles.timeValue}>{time}</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      {/* Frequência */}
      <TouchableOpacity 
        style={styles.frequencySelector}
        onPress={() => setShowFrequencyPicker(true)}
      >
        <View style={styles.frequencyDisplay}>
          <Text style={styles.frequencyLabel}>Frequência</Text>
          <Text style={styles.frequencyValue}>{getFrequencyText()}</Text>
        </View>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      {/* Dia do mês (apenas para frequência mensal) */}
      {frequency === 'monthly' && onDayOfMonthChange && (
        <TouchableOpacity 
          style={styles.dayOfMonthSelector}
          onPress={() => setShowDayOfMonthPicker(true)}
        >
          <View style={styles.dayOfMonthDisplay}>
            <Text style={styles.dayOfMonthLabel}>Dia do mês</Text>
            <Text style={styles.dayOfMonthValue}>{dayOfMonth}º</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      )}

      {/* Dias da semana (apenas para frequência semanal) */}
      {frequency === 'weekly' && (
        <View style={styles.daysSection}>
          <Text style={styles.daysLabel}>Dias da semana</Text>
          <Text style={styles.daysSummary}>{getActiveDaysText()}</Text>
          
          <View style={styles.daysContainer}>
            {DAYS.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dayButton, selectedDays[index] && styles.dayButtonSelected]}
                onPress={() => toggleDay(index)}
              >
                <Text style={[styles.dayText, selectedDays[index] && styles.dayTextSelected]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Botões de atalho */}
          <View style={styles.shortcutContainer}>
            <TouchableOpacity style={styles.shortcutButton} onPress={selectAllDays}>
              <Text style={styles.shortcutText}>Todos os dias</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shortcutButton} onPress={selectWeekdays}>
              <Text style={styles.shortcutText}>Seg-Sex</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shortcutButton} onPress={selectWeekend}>
              <Text style={styles.shortcutText}>Fim de semana</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Modal do seletor de horário */}
      {showTimePicker && (
        <DateTimePicker
          value={getTimeFromString(time)}
          mode="time"
          is24Hour={true}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}

      {/* Modal do seletor de frequência */}
      <Modal
        visible={showFrequencyPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFrequencyPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Escolher Frequência</Text>
              <TouchableOpacity onPress={() => setShowFrequencyPicker(false)}>
                <Text style={styles.modalClose}>Fechar</Text>
              </TouchableOpacity>
            </View>
            <Picker
              selectedValue={frequency}
              onValueChange={(value) => {
                onFrequencyChange(value as FrequencyType);
                setShowFrequencyPicker(false);
              }}
              style={styles.modalPicker}
            >
              {FREQUENCY_OPTIONS.map((option) => (
                <Picker.Item 
                  key={option.value} 
                  label={option.label} 
                  value={option.value} 
                />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>

      {/* Modal do seletor de dia do mês */}
      <Modal
        visible={showDayOfMonthPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDayOfMonthPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Escolher Dia do Mês</Text>
              <TouchableOpacity onPress={() => setShowDayOfMonthPicker(false)}>
                <Text style={styles.modalClose}>Fechar</Text>
              </TouchableOpacity>
            </View>
            <Picker
              selectedValue={dayOfMonth}
              onValueChange={(value) => {
                onDayOfMonthChange(value);
                setShowDayOfMonthPicker(false);
              }}
              style={styles.modalPicker}
            >
              {DAYS_OF_MONTH.map((day) => (
                <Picker.Item 
                  key={day} 
                  label={`${day}º`} 
                  value={day} 
                />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#333',
    textAlign: 'center',
  },
  timeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  timeDisplay: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2C6EF2',
  },
  frequencySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  frequencyDisplay: {
    flex: 1,
  },
  frequencyLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  frequencyValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  dayOfMonthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  dayOfMonthDisplay: {
    flex: 1,
  },
  dayOfMonthLabel: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  dayOfMonthValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  chevron: {
    fontSize: 20,
    color: '#6c757d',
    fontWeight: '300',
  },
  daysSection: {
    marginBottom: 16,
  },
  daysLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  daysSummary: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 16,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e9ecef',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayButtonSelected: {
    backgroundColor: '#2C6EF2',
    borderColor: '#2C6EF2',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6c757d',
  },
  dayTextSelected: {
    color: '#fff',
  },
  shortcutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  shortcutButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
  },
  shortcutText: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalClose: {
    fontSize: 16,
    color: '#2C6EF2',
    fontWeight: '500',
  },
  modalPicker: {
    height: 200,
  },
}); 