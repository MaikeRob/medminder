import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import { ScheduleItem } from '../../components/ScheduleItem';
import  Header  from '../../components/Header';
 
export default function SchedulesScreen() {
  const [schedules, setSchedules] = useState([
    { id: '1', time: '08:00', name: 'Paracetamol', checked: false },
    { id: '2', time: '12:00', name: 'Ibuprofeno', checked: true },
    { id: '3', time: '18:00', name: 'Amoxicilina', checked: false },
  ]);

  const toggleChecked = (id: string) => {
    setSchedules((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <>
    <Header text="Lista"/>
    <FlatList
      data={schedules}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ScheduleItem
          time={item.time}
          name={item.name}
          checked={item.checked}
          onToggle={() => toggleChecked(item.id)}
        />
      )}
    />
    </>
  );
}
