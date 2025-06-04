import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 50,
          paddingBottom: 2,
          paddingTop: 5,
          justifyContent: 'center',
          backgroundColor: 'white', // define a cor de fundo da tab bar
          elevation: 0,             // remove sombra no Android
          shadowOpacity: 0,         // remove sombra no iOS
          borderTopWidth: 0,        // remove a borda superior padrão (linha fina)
        },
        tabBarItemStyle: {
          marginHorizontal: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ size }) => (
            <Ionicons name="home-outline" size={30} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="schedules"
        options={{
          title: '',
          tabBarIcon: ({ size }) => (
            <Ionicons name="time-outline" size={30} color="black" />
          ),
        }}
      />
    </Tabs>
  );
}
