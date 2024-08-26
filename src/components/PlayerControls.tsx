import React from 'react';
import { View, TouchableOpacity, StyleSheet} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type PlayerControlsProps = {
    isPlaying: boolean;
    isShuffling: boolean;
    isRepeating: boolean;
    handlePlayPause: () => void;
    handleNext: () => void;
    handlePrev: () => void;
    toggleShuffle: () => void;
    toggleRepeat: () => void;
};

const PlayerControls: React.FC<PlayerControlsProps> = ({
    isPlaying,
    isShuffling,
    isRepeating,
    handlePlayPause,
    handleNext,
    handlePrev,
    toggleShuffle,
    toggleRepeat,
}) => {
    return (
        <View style={styles.controls}>
            <TouchableOpacity onPress={toggleShuffle}>
                <Ionicons name={isShuffling ? 'shuffle' : 'shuffle-outline'} size={24} color={isShuffling ? 'orange' : 'black'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePrev}>
                <Ionicons name="play-skip-back" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePlayPause}>
                <Ionicons name={isPlaying ? 'pause-circle' : 'play-circle'} size={48} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNext}>
                <Ionicons name="play-skip-forward" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleRepeat}>
                <Ionicons name={isRepeating ? 'repeat' : 'repeat-outline'} size={24} color={isRepeating ? 'orange' : 'black'} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 20,
        borderRadius:50,
        backgroundColor:'#41b0a7'
    },
});

export default PlayerControls;
