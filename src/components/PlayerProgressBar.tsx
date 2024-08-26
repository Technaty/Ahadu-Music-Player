import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { timeConverter } from '../utility/timeConverter';

interface PlayerProgressBarProps {
    duration: number;
    position: number;
    onSlidingComplete: (value: number) => void;
}

const PlayerProgressBar: React.FC<PlayerProgressBarProps> = ({ duration, position, onSlidingComplete }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.time}>{timeConverter(position)}</Text>
            <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={duration}
                value={position}
                onSlidingComplete={onSlidingComplete}
                minimumTrackTintColor="#1DB954"
                maximumTrackTintColor="#000000"
                thumbTintColor="#1DB954"
            />
            <Text style={styles.time}>{timeConverter(duration)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        alignSelf: 'center',
    },
    time: {
        color: '#000',
        marginHorizontal: 10,
    },
    slider: {
        flex: 1,
    },
});

export default PlayerProgressBar;
