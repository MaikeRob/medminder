export type MedicationType = 'injecao' | 'xarope' | 'gotejamento' | 'comprimido' | 'spray';

export type FrequencyType = 'daily' | 'weekly' | 'monthly';

export interface Schedule {
    id: string;
    medicationId: string;
    time: string;
    selectedDays: boolean[];
    frequency: FrequencyType;
    dayOfMonth?: number;
    checked: boolean;
}

export interface MedicationInterface {
    id: string;
    name: string;
    type: MedicationType;
    schedule?: Schedule;
}

