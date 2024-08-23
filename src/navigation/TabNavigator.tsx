import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SongsScreen from '../screens/SongsScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName : keyof typeof Ionicons.glyphMap='musical-notes-outline';

          if (route.name === 'Songs') {
            iconName = focused ? 'musical-notes' : 'musical-notes-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Playlists') {
            iconName = focused ? 'list' : 'list-outline';
          }

          // Return any icon component from @expo/vector-icons
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Songs" component={SongsScreen} />
    </Tab.Navigator>
  );
}
