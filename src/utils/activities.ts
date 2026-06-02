// src/utils/activities.ts

export interface ActivityItem {
  id: string;
  label: string;
  icon: string; // dùng cho Ionicons / Feather / Lucide
}

// Default activities
export const ACTIVITIES: ActivityItem[] = [
  // Work / Study
  { id: "work", label: "Công việc", icon: "briefcase" },
  { id: "study", label: "Học tập", icon: "book" },
  { id: "coding", label: "Code", icon: "code" },
  { id: "meeting", label: "Họp", icon: "users" },
  { id: "presentation", label: "Thuyết trình", icon: "mic" },
  { id: "exam", label: "Thi cử", icon: "edit" },
  { id: "deadline", label: "Deadline", icon: "alert-circle" },

  // Digital / Screen
  { id: "social", label: "Mạng xã hội", icon: "globe" },
  { id: "scrolling", label: "Lướt mạng nhiều", icon: "smartphone" },
  { id: "game", label: "Game", icon: "monitor" },
  { id: "movie", label: "Xem phim", icon: "film" },

  // Body / Health
  { id: "exercise", label: "Tập thể dục", icon: "activity" },
  { id: "walk", label: "Đi bộ", icon: "map-pin" },
  { id: "stretch", label: "Giãn cơ", icon: "move" },
  { id: "sleep", label: "Ngủ", icon: "moon" },
  { id: "nap", label: "Ngủ trưa", icon: "power" },
  { id: "rest", label: "Nghỉ ngơi", icon: "pause-circle" },

  // Mind / Relax
  { id: "music", label: "Nghe nhạc", icon: "music" },
  { id: "meditation", label: "Thiền", icon: "wind" },

  // Social / Life
  { id: "party", label: "Tiệc", icon: "sun" },
  { id: "travel", label: "Du lịch", icon: "map" },
  { id: "cooking", label: "Nấu ăn", icon: "coffee" },
];
