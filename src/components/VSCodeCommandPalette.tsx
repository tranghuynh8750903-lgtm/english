import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  BookOpen,
  PenTool,
  Gamepad2,
  Brain,
  Home,
  User,
  Bell,
  Code,
  Target,
  Sun,
  Moon,
  LogOut,
  LogIn,
  Check,
  Zap,
} from 'lucide-react';
import { LearningMode, NavSection } from '../types';

export interface CommandItem {
  id: string;
  title: string;
  detail: string;
  category: 'Navigation' | 'Target' | 'Preferences' | 'Account';
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
}

interface VSCodeCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (nav: NavSection) => void;
  learningMode: LearningMode;
  onModeChange: (mode: LearningMode) => void;
  vsCodeMode: boolean;
  onToggleVSCodeMode: () => void;
  isAuthenticated: boolean;
  onOpenAuth: () => void;
  onSignOut: () => void;
  currentScore: string;
}

export const VSCodeCommandPalette: React.FC<VSCodeCommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  learningMode,
  onModeChange,
  vsCodeMode,
  onToggleVSCodeMode,
  isAuthenticated,
  onOpenAuth,
  onSignOut,
  currentScore,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const commands: CommandItem[] = [
    {
      id: 'nav-flashcards',
      title: 'Mở Học Từ Vựng Flashcard (Flashcards.deck)',
      detail: 'Ôn tập thẻ từ vựng thông minh, Spaced Repetition, có phát âm audio',
      category: 'Navigation',
      icon: <BookOpen className="w-4 h-4 text-[#4EC9B0]" />,
      shortcut: 'F',
      action: () => {
        onNavigate('flashcards');
        onClose();
      },
    },
    {
      id: 'nav-game',
      title: 'Mở Trò Chơi Từ Vựng (VocabGame.py)',
      detail: 'Game ghép cặp từ đồng nghĩa & Speed Sprint chạy đua 45 giây',
      category: 'Navigation',
      icon: <Gamepad2 className="w-4 h-4 text-[#CE9178]" />,
      shortcut: 'G',
      action: () => {
        onNavigate('game');
        onClose();
      },
    },
    {
      id: 'nav-write',
      title: 'Mở Write & Grammar Studio (WriteStudio.md)',
      detail: 'Soạn thảo bài viết và phân tích ngữ pháp, từ vựng chuẩn mục tiêu',
      category: 'Navigation',
      icon: <PenTool className="w-4 h-4 text-[#569CD6]" />,
      shortcut: 'W',
      action: () => {
        onNavigate('write');
        onClose();
      },
    },
    {
      id: 'nav-practice',
      title: 'Mở Luyện Tập Đề Thi (Practice.quiz)',
      detail: 'Luyện câu hỏi Reading, Listening, Ngữ pháp kèm giải thích chi tiết',
      category: 'Navigation',
      icon: <Zap className="w-4 h-4 text-[#DCDCAA]" />,
      shortcut: 'P',
      action: () => {
        onNavigate('practice');
        onClose();
      },
    },
    {
      id: 'nav-home',
      title: 'Mở Bảng Tin Cộng Đồng (FeedCommunity.tsx)',
      detail: 'Xem bài viết, thảo luận cùng học viên IELTS/TOEIC',
      category: 'Navigation',
      icon: <Home className="w-4 h-4 text-[#9CDCFE]" />,
      shortcut: 'H',
      action: () => {
        onNavigate('home');
        onClose();
      },
    },
    {
      id: 'nav-profile',
      title: 'Mở Hồ Sơ & Tự Chỉnh Sửa Mục Tiêu (LearnerProfile.json)',
      detail: `Tự cài đặt mục tiêu điểm số (hiện tại: ${currentScore}), deadline, kỹ năng ưu tiên`,
      category: 'Target',
      icon: <Target className="w-4 h-4 text-[#C586C0]" />,
      action: () => {
        onNavigate('profile');
        onClose();
      },
    },
    {
      id: 'mode-ielts',
      title: 'Chuyển Mục Tiêu: IELTS 8.0 Academic',
      detail: 'Chuyển toàn bộ bài học, flashcard và đề thi sang lộ trình IELTS 8.0',
      category: 'Target',
      icon: <Check className={`w-4 h-4 ${learningMode === 'IELTS' ? 'text-[#4EC9B0]' : 'text-gray-500'}`} />,
      action: () => {
        onModeChange('IELTS');
        onClose();
      },
    },
    {
      id: 'mode-toeic',
      title: 'Chuyển Mục Tiêu: TOEIC 800+ Business',
      detail: 'Chuyển toàn bộ bài học, flashcard và đề thi sang lộ trình TOEIC 800+',
      category: 'Target',
      icon: <Check className={`w-4 h-4 ${learningMode === 'TOEIC' ? 'text-[#4EC9B0]' : 'text-gray-500'}`} />,
      action: () => {
        onModeChange('TOEIC');
        onClose();
      },
    },
    {
      id: 'toggle-vscode',
      title: vsCodeMode ? 'Chuyển sang Giao Diện Chuẩn (Warm Paper)' : 'Kích hoạt Giao Diện VS Code IDE Dark+',
      detail: vsCodeMode ? 'Trở về phong cách tạp chí học thuật chuẩn' : 'Chuyển sang giao diện Visual Studio Code chuẩn cho Developer',
      category: 'Preferences',
      icon: vsCodeMode ? <Sun className="w-4 h-4 text-[#CE9178]" /> : <Moon className="w-4 h-4 text-[#569CD6]" />,
      shortcut: 'Ctrl+Shift+P',
      action: () => {
        onToggleVSCodeMode();
        onClose();
      },
    },
    {
      id: 'nav-notifications',
      title: 'Xem Thông Báo Học Tập (Notifications)',
      detail: 'Xem tương tác, tiến độ và huy hiệu đạt được',
      category: 'Navigation',
      icon: <Bell className="w-4 h-4 text-[#DCDCAA]" />,
      action: () => {
        onNavigate('notifications');
        onClose();
      },
    },
    ...(isAuthenticated
      ? [
          {
            id: 'auth-signout',
            title: 'Đăng xuất tài khoản',
            detail: 'Quay về chế độ Khách (Guest Mode) lưu trữ cục bộ',
            category: 'Account' as const,
            icon: <LogOut className="w-4 h-4 text-[#F14C4C]" />,
            action: () => {
              onSignOut();
              onClose();
            },
          },
        ]
      : [
          {
            id: 'auth-signin',
            title: 'Đăng nhập tài khoản (Google / Facebook)',
            detail: 'Đồng bộ tiến độ học tập, điểm số và bài viết lên đám mây',
            category: 'Account' as const,
            icon: <LogIn className="w-4 h-4 text-[#4EC9B0]" />,
            action: () => {
              onOpenAuth();
              onClose();
            },
          },
        ]),
  ];

  const filteredCommands = commands.filter((cmd) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      cmd.title.toLowerCase().includes(q) ||
      cmd.detail.toLowerCase().includes(q) ||
      cmd.category.toLowerCase().includes(q)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#252526] text-[#CCCCCC] rounded-lg shadow-2xl border border-[#454545] overflow-hidden flex flex-col font-mono-code text-xs"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Input Bar */}
        <div className="flex items-center gap-2.5 px-4 py-3 bg-[#1E1E1E] border-b border-[#333333]">
          <span className="text-[#007ACC] font-bold text-sm select-none">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search... (e.g. flashcards, write, ielts, toeic, theme)"
            className="w-full bg-transparent text-[#FFFFFF] placeholder-[#808080] outline-none text-sm"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-[#333333] text-[#AAAAAA] rounded border border-[#444444]">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-[#333333]/50">
          {filteredCommands.length === 0 ? (
            <div className="py-8 text-center text-[#808080]">
              Không tìm thấy lệnh nào phù hợp với &quot;{query}&quot;
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={cmd.id}
                  onClick={() => cmd.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition select-none ${
                    isSelected ? 'bg-[#04395E] text-[#FFFFFF]' : 'hover:bg-[#2A2D2E]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0">{cmd.icon}</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-xs truncate">
                        {cmd.title}
                      </div>
                      <div className="text-[11px] text-[#9CDCFE] opacity-75 truncate">
                        {cmd.detail}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#1E1E1E] text-[#AAAAAA] border border-[#3A3D41]">
                      {cmd.category}
                    </span>
                    {cmd.shortcut && (
                      <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-[#333333] text-[#CCCCCC]">
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Status Hint Footer */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#1E1E1E] border-t border-[#333333] text-[11px] text-[#808080]">
          <div className="flex items-center gap-3">
            <span>↑↓ để điều hướng</span>
            <span>↵ để chọn</span>
            <span>ESC để thoát</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#007ACC] font-semibold">
            <Code className="w-3.5 h-3.5" />
            <span>EnglishHub VS Code Command Center</span>
          </div>
        </div>
      </div>
    </div>
  );
};
