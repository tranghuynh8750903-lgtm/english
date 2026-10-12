import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Target,
  FileText,
  TrendingUp,
  CheckCheck,
  Sparkles,
  Brain,
  LogOut,
  Edit3,
  Check,
  Bell,
  AlertCircle,
  Calendar,
  Clock,
  BookOpen,
} from 'lucide-react';
import {
  LearningMode,
  NotificationItem,
  Post,
  PracticeAttempt,
  UserProfile,
} from '../types';

interface ProfileViewProps {
  profile: UserProfile | null;
  userPosts: Post[];
  attempts: PracticeAttempt[];
  isAuthenticated: boolean;
  authError: string | null;
  onSignInGoogle: () => void;
  onSignInFacebook: () => void;
  onSignOut: () => void;
  onUpdateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  onGoToMistakeDrill: () => void;
}

const COMMON_TARGETS = {
  TOEIC: ['TOEIC 750+', 'TOEIC 800+', 'TOEIC 850+', 'TOEIC 900+ (Mục tiêu Xuất sắc)'],
  IELTS: ['IELTS 6.5', 'IELTS 7.0', 'IELTS 7.5', 'IELTS 8.0 (Mục tiêu Chuyên gia)', 'IELTS 8.5+'],
};

const ALL_SKILLS = [
  'Vocabulary (Từ vựng)',
  'Grammar (Ngữ pháp)',
  'Reading (Đọc hiểu)',
  'Listening (Nghe hiểu)',
  'Writing (Viết luận & Email)',
  'Speaking (Phát âm & Nói)',
];

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  userPosts,
  attempts,
  isAuthenticated,
  authError,
  onSignInGoogle,
  onSignInFacebook,
  onSignOut,
  onUpdateProfile,
  onGoToMistakeDrill,
}) => {
  const [subTab, setSubTab] = useState<'posts' | 'scores' | 'progress' | 'target'>('progress');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile?.displayName || '');
  const [bioInput, setBioInput] = useState(profile?.bio || '');

  // Custom Target Form State
  const [targetMode, setTargetMode] = useState<LearningMode>(
    profile?.learningMode || 'IELTS'
  );
  const [customTargetScore, setCustomTargetScore] = useState(
    profile?.targetScore || (profile?.learningMode === 'TOEIC' ? 'TOEIC 800+' : 'IELTS 8.0')
  );
  const [targetDeadline, setTargetDeadline] = useState(profile?.targetDeadline || '');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState<number>(
    profile?.dailyStudyGoalMinutes || 30
  );
  const [focusSkills, setFocusSkills] = useState<string[]>(
    profile?.targetFocusSkills || ['Grammar (Ngữ pháp)', 'Vocabulary (Từ vựng)']
  );
  const [isSavingGoal, setIsSavingGoal] = useState(false);
  const [goalSavedSuccess, setGoalSavedSuccess] = useState(false);

  // Guest fallback profile if not authenticated
  const currentProfile: UserProfile = profile || {
    uid: 'guest-local',
    displayName: 'Học viên (Khách)',
    photoURL: '',
    bio: 'Đang trải nghiệm chế độ Khách không cần đăng nhập.',
    learningMode: targetMode,
    targetScore: customTargetScore,
    streakDays: 1,
    xp: 0,
    frequentMistakes: [],
    createdAt: new Date().toISOString(),
  };

  useEffect(() => {
    if (profile) {
      setNameInput(profile.displayName || '');
      setBioInput(profile.bio || '');
      setTargetMode(profile.learningMode || 'IELTS');
      setCustomTargetScore(
        profile.targetScore ||
          (profile.learningMode === 'TOEIC' ? 'TOEIC 800+' : 'IELTS 8.0')
      );
      setTargetDeadline(profile.targetDeadline || '');
      setDailyGoalMinutes(profile.dailyStudyGoalMinutes || 30);
      if (profile.targetFocusSkills) {
        setFocusSkills(profile.targetFocusSkills);
      }
    }
  }, [profile]);

  const isGuestMode = !isAuthenticated || (profile && profile.uid.startsWith('guest-'));

  const handleSaveProfile = async () => {
    await onUpdateProfile({
      displayName: nameInput.trim() || currentProfile.displayName,
      bio: bioInput.trim(),
    });
    setIsEditingName(false);
  };

  const handleSaveCustomGoal = async () => {
    setIsSavingGoal(true);
    setGoalSavedSuccess(false);
    try {
      await onUpdateProfile({
        learningMode: targetMode,
        targetScore: customTargetScore.trim() || (targetMode === 'TOEIC' ? 'TOEIC 800+' : 'IELTS 8.0'),
        targetDeadline,
        dailyStudyGoalMinutes: dailyGoalMinutes,
        targetFocusSkills: focusSkills,
      });
      setGoalSavedSuccess(true);
      setTimeout(() => setGoalSavedSuccess(false), 3000);
    } finally {
      setIsSavingGoal(false);
    }
  };

  const toggleFocusSkill = (skill: string) => {
    setFocusSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const totalCorrect = attempts.reduce((acc, a) => acc + a.score, 0);
  const totalQuestions = attempts.reduce((acc, a) => acc + a.total, 0);
  const accuracyPct =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  return (
    <div className="space-y-6">
      {isGuestMode && (
        <div className="p-4 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs md:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-start sm:items-center gap-2.5">
            <span className="text-lg">💡</span>
            <div>
              <span className="font-bold">Bạn đang dùng ở chế độ Khách (Không cần đăng nhập):</span> Mọi dữ liệu học tập, điểm số, bài viết và game từ vựng đều hoạt động trọn vẹn. Bạn có thể liên kết tài khoản Google hoặc Facebook bất cứ lúc nào để lưu trữ đám mây lâu dài.
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onSignInGoogle}
              className="px-3 py-1.5 rounded-lg bg-white border border-[#D6D1C7] text-xs font-bold text-[#18181B] hover:bg-[#FAF8F5] transition cursor-pointer"
            >
              Liên kết Google
            </button>
            <button
              type="button"
              onClick={onSignInFacebook}
              className="px-3 py-1.5 rounded-lg bg-[#1877F2] text-xs font-bold text-white hover:bg-[#166FE5] transition cursor-pointer"
            >
              Liên kết Facebook
            </button>
          </div>
        </div>
      )}

      {/* Profile Hero Banner */}
      <div className="bg-white border border-[#E6E1D6] rounded-xl p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {currentProfile.photoURL ? (
            <img
              src={currentProfile.photoURL}
              alt={currentProfile.displayName}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#18181B]"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#18181B] text-white flex items-center justify-center font-bold text-xl">
              {currentProfile.displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="space-y-1">
            {isEditingName ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="px-3 py-1.5 rounded border border-[#18181B] text-sm font-bold bg-[#FAF8F5]"
                  placeholder="Tên hiển thị..."
                />
                <input
                  type="text"
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  className="block w-full px-3 py-1.5 rounded border border-[#E6E1D6] text-xs bg-[#FAF8F5]"
                  placeholder="Giới thiệu mục tiêu học tập..."
                />
                <button
                  type="button"
                  onClick={handleSaveProfile}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded bg-[#059669] text-white text-xs font-bold cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" /> Lưu hồ sơ
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-bold text-[#18181B]">
                    {currentProfile.displayName}
                  </h1>
                  <button
                    type="button"
                    onClick={() => {
                      setNameInput(currentProfile.displayName);
                      setBioInput(currentProfile.bio);
                      setIsEditingName(true);
                    }}
                    className="p-1 rounded hover:bg-[#F3EFEA] text-[#6E6A63] cursor-pointer"
                    title="Chỉnh sửa tên và bio"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
                {currentProfile.bio && <p className="text-sm text-[#57534E]">{currentProfile.bio}</p>}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setSubTab('target')}
                    className={`font-mono-code text-xs font-bold px-2.5 py-0.5 rounded cursor-pointer transition flex items-center gap-1 hover:opacity-80 ${
                      currentProfile.learningMode === 'IELTS'
                        ? 'bg-[#F6F4FF] text-[#5B3FD9]'
                        : 'bg-[#F0F5FF] text-[#1E40AF]'
                    }`}
                    title="Nhấn để tùy chỉnh mục tiêu"
                  >
                    <span>🎯 Mục tiêu: {currentProfile.targetScore}</span>
                    <Edit3 className="w-3 h-3" />
                  </button>
                  <span className="font-mono-code text-xs font-bold px-2.5 py-0.5 rounded bg-[#ECFDF5] text-[#059669]">
                    ⚡ {currentProfile.xp} XP
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          {isGuestMode ? (
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <button
                type="button"
                onClick={onSignInGoogle}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#D6D1C7] bg-white hover:bg-[#FAF8F5] text-xs font-bold text-[#18181B] transition cursor-pointer"
              >
                <span>Liên kết Google</span>
              </button>
              <button
                type="button"
                onClick={onSignInFacebook}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1877F2] hover:bg-[#166FE5] text-xs font-bold text-white transition cursor-pointer"
              >
                <span>Liên kết Facebook</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onSignOut}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E6E1D6] bg-[#FAF8F5] hover:bg-[#F3EFEA] text-xs font-bold text-[#18181B] transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Đăng xuất
            </button>
          )}
        </div>
      </div>

      {/* 4 Sub-tabs: Tiến độ | Bài đã đăng | Điểm luyện tập | Tự chỉnh sửa Mục tiêu */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#E6E1D6] pb-3">
        <button
          type="button"
          onClick={() => setSubTab('progress')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
            subTab === 'progress'
              ? 'bg-[#18181B] text-white'
              : 'bg-white border border-[#E6E1D6] text-[#57534E] hover:text-[#18181B]'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          Tiến độ học tập
        </button>
        <button
          type="button"
          onClick={() => setSubTab('posts')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
            subTab === 'posts'
              ? 'bg-[#18181B] text-white'
              : 'bg-white border border-[#E6E1D6] text-[#57534E] hover:text-[#18181B]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Bài đã đăng ({userPosts.length})
        </button>
        <button
          type="button"
          onClick={() => setSubTab('scores')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
            subTab === 'scores'
              ? 'bg-[#18181B] text-white'
              : 'bg-white border border-[#E6E1D6] text-[#57534E] hover:text-[#18181B]'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          Điểm luyện tập ({attempts.length})
        </button>
        <button
          type="button"
          onClick={() => setSubTab('target')}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
            subTab === 'target'
              ? 'bg-[#18181B] text-white'
              : 'bg-white border border-[#E6E1D6] text-[#57534E] hover:text-[#18181B]'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          🎯 Chỉnh sửa mục tiêu ({currentProfile.targetScore})
        </button>
      </div>

      {/* TAB 1: TIẾN ĐỘ HỌC TẬP */}
      {subTab === 'progress' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white border border-[#E6E1D6] rounded-xl p-6 space-y-5">
            <h2 className="text-lg font-bold text-[#18181B]">
              🏆 Thống kê học tập thực tế của bạn
            </h2>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#E6E1D6]">
                <div className="text-xs text-[#6E6A63]">Bài đã đăng</div>
                <div className="font-mono-code text-2xl font-bold text-[#18181B] mt-1">
                  {userPosts.length}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#E6E1D6]">
                <div className="text-xs text-[#6E6A63]">Tỉ lệ đúng bài tập</div>
                <div className="font-mono-code text-2xl font-bold text-[#059669] mt-1">
                  {totalQuestions > 0 ? `${accuracyPct}%` : '—'}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-[#FAF8F5] border border-[#E6E1D6]">
                <div className="text-xs text-[#6E6A63]">Điểm tích lũy</div>
                <div className="font-mono-code text-2xl font-bold text-[#5B3FD9] mt-1">
                  {currentProfile.xp} XP
                </div>
              </div>
            </div>

            {/* Target reminder card */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E1D6] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#18181B]">
                  Mục tiêu hiện tại:
                </span>
                <button
                  type="button"
                  onClick={() => setSubTab('target')}
                  className="text-xs font-bold text-[#5B3FD9] hover:underline"
                >
                  Chỉnh sửa mục tiêu →
                </button>
              </div>
              <div className="text-base font-bold text-[#18181B]">
                {currentProfile.targetScore}
              </div>
              {currentProfile.targetDeadline && (
                <div className="text-xs text-[#6E6A63] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Thời hạn / Ngày thi: {currentProfile.targetDeadline}</span>
                </div>
              )}
            </div>
          </div>

          {/* Frequent Mistakes & AI Drill Launcher */}
          <div className="lg:col-span-5 bg-white border border-[#E6E1D6] rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-[#D97706]" />
              <h2 className="text-lg font-bold text-[#18181B]">
                Sổ tay lỗi thường mắc của bạn
              </h2>
            </div>
            {currentProfile.frequentMistakes.length === 0 ? (
              <p className="text-xs text-[#57534E] leading-relaxed">
                Bạn chưa có lỗi nào được ghi nhận. Khi bạn sử dụng AI sửa bài viết ở mục <strong>✍️ Write</strong> hoặc làm bài ở mục <strong>📚 Practice</strong>, các lỗi thực tế của bạn sẽ hiển thị tại đây.
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  {currentProfile.frequentMistakes.map((mistake, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#FAF8F5] border border-[#E6E1D6] text-xs font-semibold text-[#18181B] flex items-center gap-2"
                    >
                      <span className="font-mono-code text-[#DC2626]">#{idx + 1}</span>
                      <span>{mistake}</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={onGoToMistakeDrill}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-bold transition cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#FBBF24]" />
                  🧠 Luyện bài tập AI khắc phục các lỗi này
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: BÀI ĐÃ ĐĂNG */}
      {subTab === 'posts' && (
        <div className="space-y-4">
          {userPosts.length === 0 ? (
            <div className="bg-white border border-[#E6E1D6] rounded-xl p-8 text-center text-sm text-[#57534E]">
              Bạn chưa đăng bài viết nào. Hãy vào mục <strong>✍️ Write</strong> để viết bài và chia sẻ cùng cộng đồng!
            </div>
          ) : (
            userPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white border border-[#E6E1D6] rounded-xl p-5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#5B3FD9]">
                    {post.mode} • {post.topicTag}
                  </span>
                  <span className="font-mono-code text-xs font-bold px-2.5 py-0.5 rounded bg-[#FAF8F5] border border-[#E6E1D6]">
                    {post.aiScore}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#18181B]">{post.title}</h3>
                <p className="text-sm text-[#57534E]">{post.content}</p>
                <div className="text-xs text-[#6E6A63] pt-1">
                  ❤️ {post.likesCount} lượt thích • 💬 {post.commentsCount} bình luận
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: ĐIỂM LUYỆN TẬP */}
      {subTab === 'scores' && (
        <div className="bg-white border border-[#E6E1D6] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[#E6E1D6] bg-[#FAF8F5] text-xs font-bold uppercase tracking-wider text-[#6E6A63]">
            Lịch sử làm bài luyện tập & Mini Test
          </div>
          {attempts.length === 0 ? (
            <div className="p-8 text-center text-sm text-[#57534E]">
              Bạn chưa có lượt làm bài nào được lưu. Hãy hoàn thành bài tập trong mục <strong>📚 Practice</strong>!
            </div>
          ) : (
            <div className="divide-y divide-[#E6E1D6]">
              {attempts.map((att) => (
                <div
                  key={att.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono-code text-xs font-bold px-2 py-0.5 rounded bg-[#F3EFEA]">
                        {att.mode} • {att.category}
                      </span>
                      <span className="text-sm font-bold text-[#18181B]">{att.title}</span>
                    </div>
                    <div className="text-xs text-[#6E6A63] mt-1">
                      Hoàn thành:{' '}
                      {new Date(att.createdAt).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono-code text-xs font-bold text-[#059669]">
                      Đúng {att.score}/{att.total}
                    </span>
                    <span className="font-mono-code text-xs font-bold px-3 py-1 rounded bg-[#18181B] text-white">
                      {att.estimatedBandOrScore}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: TỰ CHỈNH SỬA MỤC TIÊU HỌC TẬP (USER CUSTOMIZABLE) */}
      {subTab === 'target' && (
        <div className="bg-white border border-[#E6E1D6] rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
          <div className="border-b border-[#E6E1D6] pb-4">
            <h2 className="text-xl font-bold text-[#18181B] flex items-center gap-2">
              <Target className="w-5 h-5 text-[#5B3FD9]" />
              Thiết lập & Tùy chỉnh mục tiêu học tập cá nhân
            </h2>
            <p className="text-xs md:text-sm text-[#57534E] mt-1">
              Bạn có thể tự do chỉnh sửa điểm số mục tiêu, thời hạn và kỹ năng trọng tâm để AI tối ưu lộ trình chấm điểm và bài tập riêng cho bạn.
            </p>
          </div>

          {goalSavedSuccess && (
            <div className="p-3.5 rounded-xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#059669] text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Đã lưu thành công mục tiêu học tập mới của bạn!</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Step 1: Chọn Chế độ chính */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6A63]">
                1. Chế độ luyện thi
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setTargetMode('TOEIC');
                    setCustomTargetScore('TOEIC 800+');
                  }}
                  className={`p-4 rounded-xl border-2 text-left transition cursor-pointer ${
                    targetMode === 'TOEIC'
                      ? 'bg-[#F0F5FF] border-[#1E40AF] text-[#1E40AF]'
                      : 'bg-[#FAF8F5] border-[#E6E1D6] text-[#57534E] hover:border-[#1E40AF]'
                  }`}
                >
                  <div className="font-bold text-sm">TOEIC Mode</div>
                  <div className="text-xs opacity-80 mt-1">
                    Công sở, thương mại, Part 1-7
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTargetMode('IELTS');
                    setCustomTargetScore('IELTS 8.0');
                  }}
                  className={`p-4 rounded-xl border-2 text-left transition cursor-pointer ${
                    targetMode === 'IELTS'
                      ? 'bg-[#F6F4FF] border-[#5B3FD9] text-[#5B3FD9]'
                      : 'bg-[#FAF8F5] border-[#E6E1D6] text-[#57534E] hover:border-[#5B3FD9]'
                  }`}
                >
                  <div className="font-bold text-sm">IELTS Mode</div>
                  <div className="text-xs opacity-80 mt-1">
                    Học thuật, 4 kỹ năng chuẩn quốc tế
                  </div>
                </button>
              </div>
            </div>

            {/* Step 2: Tự do nhập Điểm mục tiêu */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6A63]">
                2. Điểm số mục tiêu cụ thể (Tự chỉnh sửa)
              </label>
              <input
                type="text"
                value={customTargetScore}
                onChange={(e) => setCustomTargetScore(e.target.value)}
                placeholder="Ví dụ: IELTS 8.0, TOEIC 850, TOEIC 900+..."
                className="w-full px-4 py-3 rounded-xl border border-[#E6E1D6] bg-[#FAF8F5] text-sm font-bold text-[#18181B] focus:outline-none focus:border-[#18181B]"
              />

              {/* Quick Target Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[11px] text-[#6E6A63] self-center mr-1">
                  Chọn nhanh:
                </span>
                {COMMON_TARGETS[targetMode].map((targetOption) => (
                  <button
                    key={targetOption}
                    type="button"
                    onClick={() => setCustomTargetScore(targetOption)}
                    className="text-[11px] px-2.5 py-1 rounded-md border border-[#D6D1C7] bg-white hover:bg-[#F3EFEA] text-[#18181B] font-semibold transition cursor-pointer"
                  >
                    {targetOption}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Thời hạn mục tiêu / Ngày thi */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6A63] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>3. Thời hạn mục tiêu / Ngày thi dự kiến</span>
              </label>
              <input
                type="text"
                value={targetDeadline}
                onChange={(e) => setTargetDeadline(e.target.value)}
                placeholder="Ví dụ: 30/12/2026, hoặc trong vòng 3 tháng tới..."
                className="w-full px-4 py-3 rounded-xl border border-[#E6E1D6] bg-[#FAF8F5] text-sm text-[#18181B] focus:outline-none focus:border-[#18181B]"
              />
            </div>

            {/* Step 4: Thời gian học mỗi ngày */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6A63] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>4. Thời gian luyện tập mỗi ngày</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDailyGoalMinutes(mins)}
                    className={`py-2.5 px-2 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      dailyGoalMinutes === mins
                        ? 'bg-[#18181B] text-white border-[#18181B]'
                        : 'bg-[#FAF8F5] border-[#E6E1D6] text-[#57534E] hover:text-[#18181B]'
                    }`}
                  >
                    {mins} phút
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step 5: Kỹ năng trọng tâm */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6A63]">
              5. Kỹ năng bạn muốn tập trung bứt phá nhất
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {ALL_SKILLS.map((skill) => {
                const isSelected = focusSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleFocusSkill(skill)}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-[#ECFDF5] border-[#059669] text-[#059669]'
                        : 'bg-[#FAF8F5] border-[#E6E1D6] text-[#57534E] hover:border-[#18181B]'
                    }`}
                  >
                    <span>{skill}</span>
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Save Goal Button */}
          <div className="pt-4 border-t border-[#E6E1D6] flex justify-end">
            <button
              type="button"
              onClick={handleSaveCustomGoal}
              disabled={isSavingGoal}
              className="py-3 px-6 rounded-xl bg-[#18181B] hover:bg-[#27272A] text-white font-bold text-sm shadow-sm transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{isSavingGoal ? 'Đang lưu mục tiêu...' : 'Lưu mục tiêu học tập'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkAllRead,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#E6E1D6] pb-5">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-[#6E6A63]">
            🔔 Notifications
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#18181B] mt-1">
            Thông báo của bạn
          </h1>
        </div>
        {notifications.length > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#E6E1D6] bg-white hover:bg-[#F3EFEA] text-xs font-bold text-[#18181B] transition cursor-pointer"
          >
            <CheckCheck className="w-4 h-4" />
            Đánh dấu đã đọc tất cả
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white border border-[#E6E1D6] rounded-xl p-10 text-center space-y-3">
          <Bell className="w-8 h-8 text-[#6E6A63] mx-auto" />
          <h3 className="text-lg font-bold text-[#18181B]">Chưa có thông báo mới</h3>
          <p className="text-sm text-[#57534E] max-w-md mx-auto">
            Khi có người thích hoặc bình luận vào bài viết của bạn, thông báo thực tế sẽ xuất hiện tại đây.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[#E6E1D6] rounded-xl divide-y divide-[#E6E1D6]">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 flex items-start gap-3.5 ${
                !n.read ? 'bg-[#FAF8F5]' : 'bg-white'
              }`}
            >
              {n.actorAvatar ? (
                <img
                  src={n.actorAvatar}
                  alt={n.actorName}
                  className="w-10 h-10 rounded-full object-cover border border-[#E6E1D6]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#18181B] text-white flex items-center justify-center font-bold text-sm">
                  {n.actorName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#18181B]">{n.actorName}</span>
                  <span className="text-xs text-[#6E6A63]">
                    {new Date(n.createdAt).toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-sm text-[#57534E]">{n.message}</p>
                {n.postTitle && (
                  <p className="text-xs font-semibold text-[#5B3FD9]">
                    Bài viết: "{n.postTitle}"
                  </p>
                )}
              </div>
              {!n.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#5B3FD9] mt-2 shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
