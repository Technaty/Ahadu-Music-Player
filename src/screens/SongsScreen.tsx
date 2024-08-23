import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Audio } from 'expo-av';
import AudioPlayer from '../components/AudioPlayer';

export default function SongsScreen() {
  const [audioFiles, setAudioFiles] = useState<MediaLibrary.Asset[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentAudioIndex, setCurrentAudioIndex] = useState<number | null>(null);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  useEffect(() => {
    async function loadAudioFiles() {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        const media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio' });
        setAudioFiles(media.assets);
      }
    }

    loadAudioFiles();
  }, []);

  const playAudio = async (audioIndex: number) => {
    const audio = audioFiles[audioIndex];
    if (sound) {
      await sound.unloadAsync();
    }
    const { sound: newSound } = await Audio.Sound.createAsync({ uri: audio.uri });
    setSound(newSound);
    setCurrentAudioIndex(audioIndex);
    await newSound.playAsync();
  };

  const playPauseAudio = async (audioIndex: number) => {
    const audio = audioFiles[audioIndex];
    if (currentAudioIndex === audioIndex && sound) {
      const status = await sound.getStatusAsync();
      if (status.isLoaded && status.isPlaying) {
        await sound.pauseAsync();
      } else if (status.isLoaded) {
        await sound.playAsync();
      }
    } else {
      await playAudio(audioIndex);
    }
  };

  const handleNext = () => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * audioFiles.length);
      playAudio(randomIndex);
    } else if (currentAudioIndex !== null && currentAudioIndex < audioFiles.length - 1) {
      playAudio(currentAudioIndex + 1);
    } else if (isRepeat) {
      playAudio(0);  // Repeat from the start
    }
  };

  const handlePrev = () => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * audioFiles.length);
      playAudio(randomIndex);
    } else if (currentAudioIndex !== null && currentAudioIndex > 0) {
      playAudio(currentAudioIndex - 1);
    } else if (isRepeat) {
      playAudio(audioFiles.length - 1);  // Repeat from the last
    }
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const toggleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={audioFiles}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => playPauseAudio(index)}>
            <Text style={styles.audioItem}>{item.filename}</Text>
          </TouchableOpacity>
        )}
      />
      <AudioPlayer
        sound={sound}
        onNext={handleNext}
        onPrev={handlePrev}
        onShuffle={toggleShuffle}
        onRepeat={toggleRepeat}
        isShuffle={isShuffle}
        isRepeat={isRepeat}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  audioItem: {
    padding: 10,
    fontSize: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});