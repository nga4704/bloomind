// app/screens/home/components/HomeActions.tsx
import React from "react";
import { View, useWindowDimensions } from "react-native";
import { ActionCircle } from "./ActionCircle";
import { homeStyles } from "../styles/home";
import { HOME_ASSETS } from "../../../types/contants/homeAssets";
import { NoParamRoute } from "../../../app/navigation/types";

interface Props {
  onNavigate: (route: NoParamRoute) => void;
}

export const HomeActions: React.FC<Props> = ({ onNavigate }) => {
  const { width } = useWindowDimensions();
  const itemWidth = Math.floor((width - 40) / 3);

  return (
    <View style={homeStyles.topActions}>
      <ActionCircle
        label="Journal"
        img={HOME_ASSETS.actions.journal}
        width={itemWidth}
        onPress={() => onNavigate("Journal")}
      />

      <ActionCircle
        label="Analysis"
        img={HOME_ASSETS.actions.analysis}
        width={itemWidth}
        onPress={() => onNavigate("Analysis")}
      />

      <ActionCircle
        label="Chatbot"
        img={HOME_ASSETS.actions.chatbot}
        width={itemWidth}
        onPress={() => onNavigate("Chatbot")}
      />
    </View>
  );
};
