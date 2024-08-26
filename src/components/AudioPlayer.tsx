// AudioPlayer.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PlayerControls from './PlayerControls';
import { Audio } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';

const AudioPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);
    const [isRepeating, setIsRepeating] = useState(false);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [audioFiles, setAudioFiles] = useState<MediaLibrary.Asset[]>([]);
    const [currentAudioIndex, setCurrentAudioIndex] = useState<number | null>(null);

    const playAudio = async (audioIndex: number) => {
      const audio = audioFiles[audioIndex];
      if (sound) {
        await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audio.uri },
        { shouldPlay: true }
      );
      setSound(newSound);
      setCurrentAudioIndex(audioIndex);
  
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          handleNext();  // Automatically play the next song
        }
      });
  
      await newSound.playAsync();
    };

    const handlePlayPause = async () => {
      if (sound) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          if (status.isPlaying) {
            await sound.pauseAsync();
            setIsPlaying(false);
          } else {
            await sound.playAsync();
            setIsPlaying(true);
          }
        }
      }
    };

  const handleNext = () => {
    if (isShuffling) {
      const randomIndex = Math.floor(Math.random() * audioFiles.length);
      playAudio(randomIndex);
    } else if (currentAudioIndex !== null && currentAudioIndex < audioFiles.length - 1) {
      playAudio(currentAudioIndex + 1);
    } else if (isRepeating) {
      playAudio(0);  // Repeat from the start
    }
  };

  const handlePrev = () => {
    if (isShuffling) {
      const randomIndex = Math.floor(Math.random() * audioFiles.length);
      playAudio(randomIndex);
    } else if (currentAudioIndex !== null && currentAudioIndex > 0) {
      playAudio(currentAudioIndex - 1);
    } else if (isRepeating) {
      playAudio(audioFiles.length - 1);  // Repeat from the last
    }
  };

    const toggleShuffle = () => {
        setIsShuffling(!isShuffling);
    };

    const toggleRepeat = () => {
        setIsRepeating(!isRepeating);
    };

    return (
        <View style={styles.container}>
            <PlayerControls
                isPlaying={isPlaying}
                isShuffling={isShuffling}
                isRepeating={isRepeating}
                handlePlayPause={handlePlayPause}
                handleNext={handleNext}
                handlePrev={handlePrev}
                toggleShuffle={toggleShuffle}
                toggleRepeat={toggleRepeat}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
});

export default AudioPlayer;
