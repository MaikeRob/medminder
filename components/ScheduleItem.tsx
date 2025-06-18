import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FrequencyType } from '../interfaces';

type ScheduleItemProps = {
  time: string;
  name: string;
  frequency: FrequencyType;
  selectedDays: boolean[];
  dayOfMonth?: number;
  checked: boolean;
  onToggle: () => void;
  now?: Date;
};

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function ScheduleItem({ 
  time, 
  name, 
  frequency, 
  selectedDays, 
  dayOfMonth,
  checked, 
  onToggle,
  now
}: ScheduleItemProps) {
  const getFrequencyText = () => {
    switch (frequency) {
      case 'daily':
        return 'Diário';
      case 'weekly':
        return 'Semanal';
      case 'monthly':
        return `Mensal (dia ${dayOfMonth || 1})`;
      default:
        return '';
    }
  };

  const getActiveDaysText = () => {
    const activeDays = selectedDays
      .map((selected, index) => selected ? DAYS[index] : null)
      .filter(day => day !== null);
    
    if (activeDays.length === 7) return 'Todos os dias';
    if (activeDays.length === 5 && !selectedDays[5] && !selectedDays[6]) return 'Seg-Sex';
    if (activeDays.length === 2 && selectedDays[5] && selectedDays[6]) return 'Fim de semana';
    return activeDays.join(', ');
  };

  let isPast = false;
  if (now && !checked) {
    const [h, m] = time.split(':').map(Number);
    const itemDate = new Date(now);
    itemDate.setHours(h, m, 0, 0);
    isPast = now.getTime() > itemDate.getTime();
  }

  return (
    <View style={[styles.container, isPast && styles.pastContainer]}>
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{time}</Text>
        <Text style={styles.frequency}>{getFrequencyText()}</Text>
      </View>
      <TouchableOpacity onPress={onToggle} style={styles.checkboxContainer} activeOpacity={0.7}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked && <View style={styles.checkboxInner} />}
        </View>
        <View style={styles.medicationInfo}>
          <Text style={styles.name}>{name}</Text>
          {frequency === 'weekly' && (
            <Text style={styles.days}>{getActiveDaysText()}</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const BOX_SIZE = 28;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  pastContainer: {
    backgroundColor: '#ffeaea',
  },
  timeContainer: {
    width: 80,
    alignItems: 'flex-end',
    marginRight: 16,
  },
  time: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    textAlign: 'right',
  },
  frequency: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 2,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderWidth: 1.5,
    borderColor: '#999',
    borderRadius: 6,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  checkboxChecked: {
    backgroundColor: '#2C6EF2',
    borderColor: '#2C6EF2',
  },
  checkboxInner: {
    width: 12,
    height: 12,
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  medicationInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
  days: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
