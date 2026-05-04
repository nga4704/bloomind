import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import RoundedButton from "../components/RoundedButton";
import { Images } from "../utils/images";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../app/navigation/types";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const MoodTrackingSavedScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <Image source={Images.avatars.done} style={styles.avatar} />

      {/* Bot Name */}
      <Text style={styles.name}>Bloomie</Text>

      {/* Message */}
      <Text style={styles.message}>
        "Cảm ơn bạn đã lắng nghe chính mình."
      </Text>

      {/* Chat Button */}
      <RoundedButton
        title="Trò chuyện với Bloomie"
        color={"#DCFFCB"}
        onPress={() => navigation.navigate("Chatbot")}
      />

      {/* Home Button */}
      <RoundedButton
        title="Home"
        color={"#fff"}
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "MainTabs",
                params: { screen: "Home" },
              },
            ],
          })
        }
      />

      {/* Saved Status */}
      <View style={styles.savedBox}>
        <Text style={styles.savedText}>
          Tâm trạng hôm nay đã được lưu
        </Text>
      </View>
    </View>
  );
};

export default MoodTrackingSavedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    alignItems: "center",
    paddingHorizontal: 25,
    backgroundColor: "#fffbf2",
  },

  avatar: {
    width: 130,
    height: 120,
    marginBottom: 20,
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },

  message: {
    textAlign: "center",
    color: "#555",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 30,
  },

  savedBox: {
    position: "absolute",
    bottom: 25,
    paddingVertical: 12,
    paddingHorizontal: 25,
    backgroundColor: "#F9D9E6",
    borderRadius: 25,
  },

  savedText: {
    color: "#333",
    fontWeight: "600",
  },
});