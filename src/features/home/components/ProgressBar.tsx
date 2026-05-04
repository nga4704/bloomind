import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export interface ProgressBarProps {
  width: Animated.AnimatedInterpolation<string>;
  opacity: Animated.AnimatedInterpolation<number>;
  backgroundColor?: string;
  fillColor?: string;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  width,
  opacity,
  backgroundColor = 'rgba(255, 255, 255, 0.18)',
  fillColor = '#FFFFFF',
  height = 6,
}) => {
  return (
    <View style={[styles.container, { height }]}>
      <View style={[styles.background, { backgroundColor }]}>
        <Animated.View
          style={[
            styles.fill,
            {
              width,
              opacity,
              backgroundColor: fillColor,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    alignItems: 'center',
  },
  background: {
    width: '100%',
    height: '100%',
    borderRadius: 6,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 6,
  },
});

export default ProgressBar;