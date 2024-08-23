import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './src/navigation/TabNavigator';
import * as SplashScreen from 'expo-splash-screen';


export default function App() {
  useEffect(() => {
    async function hideSplashScreen() {
      await SplashScreen.hideAsync();
    }

    hideSplashScreen();
  }, []);

  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}