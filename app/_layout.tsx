import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Slot } from "expo-router";
import { MedicationProvider } from "@/contexts/MedicationContext";

export default function RootLayout() {
  return (
    <MedicationProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Slot />
      </SafeAreaView>
    </MedicationProvider>
  );
}
