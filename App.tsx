import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './src/navigation/TabNavigator';
import TrackPlayer from 'react-native-track-player';
import { playbackService } from './src/components/playbackService';

export default function App() {
  return (
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
  );
};

TrackPlayer.registerPlaybackService(() => playbackService);