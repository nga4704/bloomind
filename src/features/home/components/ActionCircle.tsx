import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { homeStyles } from "../styles/home";

type Props = {
  label: string;
  img: any;
  onPress?: () => void;
  width?: number;
};

export const ActionCircle: React.FC<Props> = ({ label, img, onPress, width }) => (
  <View style={[homeStyles.actionItem, width ? { width } : undefined]}>
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={homeStyles.actionTouchable}
    >
      <View style={homeStyles.actionCircle}>
        <Image source={img} style={homeStyles.actionImage} />
      </View>
      <Text style={homeStyles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  </View>
);
