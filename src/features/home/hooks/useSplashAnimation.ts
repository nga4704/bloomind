import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../app/navigation/types";

// Animation constants
const ANIMATION_DURATION = 4000;
const FADE_DURATION = 500;

const useSplashAnimation = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const progress = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    startAnimations();

    return () => {
      animationRef.current?.stop();
    };
  }, []);

  const startAnimations = () => {
    // Fade in animation
    Animated.timing(opacity, {
      toValue: 1,
      duration: FADE_DURATION,
      useNativeDriver: true,
    }).start();

    // Progress bar animation
    animationRef.current = Animated.timing(progress, {
      toValue: 1,
      duration: ANIMATION_DURATION,
      easing: Easing.inOut(Easing.quad),
      useNativeDriver: false,
    });

    animationRef.current.start(({ finished }) => {
      if (finished) {
        navigation.replace("Login");
      }
    });
  };

  const progressBarWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const progressBarOpacity = progress.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.9, 1, 0.9],
  });

  return {
    opacity,
    progressBarWidth,
    progressBarOpacity,
  };
};

export default useSplashAnimation;
