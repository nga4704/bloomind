// utils/activities.ts
export interface ActivityItem {
  id: string;
  label: string;
  icon: string; 
  color: string;
}

export const ACTIVITIES: ActivityItem[] = [
  { id: "work", label: "Công việc", icon: "briefcase", color: "#F9C8C0" },
  { id: "study", label: "Học tập", icon: "book", color: "#FFF5A5" },

  { id: "social", label: "Mạng xã hội", icon: "globe", color: "#c2ffd6ff" },
  { id: "exercise", label: "Tập thể dục", icon: "activity", color: "#FFE8C2" },

  { id: "sleep", label: "Ngủ", icon: "moon", color: "#d7ecffff" },
  { id: "deadline", label: "Deadline", icon: "alert-circle", color: "#C1C9D6" },

  { id: "game", label: "Game", icon: "monitor", color: "#E5E9FF" },
  { id: "party", label: "Tiệc", icon: "sun", color: "#FFCBD6" },

  { id: "cooking", label: "Nấu ăn", icon: "framer", color: "#C8EAF0" },
  { id: "movie", label: "Xem phim", icon: "film", color: "#FFF2A8" },

  { id: "music", label: "Nghe nhạc", icon: "headphones", color: "#F7D4E7" },
  { id: "meditation", label: "Thiền", icon: "wind", color: "#D9F5DA" },

  { id: "travel", label: "Du lịch", icon: "map", color: "#bdf4f2ff" },
];

