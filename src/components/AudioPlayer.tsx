import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';

interface AudioPlayerProps {
  sound: Audio.Sound | null;
  onNext: () => void;
  onPrev: () => void;
  onShuffle: () => void;
  onRepeat: () => void;
  isShuffle: boolean;
  isRepeat: boolean;
}

export default function AudioPlayer({
  sound,
  onNext,
  onPrev,
  onShuffle,
  onRepeat,
  isShuffle,
  isRepeat,
}: AudioPlayerProps) {
  const handlePlayPause = async () => {
    if (sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await sound.pauseAsync();
      } else if (status.isLoaded) {
        await sound.playAsync();
      }
    }
  };
  return (
    <View style={styles.playerContainer}>
      <TouchableOpacity onPress={onPrev}>
        <Ionicons name="play-skip-back" size={32} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={handlePlayPause}>
        <Ionicons name="play-circle" size={64} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onNext}>
        <Ionicons name="play-skip-forward" size={32} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onShuffle}>
        <Ionicons
          name={isShuffle ? "shuffle" : "shuffle-outline"}
          size={32}
          color={isShuffle ? "tomato" : "black"}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onRepeat}>
        <Ionicons
          name={isRepeat ? "repeat" : "repeat-outline"}
          size={32}
          color={isRepeat ? "tomato" : "black"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  playerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
    backgroundColor:'#00FFAE',
    borderRadius:50
  },
});