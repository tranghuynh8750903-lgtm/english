import React from 'react';
import { Flame, CheckCircle, Sparkles, X } from 'lucide-react';

interface StreakCelebrationToastProps {
  streak: number;
  message: string;
  bonusXP: number;
  onClose: () => void;
  onOpenStreakModal: () => void;
}

export const StreakCelebrationToast: React.FC<StreakCelebrationToastProps> = ({
  streak,
  message,
  bonusXP,
  onClose,
  onOpenStreakModal,
}) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full bg-[#18181B] text-white p-4 rounded-2xl shadow-2xl border border-[#3F3F46] animate-in slide-in-from-bottom duration-300">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[#D97706]/20 border border-[#D97706] text-[#F59E0B] flex items-center justify-center shrink-0">
          <Flame className="w-6 h-6 animate-pulse" />
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-[#F59E0B]">
              🔥 Chuỗi: {streak} Ngày!
            </span>
            {bonusXP > 0 && (
              <span className="font-mono-code text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#059669] text-white">
                +{bonusXP} XP
              </span>
            )}
          </div>
          <p className="text-xs text-[#D4D4D8] leading-relaxed">{message}</p>
          <div className="pt-1">
            <button
              type="button"
              onClick={onOpenStreakModal}
              className="text-xs font-bold text-[#38BDF8] hover:underline cursor-pointer"
            >
              Xem chi tiết tiến độ tuần →
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-[#A1A1AA] hover:text-white p-1 rounded cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
