import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type ScheduleItemProps = {
  time: string;
  name: string;
  checked: boolean;
  onToggle: () => void;
};

export function ScheduleItem({ time, name, checked, onToggle }: ScheduleItemProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.time}>{time}</Text>
      <TouchableOpacity onPress={onToggle} style={styles.checkboxContainer} activeOpacity={0.7}>
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked && <View style={styles.checkboxInner} />}
        </View>
        <Text style={styles.name}>{name}</Text>
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
  time: {
    width: 72,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    textAlign: 'right',
    marginRight: 16,
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
  name: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
});
