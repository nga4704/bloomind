import { StyleSheet, Platform } from "react-native";

export const BG = "#FFFBF2";
export const ACCENT = "#6AA84F";

export const homeStyles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 110, // chừa chỗ cho bottom nav + FAB
    paddingTop: Platform.OS === "web" ? 24 : 0,
  },

  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: Platform.OS === "android" ? 28 : 12,
    alignItems: "center",
  },

  /* ---------- Header ---------- */
  headerRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  leftHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 24,
    backgroundColor: "#fff",
  },
  greetingWrap: {
    marginLeft: 12,
  },
  dateText: {
    color: "#3a8139",
    fontSize: 12,
    marginTop: 6,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    
  },
  nameText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2E5F2E",
  },
  fireBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(140,200,120,0.12)",
  },

  /* ---------- Top Actions ---------- */
  topActions: {
    marginTop: 14,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 8,
    alignItems: "center",
  },
  actionItem: {
    alignItems: "center",
  },
  actionCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  actionImage: {
    width: 56,
    height: 56,
    resizeMode: "contain",
  },
  actionLabel: {
    marginTop: 8,
    fontSize: 13,
    color: "#5D5D5D",
    textAlign: "center",
  },
  actionTouchable: {
    alignItems: "center",
  },

  /* ---------- Mascot ---------- */
  // mascotContainer: {
  //   flex: 1,
  //   width: "100%",
  //   alignItems: "center",
  //   justifyContent: "flex-end",
  // },

  mascotContainer: {
    width: "100%",
    marginTop: 24, // né 3 icon
    paddingTop: 40, // đẩy mascot xuống
    alignItems: "center",
  },

  /* ---------- Bottom Navigation ---------- */
  bottomNavWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    // bottom: 8,
    alignItems: "center",
  },
  bottomNav: {
    width: "92%",
    maxWidth: 980,
    height: 64,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 5,
    paddingHorizontal: 16,
    paddingVertical: 14,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 6 },
    }),
  },


  navItem: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },

  fabContainer: {
    position: "absolute",
    top: -28,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ACCENT,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 6 },
    }),
  },
});
