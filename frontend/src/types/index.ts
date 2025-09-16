// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  level: Level;
  xp: number;
  streak: number;
  avatar?: string;
  lastActiveDate?: string;
  theme?: ThemePreference;
  createdAt: string;
  updatedAt: string;
}

// Lesson types
export interface Lesson {
  id: string;
  title: string;
  description?: string;
  category: Category;
  level: Level;
  order: number;
  xpReward: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  exercises?: Exercise[];
  completedBy?: CompletedLesson[];
}

export interface Exercise {
  id: string;
  lessonId: string;
  type: ExerciseType;
  question: string;
  options?: string[];
  correctAnswer: string;
  audioUrl?: string;
  explanation?: string;
  order: number;
  xpReward: number;
}

export interface CompletedLesson {
  id: string;
  userId: string;
  lessonId: string;
  score: number;
  xpEarned: number;
  timeSpent: number;
  completedAt: string;
  lesson?: Lesson;
}

// Progress types
export interface Progress {
  id: string;
  userId: string;
  lessonId?: string;
  xpGained: number;
  accuracy?: number;
  timeSpent?: number;
  createdAt: string;
}

export interface UserProgress {
  user: User;
  stats: {
    completedLessons: number;
    totalLessons: number;
    completionRate: number;
    totalXPGained: number;
    totalTimeSpent: number;
    averageAccuracy: number;
    activeDays: number;
  };
  categoryProgress: Record<Category, { completed: number; totalXP: number }>;
  achievements: Achievement[];
  recentCompletions: CompletedLesson[];
}

export interface StreakInfo {
  currentStreak: number;
  isActiveToday: boolean;
  nextMilestone: number;
}

export interface DailyStat {
  date: string;
  xpGained: number;
  lessonsCompleted: number;
  timeSpent: number;
  averageAccuracy: number;
}

// Achievement types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  xpReward: number;
}

export interface LeaderboardUser {
  id: string;
  name?: string | null;
  level: Level;
  xp: number;
  streak: number;
  avatar?: string | null;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: string;
  achievement: Achievement;
}

export interface AchievementProgress {
  name: string;
  description: string;
  icon: string;
  current: number;
  target: number;
  completed: boolean;
}

// Enums
export enum Level {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
}

export enum Category {
  GREETINGS = 'GREETINGS',
  FOOD = 'FOOD',
  FAMILY = 'FAMILY',
  TRAVEL = 'TRAVEL',
  NUMBERS = 'NUMBERS',
  COLORS = 'COLORS',
  CLOTHING = 'CLOTHING',
  WEATHER = 'WEATHER',
  TIME = 'TIME',
  HOBBIES = 'HOBBIES',
}

export enum ExerciseType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TEXT_INPUT = 'TEXT_INPUT',
  WORD_ORDER = 'WORD_ORDER',
  AUDIO_CHOICE = 'AUDIO_CHOICE',
  TRANSLATION = 'TRANSLATION',
}

export enum ThemePreference {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

// API Response types
export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface RegisterResponse {
  access_token: string;
  user: User;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}

export interface CompleteLessonForm {
  score: number;
  timeSpent: number;
  answers?: string[];
}

// UI types
export interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ComponentType<any>;
  current?: boolean;
}

export interface CategoryInfo {
  name: Category;
  displayName: string;
  description: string;
  icon: string;
  color: string;
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}
