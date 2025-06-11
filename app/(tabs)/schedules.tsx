import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { ScheduleItem } from '../../components/ScheduleItem';
import Header from '../../components/Header';
import medications from "../../data/data.json";

interface Schedule {
  id: number;
  name: string;
  day: string;
  time: string;
  checked: boolean;
}

export default function SchedulesScreen() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    const data: Schedule[] = medications.flatMap(med =>
      med.schedules.map(schedule => ({
        id: schedule.id,
        name: med.name,
        day: schedule.day,
        time: schedule.time,
        checked: schedule.checked ?? false
      }))
    );

    console.log(data);
    setSchedules(data);
  }, []);

  const toggleChecked = (id: number) => {
    setSchedules(prev =>
      prev.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <>
      <Header text="Lembretes" />
      <FlatList
        data={schedules}
        style={styles.flatList} // Estilo aplicado para criar margem superior
        keyExtractor={(item) => item.id.toString()}
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

const styles = StyleSheet.create({
  flatList: {
    marginTop: 60, // Ajuste o valor conforme necessário
  },
});
