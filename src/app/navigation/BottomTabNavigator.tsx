import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

import { HomeScreen } from "../../features/home";
import { ProfileScreen } from "../../features/profile";
import { AnalysisScreen } from "../../features/analysis";
import { JournalHomeScreen } from "../../features/journal";

import { useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, focused }: { name: any; focused: boolean }) => {
  return (
    <View style={styles.iconWrap}>
      <Ionicons
        name={name}
        size={22}
        color={focused ? "#6dbe45" : "#8E8E93"}
      />
    </View>
  );
};

export const BottomTabNavigator = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,

          tabBarShowLabel: false,
          tabBarLabelStyle: styles.label,

          tabBarStyle: styles.tabBar,

          tabBarItemStyle: styles.tabItem,

          tabBarIcon: ({ focused }) => {
            let iconName: any;

            if (route.name === "Home") iconName = "home";
            if (route.name === "Analysis") iconName = "pie-chart";
            if (route.name === "Journal") iconName = "book";
            if (route.name === "Profile") iconName = "person";

            return <TabIcon name={iconName} focused={focused} />;
          },

          tabBarActiveTintColor: "#6dbe45",
          tabBarInactiveTintColor: "#8E8E93",
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Analysis" component={AnalysisScreen} />
        <Tab.Screen
          name="Empty"
          component={View}
          options={{
            tabBarButton: () => null,
          }}
        />
        <Tab.Screen name="Journal" component={JournalHomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>

      {/* 🔥 FAB */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.fab}
        onPress={() => navigation.navigate("Chatbot")}
      >
        <Feather name="message-circle" size={26} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 25,
    left: 20,
    right: 20,
    height: 60,
    borderRadius: 35,
    backgroundColor: "#ffffff",

    // iOS shadow
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 30,
    shadowOffset: { width: 20, height: 0 },

    // Android shadow
    elevation: 10,

    paddingBottom: 8,
    paddingTop: 8,

    borderTopWidth: 0, 
  },

  tabItem: {
    justifyContent: "center",
    alignItems: "center",
  },

  iconWrap: {
    justifyContent: "center",
    alignItems: "center",
    height: 40,
  },

  label: {
    fontSize: 11,
    marginTop: 2,
    fontWeight: "500",
  },

  fab: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",

    width: 64,
    height: 64,
    borderRadius: 32,

    backgroundColor: "#6dbe45",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#6dbe45",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },

    elevation: 12,
  },
});