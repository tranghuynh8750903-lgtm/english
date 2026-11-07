import { UserProfile } from '../types';

/**
 * Returns today's date string in YYYY-MM-DD format based on local time.
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns yesterday's date string in YYYY-MM-DD format based on local time.
 */
export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface StreakUpdateResult {
  updatedProfile: UserProfile;
  isNewStreakDay: boolean;
  streakIncremented: boolean;
  message: string;
  bonusXP: number;
}

/**
 * Calculates updated streak state when the user completes ANY 1 study activity today.
 * Rule: 1 lesson/day maintains or increases streak by 1.
 */
export function calculateStreakOnLessonCompleted(profile: UserProfile): StreakUpdateResult {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  const lastStudied = profile.lastStudiedDate || '';
  const history = Array.isArray(profile.studyDatesHistory) ? [...profile.studyDatesHistory] : [];
  if (!history.includes(today)) {
    history.push(today);
  }

  // Case 1: Already studied today!
  if (lastStudied === today) {
    const dailyLessons = (profile.dailyLessonsCompletedToday || 0) + 1;
    const updated: UserProfile = {
      ...profile,
      dailyLessonsCompletedToday: dailyLessons,
      studyDatesHistory: history,
      xp: (profile.xp || 0) + 10,
    };
    return {
      updatedProfile: updated,
      isNewStreakDay: false,
      streakIncremented: false,
      message: `Hôm nay bạn đã hoàn thành ${dailyLessons} bài học! Chuỗi hiện tại: ${profile.streakDays} ngày 🔥`,
      bonusXP: 10,
    };
  }

  // Case 2: Consecutive day study (last studied was yesterday) -> Streak INCREMENT!
  if (lastStudied === yesterday) {
    const newStreak = (profile.streakDays || 0) + 1;
    const longest = Math.max(profile.longestStreak || 0, newStreak);
    const bonusXP = 25; // Bonus for extending streak
    const updated: UserProfile = {
      ...profile,
      streakDays: newStreak,
      longestStreak: longest,
      lastStudiedDate: today,
      dailyLessonsCompletedToday: 1,
      studyDatesHistory: history,
      xp: (profile.xp || 0) + bonusXP,
    };
    return {
      updatedProfile: updated,
      isNewStreakDay: true,
      streakIncremented: true,
      message: `🎉 Tuyệt vời! Bạn đã tăng chuỗi học tập lên ${newStreak} ngày liên tiếp! (+${bonusXP} XP)`,
      bonusXP,
    };
  }

  // Case 3: Missed a day or first time -> Start / Reset streak to 1
  const newStreak = 1;
  const longest = Math.max(profile.longestStreak || 0, newStreak);
  const bonusXP = 15;
  const updated: UserProfile = {
    ...profile,
    streakDays: newStreak,
    longestStreak: longest,
    lastStudiedDate: today,
    dailyLessonsCompletedToday: 1,
    studyDatesHistory: history,
    xp: (profile.xp || 0) + bonusXP,
  };
  return {
    updatedProfile: updated,
    isNewStreakDay: true,
    streakIncremented: false,
    message: `🔥 Bạn đã bắt đầu chuỗi học tập mới: 1 ngày liên tiếp! Hãy học mỗi ngày để duy trì nhé.`,
    bonusXP,
  };
}

export interface DayStatus {
  dayName: string; // T2, T3, T4, T5, T6, T7, CN
  dateString: string;
  dayOfMonth: number;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  studied: boolean;
}

/**
 * Returns the 7 days of the current week (Monday to Sunday) with study status.
 */
export function getCurrentWeekDays(studyDatesHistory: string[] = []): DayStatus[] {
  const today = getTodayDateString();
  const now = new Date();
  
  // Calculate Monday of current week
  // In JS getDay(): 0 is Sunday, 1 is Monday ... 6 is Saturday
  const currentDayOfWeek = now.getDay();
  const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  
  const monday = new Date(now);
  monday.setDate(now.getDate() + distanceToMonday);
  monday.setHours(0, 0, 0, 0);

  const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const weekDays: DayStatus[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const isToday = dateStr === today;
    const isPast = dateStr < today;
    const isFuture = dateStr > today;
    const studied = studyDatesHistory.includes(dateStr);

    weekDays.push({
      dayName: dayNames[i],
      dateString: dateStr,
      dayOfMonth: d.getDate(),
      isToday,
      isPast,
      isFuture,
      studied,
    });
  }

  return weekDays;
}
