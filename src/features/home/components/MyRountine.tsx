import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
import { ChevronRight } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";


// Định nghĩa types cho hook responsive
interface ResponsiveHookReturn {
  width: number;
  height: number;
  scale: (size: number) => number;
  verticalScale: (size: number) => number;
  moderateScale: (size: number, factor?: number) => number;
  isSmallDevice: boolean;
  isLargeDevice: boolean;
  isWeb: boolean;
  maxCardWidth: number;
}

// Hook custom để responsive
const useResponsive = (): ResponsiveHookReturn => {
  const { width, height } = useWindowDimensions();
  
  const isWeb = Platform.OS === 'web';
  
  // Base dimensions (iPhone 14 Pro)
  const baseWidth = 390;
  const baseHeight = 844;
  
  // Trên web, giới hạn scaling và sử dụng base width nhỏ hơn
  const effectiveWidth = isWeb ? Math.min(width, 600) : width;
  const webBaseWidth = 600; // Base width cho web
  
  const scale = (size: number): number => {
    if (isWeb) {
      return (effectiveWidth / webBaseWidth) * size;
    }
    return (width / baseWidth) * size;
  };
  
  const verticalScale = (size: number): number => {
    if (isWeb) {
      return size; // Trên web giữ nguyên kích thước theo chiều dọc
    }
    return (height / baseHeight) * size;
  };
  
  const moderateScale = (size: number, factor: number = 0.5): number => {
    if (isWeb) {
      // Trên web, scaling ít hơn
      return size + (scale(size) - size) * (factor * 0.3);
    }
    return size + (scale(size) - size) * factor;
  };
  
  return {
    width,
    height,
    scale,
    verticalScale,
    moderateScale,
    isSmallDevice: width < 375,
    isLargeDevice: width > 414,
    isWeb,
    maxCardWidth: isWeb ? 600 : width - 32, // Giới hạn max width trên web
  };
};

export default function MorningRoutineCard() {
  const { 
    moderateScale, 
    verticalScale,
    isWeb,
    maxCardWidth,
    width, 
  } = useResponsive();
  
  const days = ["S", "M", "T", "W", "T", "F", "S"];

  // Tính toán kích thước cho web và mobile
  const getScaledValue = (mobileSize: number, webSize?: number): number => {
    if (isWeb) {
      return webSize || mobileSize * 0.7; // Giảm kích thước trên web
    }
    return moderateScale(mobileSize);
  };

  const dayCircleSize = getScaledValue(36, 32);
  const dayGap = getScaledValue(6, 4);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={[
        styles.card,
        { 
          padding: getScaledValue(20, 16),
          borderRadius: getScaledValue(24, 16),
          marginTop: isWeb ? 50 : verticalScale(0),
          gap: isWeb ? 16 : verticalScale(20),
          width: isWeb ? '90%' : 'auto',
          maxWidth: isWeb ? undefined : maxCardWidth,
          alignSelf: isWeb ? 'center' : 'stretch',
          marginHorizontal: isWeb ? 'auto' : 16,
        }
      ]}>
        {/* Hàng trên */}
        <View style={[
          styles.rowTop,
          { 
            gap: getScaledValue(16, 12),
          }
        ]}>
          <Image
            source={require("../../../../assets/images/avatar.png")}
            style={[
              styles.icon,
              {
                width: getScaledValue(56, 48),
                height: getScaledValue(56, 48),
              }
            ]}
          />

          <View style={styles.textBlock}>
            <Text style={[
              styles.title,
              { fontSize: getScaledValue(16, 14) }
            ]}>
              Start morning routine
            </Text>
            <Text style={[
              styles.reward,
              { fontSize: getScaledValue(22, 18) }
            ]}>
              Get today's reward!
            </Text>
          </View>
        </View>

        {/* Hàng dưới */}
        <View style={styles.columnLayout}>
          {/* Days */}
          <View style={[
            styles.daysRow,
            { 
              gap: dayGap,
              marginBottom: isWeb ? 12 : verticalScale(12),
              justifyContent: width < 400 ? 'space-between' : 'flex-start',
            }
          ]}>
            {days.map((d, i) => {
              const isM = d === "M";
              const isW = d === "W";

              return (
                <View
                  key={i}
                  style={[
                    styles.dayCircle,
                    {
                      width: dayCircleSize,
                      height: dayCircleSize,
                      borderRadius: dayCircleSize / 2,
                      minWidth: dayCircleSize,
                    },
                    isM && styles.dayActive,
                    isW && styles.dayBorder,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      { fontSize: getScaledValue(13, 12) },
                      isM && styles.dayTextActive,
                      isW && styles.dayTextBorder,
                    ]}
                  >
                    {d}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* My routines + Arrow */}
          <View style={[
            styles.rightGroup,
            { 
              gap: getScaledValue(10, 8),
              alignSelf: 'flex-end',
            }
          ]}>
            <TouchableOpacity style={[
              styles.myRoutineBtn,
              {
                borderRadius: getScaledValue(20, 16),
                paddingHorizontal: getScaledValue(16, 12),
                paddingVertical: getScaledValue(8, 6),
              }
            ]}>
              <Text style={[
                styles.myRoutineText,
                { fontSize: getScaledValue(14, 12) }
              ]}>
                My Routines
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[
              styles.arrowBtn,
              { padding: getScaledValue(4, 2) }
            ]}>
              <ChevronRight 
                size={getScaledValue(28, 24)} 
                color="#F4A005" 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    width: "100%",
  },

  card: {
    backgroundColor: "#FFFFFF",
  },

  rowTop: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },

  icon: {
    resizeMode: "contain",
  },

  textBlock: {
    flex: 1,
    minWidth: 200,
  },

  title: {
    color: "#6B6B6B",
  },

  reward: {
    fontWeight: "700",
  },

  columnLayout: {
    flexDirection: "column",
  },

  daysRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    width: "100%",
  },

  dayCircle: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },

  dayActive: {
    backgroundColor: "#F4A005",
  },

  dayBorder: {
    borderWidth: 2,
    borderColor: "#7A7A7A",
    backgroundColor: "white",
  },

  dayText: {
    fontWeight: "600",
    color: "#7A7A7A",
    textAlign: "center",
  },

  dayTextActive: {
    color: "white",
  },

  dayTextBorder: {
    color: "#7A7A7A",
  },

  rightGroup: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },

  myRoutineBtn: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#D9D9D9",
  },

  myRoutineText: {
    color: "#5F5F5F",
    fontWeight: "600",
  },

  arrowBtn: {
    // Style cơ bản cho arrow button
  },
});