import React, { useState, useEffect } from 'react';
import {
  Volume2,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  Star,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Plus,
  BookOpen,
  Filter,
  Layers,
  HelpCircle,
  Check,
  Award,
} from 'lucide-react';
import { FlashcardItem, LearningMode } from '../types';
import { INITIAL_FLASHCARDS } from '../data/flashcardData';

interface FlashcardHubProps {
  learningMode: LearningMode;
  targetScore: string;
  onModeChange: (mode: LearningMode) => void;
  onAwardXP: (amount: number) => void;
  onRecordDailyStudy?: (activity: string) => void;
}

const STORAGE_KEY = 'englishhub_flashcards_progress_v2';
const CUSTOM_CARDS_KEY = 'englishhub_custom_flashcards_v2';

export const FlashcardHub: React.FC<FlashcardHubProps> = ({
  learningMode,
  targetScore,
  onModeChange,
  onAwardXP,
  onRecordDailyStudy,
}) => {
  const [cards, setCards] = useState<FlashcardItem[]>(() => {
    let custom: FlashcardItem[] = [];
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(CUSTOM_CARDS_KEY);
        if (saved) custom = JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    const all = [...INITIAL_FLASHCARDS, ...custom];
    // load mastery & starred states
    if (typeof window !== 'undefined') {
      try {
        const savedState = localStorage.getItem(STORAGE_KEY);
        if (savedState) {
          const stateMap: Record<string, { mastered?: boolean; starred?: boolean }> =
            JSON.parse(savedState);
          return all.map((c) => ({
            ...c,
            mastered: stateMap[c.id]?.mastered || false,
            starred: stateMap[c.id]?.starred || false,
          }));
        }
      } catch {
        // ignore
      }
    }
    return all;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeDeck, setActiveDeck] = useState<string>('all');
  const [filterType, setFilterType] = useState<'all' | 'starred' | 'unmastered' | 'mastered'>('all');
  const [studyMode, setStudyMode] = useState<'flip' | 'quiz'>('flip');

  // Quiz state
  const [quizSelectedOption, setQuizSelectedOption] = useState<number | null>(null);
  const [quizAnswerChecked, setQuizAnswerChecked] = useState(false);

  // New Custom Card Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newIpa, setNewIpa] = useState('');
  const [newPos, setNewPos] = useState('noun');
  const [newMeaningVi, setNewMeaningVi] = useState('');
  const [newExample, setNewExample] = useState('');
  const [newCollocations, setNewCollocations] = useState('');

  // Persist flashcard mastery and starred states
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stateMap: Record<string, { mastered?: boolean; starred?: boolean }> = {};
      cards.forEach((c) => {
        stateMap[c.id] = { mastered: c.mastered, starred: c.starred };
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateMap));
    }
  }, [cards]);

  // Audio pronunciation helper
  const speakWord = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Filter cards by current mode (TOEIC / IELTS) and deck
  const modeCards = cards.filter((c) => c.mode === learningMode);
  const uniqueDecks = Array.from(new Set(modeCards.map((c) => c.deck)));

  const filteredCards = modeCards.filter((c) => {
    if (activeDeck !== 'all' && c.deck !== activeDeck) return false;
    if (filterType === 'starred' && !c.starred) return false;
    if (filterType === 'unmastered' && c.mastered) return false;
    if (filterType === 'mastered' && !c.mastered) return false;
    return true;
  });

  // Ensure current index is within bounds
  useEffect(() => {
    if (currentIndex >= filteredCards.length) {
      setCurrentIndex(0);
    }
    setIsFlipped(false);
    setQuizSelectedOption(null);
    setQuizAnswerChecked(false);
  }, [activeDeck, filterType, learningMode, filteredCards.length]);

  const currentCard: FlashcardItem | undefined = filteredCards[currentIndex];

  // Self-assessment handlers
  const handleMarkMastered = (cardId: string, mastered: boolean) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, mastered } : c))
    );
    if (mastered) {
      onAwardXP(15);
    }
    onRecordDailyStudy?.('flashcards');
    handleNextCard();
  };

  const handleToggleStar = (cardId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, starred: !c.starred } : c))
    );
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setQuizSelectedOption(null);
    setQuizAnswerChecked(false);
    if (currentIndex + 1 < filteredCards.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setQuizSelectedOption(null);
    setQuizAnswerChecked(false);
    if (currentIndex - 1 >= 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(Math.max(0, filteredCards.length - 1));
    }
  };

  const handleShuffle = () => {
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const handleSaveCustomCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newMeaningVi.trim()) return;

    const newCard: FlashcardItem = {
      id: `custom-fc-${Date.now()}`,
      mode: learningMode,
      deck: 'Từ vựng của tôi',
      word: newWord.trim(),
      ipa: newIpa.trim() || '/.../',
      partOfSpeech: newPos,
      meaningVi: newMeaningVi.trim(),
      definitionEn: newWord.trim(),
      collocations: newCollocations
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      exampleSentence: newExample.trim() || `Example sentence for ${newWord.trim()}.`,
      exampleTranslationVi: 'Ví dụ câu minh họa.',
      mastered: false,
      starred: true,
    };

    const updated = [newCard, ...cards];
    setCards(updated);

    // save custom cards
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(CUSTOM_CARDS_KEY);
        const existing: FlashcardItem[] = saved ? JSON.parse(saved) : [];
        localStorage.setItem(
          CUSTOM_CARDS_KEY,
          JSON.stringify([newCard, ...existing])
        );
      } catch {
        // ignore
      }
    }

    setNewWord('');
    setNewIpa('');
    setNewMeaningVi('');
    setNewExample('');
    setNewCollocations('');
    setShowAddModal(false);
    setActiveDeck('all');
    setCurrentIndex(0);
  };

  // Keyboard shortcut: Space to flip, Left/Right arrow to navigate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showAddModal || studyMode !== 'flip') return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNextCard();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevCard();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAddModal, studyMode, currentIndex, filteredCards.length]);

  // Quiz Mode Option Generator
  const getQuizOptions = () => {
    if (!currentCard) return [];
    const otherMeanings = modeCards
      .filter((c) => c.id !== currentCard.id)
      .map((c) => c.meaningVi)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [currentCard.meaningVi, ...otherMeanings].sort(
      () => Math.random() - 0.5
    );
    return options;
  };

  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  useEffect(() => {
    if (currentCard && studyMode === 'quiz') {
      setQuizOptions(getQuizOptions());
    }
  }, [currentIndex, currentCard?.id, studyMode]);

  // Overall Statistics
  const totalModeCount = modeCards.length;
  const masteredCount = modeCards.filter((c) => c.mastered).length;
  const starredCount = modeCards.filter((c) => c.starred).length;
  const masteryPercentage =
    totalModeCount > 0 ? Math.round((masteredCount / totalModeCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E6E1D6] pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#6E6A63]">
            <span className="flex items-center gap-1.5 text-[#D97706]">
              <Layers className="w-4 h-4" />
              Phương Pháp Lặp Lại Ngắt Quãng (Spaced Repetition)
            </span>
            <span>•</span>
            <span className={learningMode === 'IELTS' ? 'text-[#5B3FD9]' : 'text-[#1E40AF]'}>
              {learningMode === 'IELTS' ? 'IELTS 8.0 Academic' : 'TOEIC 800+ Business'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#18181B] mt-1">
            🗂️ Học Từ Vựng Bằng Flashcard
          </h1>
          <p className="text-sm text-[#57534E] mt-1">
            Lật thẻ thông minh, luyện phát âm chuẩn, tra cứu collocations và ghi nhớ từ vựng mục tiêu {targetScore} bền vững.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="inline-flex rounded-lg border border-[#E6E1D6] p-0.5 bg-[#FAF8F5]">
            <button
              type="button"
              onClick={() => onModeChange('TOEIC')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                learningMode === 'TOEIC'
                  ? 'bg-[#1E40AF] text-white shadow-2xs'
                  : 'text-[#57534E] hover:text-[#18181B]'
              }`}
            >
              TOEIC 800+
            </button>
            <button
              type="button"
              onClick={() => onModeChange('IELTS')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
                learningMode === 'IELTS'
                  ? 'bg-[#5B3FD9] text-white shadow-2xs'
                  : 'text-[#57534E] hover:text-[#18181B]'
              }`}
            >
              IELTS 8.0
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-bold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm thẻ mới</span>
          </button>
        </div>
      </div>

      {/* Progress & Deck Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Progress Bar (6 cols) */}
        <div className="md:col-span-6 bg-white border border-[#E6E1D6] p-4 rounded-xl flex items-center justify-between gap-4 shadow-2xs">
          <div className="space-y-1">
            <div className="text-xs text-[#6E6A63] font-semibold flex items-center gap-2">
              <span>Tiến độ ghi nhớ ({learningMode}):</span>
              <span className="font-mono-code font-bold text-[#059669]">
                {masteredCount} / {totalModeCount} thẻ ({masteryPercentage}%)
              </span>
            </div>
            <div className="w-48 sm:w-64 bg-[#FAF8F5] border border-[#E6E1D6] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#059669] h-full transition-all duration-300"
                style={{ width: `${masteryPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setFilterType(filterType === 'starred' ? 'all' : 'starred')}
              className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 font-semibold transition cursor-pointer ${
                filterType === 'starred'
                  ? 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
                  : 'bg-white border-[#E6E1D6] text-[#6E6A63] hover:text-[#18181B]'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current text-[#D97706]" />
              <span>{starredCount}</span>
            </button>
          </div>
        </div>

        {/* Study Mode Selector & Filter (6 cols) */}
        <div className="md:col-span-6 flex flex-wrap items-center justify-end gap-2">
          <div className="inline-flex rounded-lg border border-[#E6E1D6] p-0.5 bg-white">
            <button
              type="button"
              onClick={() => setStudyMode('flip')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                studyMode === 'flip'
                  ? 'bg-[#18181B] text-white'
                  : 'text-[#57534E] hover:text-[#18181B]'
              }`}
            >
              🗂️ Lật thẻ tự do
            </button>
            <button
              type="button"
              onClick={() => setStudyMode('quiz')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition cursor-pointer ${
                studyMode === 'quiz'
                  ? 'bg-[#18181B] text-white'
                  : 'text-[#57534E] hover:text-[#18181B]'
              }`}
            >
              ⚡ Trắc nghiệm phản xạ
            </button>
          </div>

          <button
            type="button"
            onClick={handleShuffle}
            className="p-2 rounded-lg border border-[#E6E1D6] bg-white hover:bg-[#F3EFEA] text-[#57534E] transition cursor-pointer"
            title="Trộn ngẫu nhiên thẻ"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Decks Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveDeck('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
            activeDeck === 'all'
              ? 'bg-[#18181B] text-white'
              : 'bg-white border border-[#E6E1D6] text-[#57534E] hover:text-[#18181B]'
          }`}
        >
          Tất cả chủ đề ({modeCards.length})
        </button>
        {uniqueDecks.map((deck) => {
          const count = modeCards.filter((c) => c.deck === deck).length;
          return (
            <button
              key={deck}
              type="button"
              onClick={() => setActiveDeck(deck)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                activeDeck === deck
                  ? 'bg-[#18181B] text-white'
                  : 'bg-white border border-[#E6E1D6] text-[#57534E] hover:text-[#18181B]'
              }`}
            >
              {deck} ({count})
            </button>
          );
        })}
      </div>

      {/* FLASHCARD INTERACTIVE ARENA */}
      {filteredCards.length === 0 ? (
        <div className="bg-white border border-[#E6E1D6] rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4">
          <BookOpen className="w-12 h-12 text-[#6E6A63] mx-auto opacity-50" />
          <h3 className="text-lg font-bold text-[#18181B]">
            Không tìm thấy thẻ nào
          </h3>
          <p className="text-xs text-[#57534E]">
            Bạn chưa có thẻ nào trong bộ lọc này hoặc chưa đánh dấu sao thẻ nào. Hãy đổi bộ lọc hoặc thêm thẻ mới!
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveDeck('all');
              setFilterType('all');
            }}
            className="px-4 py-2 rounded-lg bg-[#18181B] text-white text-xs font-bold cursor-pointer"
          >
            Xem lại tất cả thẻ
          </button>
        </div>
      ) : currentCard && studyMode === 'flip' ? (
        /* FLIP CARD MODE */
        <div className="max-w-xl mx-auto space-y-5">
          {/* Card Meta & Navigation Counter */}
          <div className="flex items-center justify-between text-xs font-semibold text-[#6E6A63]">
            <span className="font-mono-code">
              Thẻ {currentIndex + 1} / {filteredCards.length}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E6E1D6] text-[#18181B] text-[11px]">
              {currentCard.deck}
            </span>
          </div>

          {/* 3D Interactive Card Box */}
          <div
            onClick={() => setIsFlipped((prev) => !prev)}
            className="w-full min-h-[360px] bg-white border border-[#E6E1D6] rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-[#18181B] transition cursor-pointer relative select-none"
          >
            {/* Top Card Utilities */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E6E1D6] text-[#57534E]">
                {currentCard.partOfSpeech}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    speakWord(currentCard.word);
                  }}
                  className="p-1.5 rounded-lg hover:bg-[#FAF8F5] text-[#5B3FD9] transition cursor-pointer"
                  title="Phát âm từ vựng"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => handleToggleStar(currentCard.id, e)}
                  className="p-1.5 rounded-lg hover:bg-[#FAF8F5] text-[#D97706] transition cursor-pointer"
                  title="Đánh dấu thẻ quan trọng"
                >
                  <Star
                    className={`w-5 h-5 ${
                      currentCard.starred ? 'fill-[#D97706]' : ''
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Front & Back Content */}
            {!isFlipped ? (
              /* CARD FRONT */
              <div className="my-auto py-6 text-center space-y-3">
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-[#18181B] tracking-tight">
                  {currentCard.word}
                </h2>
                <div className="font-mono-code text-sm text-[#5B3FD9] font-medium">
                  {currentCard.ipa}
                </div>
                <p className="text-xs text-[#A8A29E] pt-4">
                  (Nhấp chuột vào thẻ hoặc nhấn phím cách Space để xem nghĩa)
                </p>
              </div>
            ) : (
              /* CARD BACK */
              <div className="my-auto py-4 space-y-4 animate-in fade-in duration-200">
                {/* Vietnamese Meaning */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E6A63]">
                    Nghĩa tiếng Việt
                  </span>
                  <div className="text-xl font-bold text-[#059669]">
                    {currentCard.meaningVi}
                  </div>
                </div>

                {/* Collocations */}
                {currentCard.collocations && currentCard.collocations.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E6A63]">
                      Collocations thực chiến
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentCard.collocations.map((col, i) => (
                        <span
                          key={i}
                          className="font-mono-code text-xs px-2.5 py-1 rounded bg-[#F3EFEA] text-[#18181B] font-semibold"
                        >
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Example sentence */}
                <div className="space-y-1 pt-1 border-t border-[#E6E1D6]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6E6A63]">
                    Ví dụ minh họa
                  </span>
                  <p className="text-xs text-[#18181B] font-serif leading-relaxed italic">
                    "{currentCard.exampleSentence}"
                  </p>
                  <p className="text-[11px] text-[#57534E]">
                    → {currentCard.exampleTranslationVi}
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Card Footer */}
            <div className="pt-3 border-t border-[#E6E1D6] flex items-center justify-between text-xs text-[#6E6A63]">
              <span>{isFlipped ? 'Mặt sau (Giải nghĩa)' : 'Mặt trước (Từ vựng)'}</span>
              <span className="text-[#A8A29E] text-[11px]">
                {currentCard.mastered ? '✅ Đã thuộc' : '⏳ Đang học'}
              </span>
            </div>
          </div>

          {/* Self-Rating / Leitner Spaced Repetition Buttons */}
          <div className="grid grid-cols-3 gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => handleMarkMastered(currentCard.id, false)}
              className="py-3 px-3 rounded-xl border border-[#FECACA] bg-[#FEF2F2] hover:bg-[#FEE2E2] text-[#DC2626] text-xs font-bold transition cursor-pointer flex flex-col items-center gap-1 shadow-2xs"
            >
              <XCircle className="w-4 h-4" />
              <span>Chưa nhớ</span>
            </button>

            <button
              type="button"
              onClick={handleNextCard}
              className="py-3 px-3 rounded-xl border border-[#E6E1D6] bg-white hover:bg-[#FAF8F5] text-[#18181B] text-xs font-bold transition cursor-pointer flex flex-col items-center gap-1 shadow-2xs"
            >
              <RotateCcw className="w-4 h-4 text-[#D97706]" />
              <span>Ôn tiếp</span>
            </button>

            <button
              type="button"
              onClick={() => handleMarkMastered(currentCard.id, true)}
              className="py-3 px-3 rounded-xl border border-[#A7F3D0] bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#059669] text-xs font-bold transition cursor-pointer flex flex-col items-center gap-1 shadow-2xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Đã thuộc (+15 XP)</span>
            </button>
          </div>

          {/* Previous / Next Arrow Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handlePrevCard}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E6E1D6] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#57534E] transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Thẻ trước</span>
            </button>
            <div className="text-[11px] text-[#A8A29E]">
              Dùng phím mũi tên ← → để chuyển thẻ
            </div>
            <button
              type="button"
              onClick={handleNextCard}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E6E1D6] bg-white hover:bg-[#FAF8F5] text-xs font-semibold text-[#57534E] transition cursor-pointer"
            >
              <span>Thẻ tiếp theo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* QUIZ MODE */
        <div className="max-w-xl mx-auto bg-white border border-[#E6E1D6] rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#6E6A63] font-semibold">
            <span>
              Câu hỏi {currentIndex + 1} / {filteredCards.length}
            </span>
            <span className="font-mono-code text-[#5B3FD9]">
              {currentCard?.deck}
            </span>
          </div>

          <div className="text-center space-y-2 py-3 border-b border-[#E6E1D6]">
            <span className="text-xs uppercase font-bold tracking-wider text-[#6E6A63]">
              Chọn nghĩa tiếng Việt chính xác của từ:
            </span>
            <h2 className="text-3xl font-bold font-serif text-[#18181B]">
              {currentCard?.word}
            </h2>
            <div className="font-mono-code text-xs text-[#5B3FD9] flex items-center justify-center gap-1.5">
              <span>{currentCard?.ipa}</span>
              <button
                type="button"
                onClick={() => currentCard && speakWord(currentCard.word)}
                className="hover:opacity-80 transition cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 4 Quiz Options */}
          <div className="space-y-2.5">
            {quizOptions.map((opt, idx) => {
              const isCorrect = opt === currentCard?.meaningVi;
              const isSelected = quizSelectedOption === idx;

              let style = 'bg-[#FAF8F5] border-[#E6E1D6] text-[#18181B] hover:border-[#18181B]';
              if (quizAnswerChecked) {
                if (isCorrect) {
                  style = 'bg-[#ECFDF5] border-[#059669] text-[#059669] font-bold';
                } else if (isSelected && !isCorrect) {
                  style = 'bg-[#FEF2F2] border-[#DC2626] text-[#DC2626] line-through';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={quizAnswerChecked}
                  onClick={() => {
                    setQuizSelectedOption(idx);
                    setQuizAnswerChecked(true);
                    if (isCorrect) {
                      onAwardXP(10);
                    }
                    onRecordDailyStudy?.('flashcards');
                  }}
                  className={`w-full p-4 rounded-xl border text-sm text-left transition flex items-center justify-between cursor-pointer ${style}`}
                >
                  <span>
                    <strong className="font-mono-code mr-2">
                      {String.fromCharCode(65 + idx)}.
                    </strong>
                    {opt}
                  </span>
                  {quizAnswerChecked && isCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  )}
                </button>
              );
            })}
          </div>

          {quizAnswerChecked && (
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#E6E1D6] space-y-2">
              <div className="text-xs text-[#059669] font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Nghĩa chuẩn: {currentCard?.meaningVi}</span>
              </div>
              <p className="text-xs text-[#57534E] italic font-serif">
                "{currentCard?.exampleSentence}"
              </p>
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextCard}
                  className="px-4 py-2 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-bold transition cursor-pointer"
                >
                  Câu tiếp theo →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: Thêm thẻ từ vựng mới của bạn */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E6E1D6] rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6E1D6] pb-3">
              <h3 className="text-lg font-bold text-[#18181B] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#5B3FD9]" />
                Thêm thẻ từ vựng cá nhân
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-[#6E6A63] hover:text-[#18181B] text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCustomCard} className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6A63] mb-1">
                  Từ hoặc Cụm từ tiếng Anh *
                </label>
                <input
                  type="text"
                  required
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="Ví dụ: substantiate, look forward to..."
                  className="w-full px-3 py-2.5 rounded-lg border border-[#E6E1D6] text-sm font-semibold focus:outline-none focus:border-[#18181B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6A63] mb-1">
                    Phiên âm IPA
                  </label>
                  <input
                    type="text"
                    value={newIpa}
                    onChange={(e) => setNewIpa(e.target.value)}
                    placeholder="/səbˈstænʃieɪt/"
                    className="w-full px-3 py-2.5 rounded-lg border border-[#E6E1D6] text-sm focus:outline-none focus:border-[#18181B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6A63] mb-1">
                    Từ loại
                  </label>
                  <select
                    value={newPos}
                    onChange={(e) => setNewPos(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border border-[#E6E1D6] text-sm focus:outline-none focus:border-[#18181B]"
                  >
                    <option value="verb">Verb (Động từ)</option>
                    <option value="noun">Noun (Danh từ)</option>
                    <option value="adjective">Adjective (Tính từ)</option>
                    <option value="phrase">Phrase / Collocation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6A63] mb-1">
                  Nghĩa tiếng Việt *
                </label>
                <input
                  type="text"
                  required
                  value={newMeaningVi}
                  onChange={(e) => setNewMeaningVi(e.target.value)}
                  placeholder="Chứng minh, xác minh tính xác thực"
                  className="w-full px-3 py-2.5 rounded-lg border border-[#E6E1D6] text-sm font-semibold focus:outline-none focus:border-[#18181B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6A63] mb-1">
                  Collocations (ngăn cách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={newCollocations}
                  onChange={(e) => setNewCollocations(e.target.value)}
                  placeholder="substantiate a claim, substantiate allegations"
                  className="w-full px-3 py-2.5 rounded-lg border border-[#E6E1D6] text-sm focus:outline-none focus:border-[#18181B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#6E6A63] mb-1">
                  Câu ví dụ tiếng Anh
                </label>
                <textarea
                  rows={2}
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  placeholder="The researcher provided data to substantiate the hypothesis."
                  className="w-full px-3 py-2 rounded-lg border border-[#E6E1D6] text-sm focus:outline-none focus:border-[#18181B]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-lg border border-[#D6D1C7] text-xs font-bold text-[#57534E] hover:bg-[#FAF8F5] transition cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-white text-xs font-bold transition cursor-pointer"
                >
                  Lưu thẻ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
