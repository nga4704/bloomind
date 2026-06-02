// src/utils/moodData.ts
import { Images } from "./images";
import { ImageSourcePropType } from "react-native";

export interface MoodItem {
  id: string;
  label: string;

  icon: ImageSourcePropType; // require() or uri
}

export const moodData =[
  { id: "happy", label: "Vui vẻ", icon: Images.mood.happy },
  { id: "peaceful", label: "Bình yên", icon: Images.mood.peaceful },
  { id: "neutral", label: "Bình thường", icon: Images.mood.neutral },
  { id: "sad", label: "Buồn",  icon: Images.mood.sad },
  { id: "anxious", label: "Lo lắng",  icon: Images.mood.anxious },
];
