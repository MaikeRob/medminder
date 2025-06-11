export type MedicationType = 'injecao' | 'pilula' | 'xarope' | 'gotejamento' | 'comprimido' | 'spray';

export interface Schedule {
    id: string;
    day: string;
    time: string;
    checked: boolean;
}

export interface MedicationInterface {
    id: string;
    name: string;
    type: MedicationType;
    schedules: Schedule[];
}

