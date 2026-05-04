import { useState, useEffect } from "react";

interface UseSplashScreenReturn {
  isSplashVisible: boolean;
  hideSplash: () => void;
}

export const useSplashScreen = (
  initialVisible: boolean = true,
  autoHideDuration?: number
): UseSplashScreenReturn => {
  const [isSplashVisible, setIsSplashVisible] =
    useState<boolean>(initialVisible);

  useEffect(() => {
    if (autoHideDuration && isSplashVisible) {
      const timer = setTimeout(() => {
        setIsSplashVisible(false);
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [autoHideDuration, isSplashVisible]);

  const hideSplash = (): void => {
    setIsSplashVisible(false);
  };

  return {
    isSplashVisible,
    hideSplash,
  };
};
