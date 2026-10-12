import React, { useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import {
  Code,
  Files,
  Search,
  PenTool,
  BookOpen,
  Gamepad2,
  Layers,
  User,
  Settings,
  FolderOpen,
  ChevronDown,
  Target,
  Sun,
  X,
  Bell,
} from 'lucide-react';
import { LearningMode, NavSection, UserProfile } from '../types';

export interface VSCodeFileItem {
  id: NavSection;
  file: string;
  ext: string;
  color: string;
  label: string;
}

export const VSCODE_FILES: VSCodeFileItem[] = [
  { id: 'home', file: 'FeedCommunity.tsx', ext: 'tsx', color: '#3178C6', label: 'Bảng tin Cộng đồng' },
  { id: 'write', file: 'WriteStudio.md', ext: 'md', color: '#569CD6', label: 'Write & AI Studio' },
  { id: 'flashcards', file: 'VocabFlashcards.deck', ext: 'deck', color: '#4EC9B0', label: 'Flashcard Từ vựng' },
  { id: 'game', file: 'VocabGame.py', ext: 'py', color: '#DCDCAA', label: 'Trò chơi Từ vựng' },
  { id: 'practice', file: 'PracticeQuestions.quiz', ext: 'quiz', color: '#CE9178', label: 'Luyện đề Mục tiêu' },
  { id: 'profile', file: 'LearnerProfile.json', ext: 'json', color: '#C586C0', label: 'Hồ sơ & Mục tiêu' },
  { id: 'notifications', file: 'Notifications.log', ext: 'log', color: '#E5C07B', label: 'Thông báo' },
];

interface VSCodeLayoutProps {
  children: React.ReactNode;
  activeNav: NavSection;
  onNavigate: (nav: NavSection) => void;
  learningMode: LearningMode;
  onModeChange: (mode: LearningMode) => void;
  targetScore: string;
  streakDays: number;
  xp: number;
  frequentMistakes: string[];
  unreadNotifCount: number;
  notificationCount: number;
  user: FirebaseUser | null;
  profile: UserProfile | null;
  onOpenAuth: () => void;
  onExitVSCode: () => void;
  onOpenCommandPalette: () => void;
}

export const VSCodeLayout: React.FC<VSCodeLayoutProps> = ({
  children,
  activeNav,
  onNavigate,
  learningMode,
  onModeChange,
  targetScore,
  streakDays,
  xp,
  frequentMistakes,
  unreadNotifCount,
  notificationCount,
  user,
  profile,
  onOpenAuth,
  onExitVSCode,
  onOpenCommandPalette,
}) => {
  const [showExplorer, setShowExplorer] = useState(true);

  return (
    <div className="vscode-theme min-h-screen bg-[#1E1E1E] text-[#CCCCCC] flex flex-col font-mono-code select-none overflow-x-hidden">
      {/* 1. Titlebar */}
      <header className="h-9 bg-[#323233] border-b border-[#252526] text-[#CCCCCC] text-xs flex items-center justify-between px-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[#007ACC] font-bold">
            <Code className="w-4 h-4" />
            <span className="hidden sm:inline text-white font-semibold">VS Code</span>
          </div>
          <div className="hidden md:flex items-center gap-1 text-[11px] text-[#CCCCCC]">
            <span className="px-1.5 py-0.5 rounded hover:bg-[#454545] cursor-pointer">File</span>
            <span className="px-1.5 py-0.5 rounded hover:bg-[#454545] cursor-pointer">Edit</span>
            <span className="px-1.5 py-0.5 rounded hover:bg-[#454545] cursor-pointer">Selection</span>
            <span className="px-1.5 py-0.5 rounded hover:bg-[#454545] cursor-pointer">View</span>
            <span className="px-1.5 py-0.5 rounded hover:bg-[#454545] cursor-pointer">Go</span>
            <span className="px-1.5 py-0.5 rounded hover:bg-[#454545] cursor-pointer">Run</span>
            <span className="px-1.5 py-0.5 rounded hover:bg-[#454545] cursor-pointer">Terminal</span>
            <span className="px-1.5 py-0.5 rounded hover:bg-[#454545] cursor-pointer">Help</span>
          </div>
        </div>

        {/* Central Command Search */}
        <div
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-1 bg-[#1E1E1E] hover:bg-[#282828] border border-[#3C3C3C] rounded-md text-xs text-[#858585] cursor-pointer w-64 sm:w-80 md:w-96 justify-center transition"
          title="Mở VS Code Command Palette (Ctrl+K / Cmd+K)"
        >
          <Search className="w-3.5 h-3.5 text-[#858585]" />
          <span className="truncate">englishhub-ai [Workspace] — Nhấn ⌘K để tìm kiếm lệnh</span>
        </div>

        {/* Right Controls & Exit Mode Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onExitVSCode}
            className="flex items-center gap-1.5 px-2 py-0.5 bg-[#007ACC] hover:bg-[#0062A3] text-white rounded text-[11px] font-bold cursor-pointer transition"
            title="Trở về giao diện tạp chí chuẩn"
          >
            <Sun className="w-3 h-3" />
            <span className="hidden sm:inline">Giao diện chuẩn</span>
          </button>
          <div className="hidden sm:flex items-center gap-2 text-[#858585] pl-2">
            <span className="hover:text-white cursor-pointer">—</span>
            <span className="hover:text-white cursor-pointer">□</span>
            <span className="hover:text-white cursor-pointer">✕</span>
          </div>
        </div>
      </header>

      {/* 2. Workspace Body: Activity Bar + Explorer + Main Editor */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Activity Bar (left slim column) */}
        <div className="w-12 bg-[#333333] border-r border-[#252526] flex flex-col items-center justify-between py-2 shrink-0 select-none">
          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => setShowExplorer(!showExplorer)}
              className={`p-2 rounded cursor-pointer transition ${
                showExplorer ? 'text-white border-l-2 border-[#007ACC]' : 'text-[#858585] hover:text-white'
              }`}
              title="Explorer (Toggle Sidebar)"
            >
              <Files className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="p-2 text-[#858585] hover:text-white rounded cursor-pointer transition"
              title="Command Search (Ctrl+K)"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('flashcards')}
              className={`p-2 rounded cursor-pointer transition ${
                activeNav === 'flashcards' ? 'text-white border-l-2 border-[#007ACC]' : 'text-[#858585] hover:text-white'
              }`}
              title="Vocab Flashcards Deck"
            >
              <Layers className="w-5 h-5 text-[#4EC9B0]" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('game')}
              className={`p-2 rounded cursor-pointer transition ${
                activeNav === 'game' ? 'text-white border-l-2 border-[#007ACC]' : 'text-[#858585] hover:text-white'
              }`}
              title="Vocab Match & Sprint Game"
            >
              <Gamepad2 className="w-5 h-5 text-[#DCDCAA]" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('write')}
              className={`p-2 rounded cursor-pointer transition ${
                activeNav === 'write' ? 'text-white border-l-2 border-[#007ACC]' : 'text-[#858585] hover:text-white'
              }`}
              title="Write & AI Inspection Studio"
            >
              <PenTool className="w-5 h-5 text-[#569CD6]" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('practice')}
              className={`p-2 rounded cursor-pointer transition ${
                activeNav === 'practice' ? 'text-white border-l-2 border-[#007ACC]' : 'text-[#858585] hover:text-white'
              }`}
              title="Practice Quiz & Test Drills"
            >
              <BookOpen className="w-5 h-5 text-[#CE9178]" />
            </button>
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('profile')}
              className={`p-2 rounded cursor-pointer transition ${
                activeNav === 'profile' ? 'text-white border-l-2 border-[#007ACC]' : 'text-[#858585] hover:text-white'
              }`}
              title="Learner Profile & Goals"
            >
              <User className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onOpenCommandPalette}
              className="p-2 text-[#858585] hover:text-white rounded cursor-pointer transition"
              title="Settings & Commands"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Explorer Sidebar */}
        {showExplorer && (
          <aside className="w-56 md:w-64 bg-[#252526] border-r border-[#1E1E1E] flex flex-col justify-between text-xs text-[#CCCCCC] shrink-0 overflow-y-auto">
            <div className="p-2 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between px-2 text-[11px] font-bold uppercase tracking-wider text-[#BBBBBB]">
                <span>Explorer</span>
                <span className="text-[10px] text-[#858585]">WORKSPACE</span>
              </div>

              {/* Folder: Workspace Files */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 px-2 py-1 text-[#CCCCCC] font-bold text-xs select-none">
                  <ChevronDown className="w-3.5 h-3.5 text-[#858585]" />
                  <FolderOpen className="w-3.5 h-3.5 text-[#DCDCAA]" />
                  <span>ENGLISHHUB-AI</span>
                </div>
                <div className="pl-4 space-y-0.5">
                  {VSCODE_FILES.map((file) => {
                    const isActive = activeNav === file.id;
                    return (
                      <button
                        key={file.id}
                        type="button"
                        onClick={() => onNavigate(file.id)}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs transition cursor-pointer text-left ${
                          isActive
                            ? 'bg-[#37373D] text-white font-semibold'
                            : 'text-[#CCCCCC] hover:bg-[#2A2D2E]'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span style={{ color: file.color }} className="text-[11px] font-mono-code font-bold">
                            {file.ext}
                          </span>
                          <span className="truncate">{file.file}</span>
                        </div>
                        {file.id === 'notifications' && unreadNotifCount > 0 && (
                          <span className="px-1.5 py-0.2 rounded-full bg-[#007ACC] text-white text-[9px]">
                            {unreadNotifCount}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Target & Learning Mode Card */}
              <div className="p-2.5 rounded bg-[#1E1E1E] border border-[#333333] space-y-2">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#858585]">
                  <span className="flex items-center gap-1">
                    <Target className="w-3 h-3 text-[#4EC9B0]" />
                    <span>Target Exam</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate('profile')}
                    className="text-[#569CD6] hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <div className="font-bold text-xs text-white">
                  {targetScore}
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onClick={() => onModeChange('TOEIC')}
                    className={`py-1 px-1.5 rounded text-[10px] font-bold transition cursor-pointer ${
                      learningMode === 'TOEIC'
                        ? 'bg-[#007ACC] text-white'
                        : 'bg-[#2D2D2D] text-[#AAAAAA] hover:text-white'
                    }`}
                  >
                    TOEIC 800+
                  </button>
                  <button
                    type="button"
                    onClick={() => onModeChange('IELTS')}
                    className={`py-1 px-1.5 rounded text-[10px] font-bold transition cursor-pointer ${
                      learningMode === 'IELTS'
                        ? 'bg-[#569CD6] text-white'
                        : 'bg-[#2D2D2D] text-[#AAAAAA] hover:text-white'
                    }`}
                  >
                    IELTS 8.0
                  </button>
                </div>
                <div className="pt-1 border-t border-[#333333] flex items-center justify-between text-[10px] text-[#858585]">
                  <span>🔥 {streakDays} ngày streak</span>
                  <span>⚡ {xp} XP</span>
                </div>
              </div>

              {/* Outline: Frequent Mistakes */}
              {frequentMistakes.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-wider text-[#858585]">
                    <span>AI Mistakes ({frequentMistakes.length})</span>
                  </div>
                  <div className="space-y-1">
                    {frequentMistakes.slice(0, 3).map((m, idx) => (
                      <div
                        key={idx}
                        onClick={() => onNavigate('practice')}
                        className="px-2 py-1 rounded bg-[#1E1E1E] text-[10px] text-[#CE9178] truncate cursor-pointer hover:bg-[#2D2D2D]"
                      >
                        ! {m}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Status Bottom of Sidebar */}
            <div className="p-3 border-t border-[#333333] bg-[#1E1E1E]/50">
              {user && profile ? (
                <div
                  onClick={() => onNavigate('profile')}
                  className="flex items-center gap-2 cursor-pointer hover:bg-[#2A2D2E] p-1.5 rounded"
                >
                  <div className="w-6 h-6 rounded-full bg-[#007ACC] text-white flex items-center justify-center font-bold text-[10px]">
                    {profile.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-white truncate">
                      {profile.displayName}
                    </div>
                    <div className="text-[10px] text-[#858585] truncate">
                      Online (Cloud Sync)
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="text-[10px] text-[#858585]">
                    Chế độ Khách (Local)
                  </div>
                  <button
                    type="button"
                    onClick={onOpenAuth}
                    className="w-full py-1 px-2 rounded bg-[#007ACC] hover:bg-[#0062A3] text-white text-[11px] font-bold text-center cursor-pointer transition"
                  >
                    Đăng nhập tài khoản
                  </button>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* 3. Main Editor Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#1E1E1E] overflow-hidden">
          {/* Editor Tabs Bar */}
          <div className="h-9 bg-[#252526] flex items-center border-b border-[#1E1E1E] overflow-x-auto select-none shrink-0">
            {VSCODE_FILES.map((file) => {
              const isActive = activeNav === file.id;
              return (
                <div
                  key={file.id}
                  onClick={() => onNavigate(file.id)}
                  className={`flex items-center gap-2 px-3.5 h-full text-xs cursor-pointer border-r border-[#1E1E1E] shrink-0 transition ${
                    isActive
                      ? 'bg-[#1E1E1E] text-white border-t-2 border-[#007ACC]'
                      : 'bg-[#2D2D2D] text-[#969696] hover:bg-[#282828] hover:text-[#CCCCCC]'
                  }`}
                >
                  <span style={{ color: file.color }} className="font-mono-code font-bold text-[11px]">
                    {file.ext}
                  </span>
                  <span>{file.file}</span>
                  {isActive && (
                    <span className="text-[10px] text-[#858585] hover:text-white ml-1">✕</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Breadcrumbs */}
          <div className="h-6 bg-[#1E1E1E] px-4 flex items-center text-[11px] text-[#858585] border-b border-[#2D2D2D] shrink-0">
            <span>englishhub-ai</span>
            <span className="mx-1">&gt;</span>
            <span>src</span>
            <span className="mx-1">&gt;</span>
            <span className="text-[#CCCCCC]">{activeNav}</span>
            <span className="mx-1">&gt;</span>
            <span className="text-[#007ACC]">{learningMode} ({targetScore})</span>
          </div>

          {/* Editor Body Canvas */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto w-full">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* 4. Bottom Status Bar */}
      <footer className="h-6 bg-[#007ACC] text-white text-[11px] flex items-center justify-between px-3 select-none shrink-0 font-mono-code">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span>⎇</span>
            <span>main*</span>
          </span>
          <span className="flex items-center gap-1">
            <span>0 ⚠️</span>
            <span>0 ❌</span>
          </span>
          <span className="hidden sm:inline">🎯 {targetScore}</span>
          <span className="hidden md:inline">🔥 {streakDays}d streak</span>
          <span className="hidden lg:inline">⚡ {xp} XP</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">Ln 1, Col 1</span>
          <span className="hidden md:inline">Spaces: 2</span>
          <span>UTF-8</span>
          <span className="hidden sm:inline">TypeScript JSX</span>
          <span className="hidden lg:inline">Prettier</span>
          <span
            onClick={onOpenCommandPalette}
            className="hover:underline cursor-pointer flex items-center gap-1 font-bold"
            title="Mở Command Palette"
          >
            <span>⌘K</span>
          </span>
          <span
            onClick={() => onNavigate('notifications')}
            className="hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>🔔</span>
            <span>{notificationCount}</span>
          </span>
        </div>
      </footer>
    </div>
  );
};
