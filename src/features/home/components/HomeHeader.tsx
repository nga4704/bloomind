import React, { useEffect, useState } from "react";
import { View, Text, Image } from "react-native";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "../../../services/firebase/firebaseConfig";

import {
  getLevel,
  getLevelProgress,
  getProgressPercent,
  getNextLevelExp,
} from "../utils/levelSystem";

import { homeStyles } from "../styles/home";

export const HomeHeader = ({ userInfo }: { userInfo: any }) => {
  const [exp, setExp] = useState(0);

  useEffect(() => {
  console.log("userInfo", userInfo);

  if (!userInfo?.uid) {
    console.log("No uid");
    return;
  }

  const ref = doc(firestore, "users", userInfo.uid);

  console.log("Listening:", userInfo.uid);

  const unsub = onSnapshot(
    ref,
    (snap) => {
      console.log("Document exists:", snap.exists());

      if (!snap.exists()) {
        console.log("User document not found");
        return;
      }

      const data = snap.data();

      console.log("Firestore data:", data);
      console.log("Firestore exp:", data?.exp);

      setExp(Number(data?.exp ?? 0));
    },
    (error) => {
      console.log("Firestore error:", error);
    }
  );

  return unsub;
}, [userInfo]);

  const level = getLevel(exp);
  const progress = getLevelProgress(exp);
  const percent = getProgressPercent(exp);
  const remaining = getNextLevelExp(exp);

  return (
    <View
      style={[
        homeStyles.headerRow,
        {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
      ]}
    >
      {/* LEFT */}
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <Image
          source={require("../../../assets/images/chatbotAvatar.png")}
          style={homeStyles.avatar}
        />

        <View style={{ marginLeft: 10 }}>
          <Text style={homeStyles.nameText}>
            Xin chào {userInfo?.name ?? "bạn"}
          </Text>

          <Text style={homeStyles.dateText}>
            Level {level}
          </Text>
        </View>
      </View>

      {/* RIGHT */}
      <View style={{ alignItems: "flex-end" }}>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "700",
            color: "#FFB020",
          }}
        >
          ⚡ {exp} EXP
        </Text>

        {/* PROGRESS BAR */}
        <View
          style={{
            height: 6,
            width: 100,
            backgroundColor: "#eee",
            borderRadius: 20,
            marginTop: 4,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${percent * 100}%`,
              backgroundColor: "#FFB020",
            }}
          />
        </View>

        <Text
          style={{
            fontSize: 10,
            color: "#888",
            marginTop: 2,
          }}
        >
          {progress}/100
        </Text>
      </View>
    </View>
  );
};