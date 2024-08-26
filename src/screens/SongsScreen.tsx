import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import PlayerControls from '../components/PlayerControls';
import PlayerProgressBar from '../components/PlayerProgressBar'; // Import PlayerProgressBar



export default function SongsScreen() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioFiles, setAudioFiles] = useState<MediaLibrary.Asset[]>([]);
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const [currentAudioIndex, setCurrentAudioIndex] = useState<number | null>(null);
    const [isShuffling, setIsShuffle] = useState(false);
    const [isRepeating, setIsRepeat] = useState(false);
    const [position, setPosition] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    useEffect(() => {
        const configureAudio = async (): Promise<void> => {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                staysActiveInBackground: true,
                interruptionModeIOS: InterruptionModeIOS.DoNotMix,
                playsInSilentModeIOS: true,
                shouldDuckAndroid: true,
                interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
                playThroughEarpieceAndroid: false,
            });
        };
        async function loadAudioFiles() {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status === 'granted') {
                const media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio' });
                setAudioFiles(media.assets);
            }
        }
        configureAudio();
        loadAudioFiles();
        return sound ? () => { sound.unloadAsync(); } : undefined;
    }, [sound]);

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
            if (status.isLoaded) {
                setPosition(status.positionMillis / 1000); // Update position in seconds
                setDuration((status.durationMillis ?? 0) /1000); // Update duration in seconds
                if (status.didJustFinish) {
                    handleNext();  // Automatically play the next song
                }
            }
        });

        await newSound.playAsync();
        setIsPlaying(true);
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
        setIsShuffle(!isShuffling);
    };

    const toggleRepeat = () => {
        setIsRepeat(!isRepeating);
    };

    const handleSlidingComplete = async (value: number) => {
        if (sound) {
            await sound.setPositionAsync(value * 1000);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={audioFiles}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                    <View style={styles.audioItemContainer}>
                        <TouchableOpacity onPress={() => playAudio(index)} style={styles.audioItem}>
                            <Text>{item.filename}</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
            {/* Player Progress Bar */}
            <PlayerProgressBar
                duration={duration}
                position={position}
                onSlidingComplete={handleSlidingComplete}
            />
            {/* Player Controls */}
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor:'#96b5a8'
    },
    audioItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 25,
        borderBottomWidth: 0,
        borderBottomColor: '#ddd',
    },
    audioItem: {
        flex: 1,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});
