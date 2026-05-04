import { Keyboard, Platform } from "react-native";

export function goBackSafely(navigation: any) {
  if (Platform.OS === "web") {
    (document.activeElement as HTMLElement | null)?.blur();
  }
  Keyboard.dismiss();
  navigation.goBack();
}
