import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { Keyboard, Platform, TextInput } from "react-native";

// hooks/useBlurOnLeave.ts
export function useBlurOnLeave() {
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (Platform.OS === "web") {
          (document.activeElement as HTMLElement | null)?.blur();
        } else {
          // Chỉ chạy trên mobile
          const focusedInput = TextInput.State.currentlyFocusedInput();
          if (focusedInput) {
            TextInput.State.blurTextInput(focusedInput);
          }
        }
        Keyboard.dismiss();
      };
    }, [])
  );
}
