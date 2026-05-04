import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { homeStyles } from "../styles/home";
import { HOME_ASSETS } from "../../../types/contants/homeAssets";
import { Ionicons } from "@expo/vector-icons";

export const HomeHeader = ({ userInfo }: { userInfo: any }) => {
  const navigation = useNavigation<any>();

  const todayText = new Date().toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const goToProfile = () => {
    navigation.navigate("Profile");
  };

  return (
    <View style={homeStyles.headerRow}>
      <View style={homeStyles.leftHeader}>

        <Image
          source={require("../../../assets/images/chatbotAvatar.png")}
          style={homeStyles.avatar}
        />


        <View style={homeStyles.greetingWrap}>
          <Text style={homeStyles.nameText}>
            Xin chào {userInfo?.name ?? "bạn"}
          </Text>
          
          <Text style={homeStyles.dateText}>{todayText}</Text>

        </View>
      </View>

      {/* <TouchableOpacity style={homeStyles.fireBtn} onPress={goToProfile}>
        <Feather name="zap" size={18} color="#6AA84F" />
      </TouchableOpacity> */}
    </View>
  );
};