import React from 'react';
import { View, Image, Text, StatusBar, Animated } from 'react-native';
import { COLORS } from '../../../contants/colors';
import useSplashAnimation from '../hooks/useSplashAnimation';
import ProgressBar from '../components/ProgressBar';
import { styles } from '../styles/splash';

export const SplashScreen: React.FC = () => {
  const { opacity, progressBarWidth, progressBarOpacity } = useSplashAnimation();

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={COLORS.primary} 
      />
      
      <Animated.View style={[styles.content, { opacity }]}>
        <Image
          source={require('../../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appName}>Bloomind</Text>
        <Text style={styles.tagline}>Mental Health Care</Text>
      </Animated.View>

      <ProgressBar 
        width={progressBarWidth}
        opacity={progressBarOpacity}
      />
    </View>
  );
};

export default SplashScreen;