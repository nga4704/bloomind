import React from "react";
import { useAuth } from "../../services/firebase/AuthContext";

import { AuthNavigator } from "./AuthNavigator";
import { MainNavigator } from "./MainNavigator";
import SplashScreen from "../../features/home/screens/SplashScreen";

export const AppNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return user ? <MainNavigator /> : <AuthNavigator />;
};