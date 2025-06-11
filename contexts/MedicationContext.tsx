import { createContext, useContext, useState, ReactNode } from 'react';
import { MedicationInterface } from '../interfaces';


interface MedicationContextType {
    medication: MedicationInterface | null;
    setMedication: (med: MedicationInterface) => void;
}


const MedicationContext = createContext<MedicationContextType | null>(null);

export const MedicationProvider = ({ children }: { children: ReactNode }) => {
  const [medication, setMedication] = useState<MedicationInterface | null>(null);

  return (
    <MedicationContext.Provider value={{ medication, setMedication }}>
      {children}
    </MedicationContext.Provider>
  );
};

export const useMedication = () => {
  const context = useContext(MedicationContext);
  if (!context) throw new Error('useMedication deve ser usado dentro de MedicationProvider');
  return context;
};
