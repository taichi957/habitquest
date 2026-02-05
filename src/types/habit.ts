export type Habit = {
  id: string;
  title: string;
  color: string;
  completedToday: boolean;
  streak: number;
  createdAt: string;
  /** NEW */
  badge?: string;      // id badge
  badgeName?: string;  // tên hiển thị
};
