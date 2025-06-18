import { MedicationInterface, Schedule, MedicationType, FrequencyType } from '../interfaces';
import medicationsData from './medications.json';
import schedulesData from './schedules.json';

class MedicationService {
  private medications: MedicationInterface[] = [];
  private schedules: Schedule[] = [];

  constructor() {
    this.loadData();
  }

  private loadData() {
    // Carrega dados dos medicamentos
    this.medications = medicationsData.map(med => ({
      ...med,
      type: med.type as MedicationType,
      schedule: med.schedule ? {
        ...med.schedule,
        frequency: med.schedule.frequency as FrequencyType || 'daily',
        dayOfMonth: (med.schedule as any).dayOfMonth || 1
      } : undefined
    }));

    // Carrega dados dos horários
    this.schedules = schedulesData.map(schedule => ({
      ...schedule,
      frequency: schedule.frequency as FrequencyType || 'daily',
      dayOfMonth: (schedule as any).dayOfMonth || 1
    }));
  }

  // Buscar todos os medicamentos
  getAllMedications(): MedicationInterface[] {
    return this.medications;
  }

  // Buscar medicamento por ID
  getMedicationById(id: string): MedicationInterface | undefined {
    return this.medications.find(med => med.id === id);
  }

  // Buscar todos os horários
  getAllSchedules(): Schedule[] {
    return this.schedules;
  }

  // Buscar horários por medicamento
  getSchedulesByMedication(medicationId: string): Schedule[] {
    return this.schedules.filter(schedule => schedule.medicationId === medicationId);
  }

  // Salvar medicamento
  saveMedication(medication: MedicationInterface): void {
    const index = this.medications.findIndex(med => med.id === medication.id);
    if (index >= 0) {
      this.medications[index] = medication;
    } else {
      this.medications.push(medication);
    }
    
    // Atualizar horário se existir
    if (medication.schedule) {
      this.saveSchedule(medication.schedule);
    }
  }

  // Salvar horário
  saveSchedule(schedule: Schedule): void {
    const index = this.schedules.findIndex(s => s.id === schedule.id);
    if (index >= 0) {
      this.schedules[index] = schedule;
    } else {
      this.schedules.push(schedule);
    }
  }

  // Deletar medicamento
  deleteMedication(id: string): void {
    this.medications = this.medications.filter(med => med.id !== id);
    this.schedules = this.schedules.filter(schedule => schedule.medicationId !== id);
  }

  // Marcar horário como concluído
  toggleScheduleChecked(scheduleId: string): void {
    const schedule = this.schedules.find(s => s.id === scheduleId);
    if (schedule) {
      schedule.checked = !schedule.checked;
    }
  }

  // Buscar horários para hoje
  getTodaySchedules(): Schedule[] {
    const today = new Date();
    const todayDayOfWeek = today.getDay(); // 0 = Domingo, 1 = Segunda, etc.
    const todayDayOfMonth = today.getDate(); // 1-31
    
    // Função para obter o último dia do mês atual
    const getLastDayOfMonth = () => {
      const year = today.getFullYear();
      const month = today.getMonth();
      return new Date(year, month + 1, 0).getDate();
    };
    
    return this.schedules.filter(schedule => {
      if (schedule.frequency === 'daily') {
        return true; // Diário sempre aparece
      }
      if (schedule.frequency === 'weekly') {
        return schedule.selectedDays[todayDayOfWeek]; // Verifica se o dia da semana atual está selecionado
      }
      if (schedule.frequency === 'monthly') {
        const lastDayOfMonth = getLastDayOfMonth();
        const effectiveDayOfMonth = Math.min(schedule.dayOfMonth || 1, lastDayOfMonth);
        return effectiveDayOfMonth === todayDayOfMonth; // Verifica se é o dia do mês (ou último dia se o dia escolhido não existir)
      }
      return false;
    });
  }

  // Buscar horários pendentes
  getPendingSchedules(): Schedule[] {
    return this.schedules.filter(schedule => !schedule.checked);
  }

  // Limpar todos os horários marcados
  clearAllChecked(): void {
    this.schedules.forEach(schedule => {
      schedule.checked = false;
    });
  }
}

// Instância singleton
export const medicationService = new MedicationService(); 