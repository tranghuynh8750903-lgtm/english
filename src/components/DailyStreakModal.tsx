import React from 'react';
import {
  Flame,
  CheckCircle2,
  Calendar,
  Award,
  Trophy,
  ArrowRight,
  X,
  Zap,
  BookOpen,
  Layers,
  Gamepad2,
  PenTool,
} from 'lucide-react';
import { UserProfile, NavSection } from '../types';
import { getCurrentWeekDays, getTodayDateString } from '../utils/streakUtils';

interface DailyStreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onNavigate: (nav: NavSection) => void;
}

export const DailyStreakModal: React.FC<DailyStreakModalProps> = ({
  isOpen,
  onClose,
  profile,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const today = getTodayDateString();
  const isStudiedToday = profile.lastStudiedDate === today;
  const streakDays = profile.streakDays || 0;
  const longestStreak = Math.max(profile.longestStreak || 0, streakDays);
  const dailyLessons = profile.dailyLessonsCompletedToday || 0;
  const weekDays = getCurrentWeekDays(profile.studyDatesHistory || []);

  const milestones = [
    {
      days: 3,
      title: 'Tia Lửa Đầu Tiên',
      desc: 'Học liên tiếp 3 ngày',
      icon: '🔥',
      unlocked: streakDays >= 3,
    },
    {
      days: 7,
      title: 'Chiến Binh 1 Tuần',
      desc: 'Duy trì trọn vẹn 7 ngày',
      icon: '⚡',
      unlocked: streakDays >= 7,
    },
    {
      days: 14,
      title: 'Thói Quen Vàng',
      desc: 'Bền bỉ trong 2 tuần liên tiếp',
      icon: '🏆',
      unlocked: streakDays >= 14,
    },
    {
      days: 30,
      title: 'Kỷ Luật Thép',
      desc: 'Chinh phục 1 tháng học tập',
      icon: '👑',
      unlocked: streakDays >= 30,
    },
  ];

  const handleQuickAction = (nav: NavSection) => {
    onNavigate(nav);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white border border-[#E6E1D6] rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[#F3EFEA] text-[#6E6A63] cursor-pointer transition"
          title="Đóng"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Flame Hero */}
        <div className="text-center pt-2 space-y-2">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#FEF3C7] via-[#FDE68A] to-[#F59E0B]/30 border-2 border-[#F59E0B] shadow-inner mb-1">
            <Flame className="w-10 h-10 text-[#D97706] animate-pulse" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="font-mono-code text-4xl font-extrabold text-[#18181B]">
              {streakDays}
            </span>
            <span className="text-xl font-bold text-[#D97706]">Ngày Liên Tiếp</span>
          </div>
          <p className="text-xs text-[#57534E]">
            Kỷ lục dài nhất của bạn:{' '}
            <strong className="text-[#18181B]">{longestStreak} ngày</strong>
          </p>
        </div>

        {/* Today's Goal Card */}
        <div
          className={`p-4 rounded-xl border transition ${
            isStudiedToday
              ? 'bg-[#ECFDF5] border-[#A7F3D0]'
              : 'bg-[#FFFBEB] border-[#FDE68A]'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {isStudiedToday ? (
                <CheckCircle2 className="w-5 h-5 text-[#059669]" />
              ) : (
                <Zap className="w-5 h-5 text-[#D97706]" />
              )}
              <span className="text-xs font-bold uppercase tracking-wider text-[#18181B]">
                {isStudiedToday
                  ? 'Mục tiêu hôm nay: ĐÃ HOÀN THÀNH!'
                  : 'Mục tiêu hôm nay: CHƯA HOÀN THÀNH'}
              </span>
            </div>
            <span
              className={`font-mono-code text-xs px-2 py-0.5 rounded-full font-bold ${
                isStudiedToday
                  ? 'bg-[#059669] text-white'
                  : 'bg-[#F59E0B] text-white'
              }`}
            >
              {isStudiedToday ? `${dailyLessons}/1 bài ✓` : '0/1 bài'}
            </span>
          </div>

          <p className="text-xs text-[#57534E] leading-relaxed">
            {isStudiedToday
              ? '🎉 Tuyệt vời! Bạn đã hoàn thành bài học hôm nay để giữ vững chuỗi. Ngày mai hãy học 1 bài để tăng chuỗi nhé!'
              : '🔥 Quy tắc chuỗi: Chỉ cần hoàn thành ít nhất 1 bài học mỗi ngày (Flashcard, Trắc nghiệm, Game từ vựng hoặc Viết bài) để duy trì và tăng chuỗi liên tiếp.'}
          </p>
        </div>

        {/* 7-Day Weekly Calendar Tracker */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#57534E]">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#5B3FD9]" />
              <span>Tiến độ tuần này</span>
            </span>
            <span className="font-mono-code text-[11px] text-[#6E6A63] font-normal">
              Thứ 2 → Chủ Nhật
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {weekDays.map((day) => {
              return (
                <div
                  key={day.dateString}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition ${
                    day.isToday
                      ? 'border-[#D97706] bg-[#FEF3C7]/40 ring-2 ring-[#F59E0B]/30'
                      : day.studied
                      ? 'border-[#A7F3D0] bg-[#ECFDF5]'
                      : 'border-[#E6E1D6] bg-[#FAF8F5]'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold text-[#6E6A63]">
                    {day.dayName}
                  </span>
                  <div className="my-1">
                    {day.studied ? (
                      <div className="w-6 h-6 rounded-full bg-[#059669] text-white flex items-center justify-center text-xs font-bold">
                        ✓
                      </div>
                    ) : day.isToday ? (
                      <div className="w-6 h-6 rounded-full bg-[#F59E0B] text-white flex items-center justify-center text-xs font-bold animate-pulse">
                        🔥
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-transparent text-[#A8A29E] flex items-center justify-center text-xs font-mono-code">
                        {day.dayOfMonth}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-[#78716C] font-mono-code">
                    {day.isToday ? 'Hôm nay' : `${day.dayOfMonth}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestones & Badges */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#57534E]">
            <Trophy className="w-4 h-4 text-[#D97706]" />
            <span>Cột mốc chuỗi học tập</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {milestones.map((m) => (
              <div
                key={m.days}
                className={`p-3 rounded-xl border transition flex items-start gap-2.5 ${
                  m.unlocked
                    ? 'bg-[#FAF8F5] border-[#F59E0B]/60 shadow-2xs'
                    : 'bg-[#FAF8F5]/50 border-[#E6E1D6] opacity-60'
                }`}
              >
                <span className="text-2xl select-none">{m.icon}</span>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#18181B] truncate">
                    {m.title}
                  </div>
                  <div className="text-[11px] text-[#6E6A63]">
                    {m.days} ngày {m.unlocked ? '✓' : `(còn ${Math.max(0, m.days - streakDays)})`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Action Buttons to complete today's lesson */}
        <div className="space-y-2 pt-2 border-t border-[#E6E1D6]">
          <div className="text-xs font-bold text-[#18181B]">
            Học 1 bài ngay để tăng chuỗi hôm nay:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickAction('flashcards')}
              className="p-2.5 rounded-xl border border-[#D6D1C7] hover:bg-[#F3EFEA] text-left transition cursor-pointer flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-[#4EC9B0] shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#18181B] truncate">
                  Flashcard Từ vựng
                </div>
                <div className="text-[10px] text-[#6E6A63]">3 phút • Lật thẻ</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickAction('practice')}
              className="p-2.5 rounded-xl border border-[#D6D1C7] hover:bg-[#F3EFEA] text-left transition cursor-pointer flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4 text-[#CE9178] shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#18181B] truncate">
                  Luyện 1 Đề Thi
                </div>
                <div className="text-[10px] text-[#6E6A63]">4 câu trắc nghiệm</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickAction('game')}
              className="p-2.5 rounded-xl border border-[#D6D1C7] hover:bg-[#F3EFEA] text-left transition cursor-pointer flex items-center gap-2"
            >
              <Gamepad2 className="w-4 h-4 text-[#DCDCAA] shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#18181B] truncate">
                  Game Từ vựng
                </div>
                <div className="text-[10px] text-[#6E6A63]">45s Speed Sprint</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickAction('write')}
              className="p-2.5 rounded-xl border border-[#D6D1C7] hover:bg-[#F3EFEA] text-left transition cursor-pointer flex items-center gap-2"
            >
              <PenTool className="w-4 h-4 text-[#569CD6] shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#18181B] truncate">
                  Viết Đoạn Văn
                </div>
                <div className="text-[10px] text-[#6E6A63]">Kiểm tra ngữ pháp</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
