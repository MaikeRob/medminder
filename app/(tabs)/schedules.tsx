import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, Alert, AppState } from 'react-native';
import { ScheduleItem } from '../../components/ScheduleItem';
import Header from '../../components/Header';
import { medicationService } from '../../data/medicationService';
import { Schedule } from '../../interfaces';

export default function SchedulesScreen() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const notifiedRef = useRef<{ [id: string]: boolean }>({});
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Carrega os lembretes do dia usando o serviço
    const loadTodaySchedules = () => {
      const todaySchedules = medicationService.getTodaySchedules();
      setSchedules(todaySchedules);
    };

    loadTodaySchedules();
  }, []);

  // Alerta interno quando chegar a hora
  useEffect(() => {
    function checkReminders() {
      const now = new Date();
      schedules.forEach((item) => {
        if (item.checked) return;
        const [h, m] = item.time.split(':').map(Number);
        if (isNaN(h) || isNaN(m)) return;
        const itemDate = new Date(now);
        itemDate.setHours(h, m, 0, 0);
        // Se for exatamente a hora e ainda não foi notificado
        if (
          now.getHours() === h &&
          now.getMinutes() === m &&
          !notifiedRef.current[item.id]
        ) {
          notifiedRef.current[item.id] = true;
          Alert.alert(
            'Hora do Remédio',
            `Está na hora de tomar: ${item.medicationName}`,
            [
              {
                text: 'OK',
                onPress: () => {},
              },
            ]
          );
        }
        // Limpa notificação se já passou 2 minutos
        if (
          (now.getTime() - itemDate.getTime()) > 2 * 60 * 1000 &&
          notifiedRef.current[item.id]
        ) {
          notifiedRef.current[item.id] = false;
        }
      });
    }

    intervalRef.current = setInterval(checkReminders, 1000 * 10); // checa a cada 10 segundos
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [schedules]);

  const toggleChecked = (id: string) => {
    medicationService.toggleScheduleChecked(id);
    // Recarregar dados após a mudança
    const updatedSchedules = medicationService.getTodaySchedules();
    setSchedules(updatedSchedules);
  };

  return (
    <>
      <Header text="Lembretes de Hoje" />
      <FlatList
        data={schedules}
        style={styles.flatList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ScheduleItem
            time={item.time}
            name={item.medicationName}
            frequency={item.frequency}
            selectedDays={item.selectedDays}
            dayOfMonth={item.dayOfMonth}
            checked={item.checked}
            onToggle={() => toggleChecked(item.id)}
            now={new Date()}
          />
        )}
      />
    </>
  );
}

const styles = StyleSheet.create({
  flatList: {
    marginTop: 60,
  },
});
