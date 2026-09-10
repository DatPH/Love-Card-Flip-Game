import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Shuffle, 
  Sparkles, 
  Heart, 
  Share2, 
  Layers, 
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { LevelKey } from '../types';
import { cardData, shuffleArray } from '../data/cardData';
import { AudioPlayer } from './AudioPlayer';

interface CardGameProps {
  level: LevelKey;
  onBackToLevels: () => void;
  isPlayingMusic: boolean;
  setIsPlayingMusic: (playing: boolean) => void;
}

export const CardGame: React.FC<CardGameProps> = ({
  level,
  onBackToLevels,
  isPlayingMusic,
  setIsPlayingMusic,
}) => {
  const currentLevelData = cardData[level];
  
  // Deck questions shuffled on mount or when level changes
  const [deck, setDeck] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  
  // Slide animation states: 'idle' | 'sliding-out' | 'sliding-in'
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [slidePhase, setSlidePhase] = useState<'idle' | 'exit' | 'enter'>('idle');

  // Completed deck state
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Initialize and shuffle questions when component loads or level changes
  useEffect(() => {
    const shuffled = shuffleArray(currentLevelData.questions);
    setDeck(shuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsCompleted(false);
    setSlidePhase('idle');
  }, [level, currentLevelData]);

  // Handle Flipping the card
  const handleCardClick = () => {
    if (isAnimating) return;
    setIsFlipped((prev) => !prev);
  };

  // Next Card transition with slide effect
  const handleNextCard = useCallback(() => {
    if (isAnimating || deck.length === 0) return;

    if (currentIndex >= deck.length - 1) {
      setIsCompleted(true);
      return;
    }

    setIsAnimating(true);
    setSlideDirection('next');
    setSlidePhase('exit');

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false); // Reset to face-down state for new card
      setSlidePhase('enter');

      setTimeout(() => {
        setSlidePhase('idle');
        setIsAnimating(false);
      }, 250);
    }, 250);
  }, [isAnimating, deck.length, currentIndex]);

  // Previous Card transition
  const handlePrevCard = useCallback(() => {
    if (isAnimating || currentIndex === 0) return;

    setIsAnimating(true);
    setSlideDirection('prev');
    setSlidePhase('exit');

    setTimeout(() => {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
      setSlidePhase('enter');

      setTimeout(() => {
        setSlidePhase('idle');
        setIsAnimating(false);
      }, 250);
    }, 250);
  }, [isAnimating, currentIndex]);

  // Reshuffle the deck
  const handleReshuffle = () => {
    const reshuffled = shuffleArray(currentLevelData.questions);
    setDeck(reshuffled);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsCompleted(false);
    setSlidePhase('idle');
  };

  // Keyboard navigation support (ArrowRight: Next, ArrowLeft: Prev, Space: Flip)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.key === 'ArrowRight') {
        handleNextCard();
      } else if (e.key === 'ArrowLeft') {
        handlePrevCard();
      } else if (e.code === 'Space') {
        e.preventDefault();
        handleCardClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNextCard, handlePrevCard, isFlipped, isAnimating]);

  const currentQuestion = deck[currentIndex] || '';
  const progressPercent = deck.length > 0 ? Math.round(((currentIndex + 1) / deck.length) * 100) : 0;

  // Determine slide class based on animation state
  const getSlideClasses = () => {
    if (slidePhase === 'exit') {
      return slideDirection === 'next'
        ? '-translate-x-16 opacity-0 scale-95 transition-all duration-250 ease-out'
        : 'translate-x-16 opacity-0 scale-95 transition-all duration-250 ease-out';
    }
    if (slidePhase === 'enter') {
      return slideDirection === 'next'
        ? 'translate-x-16 opacity-0 scale-95'
        : '-translate-x-16 opacity-0 scale-95';
    }
    return 'translate-x-0 opacity-100 scale-100 transition-all duration-250 ease-out';
  };

  return (
    <div className="min-h-screen flex flex-col justify-between px-4 py-5 max-w-lg mx-auto select-none">
      {/* Top Navigation Bar */}
      <header className="w-full">
        <div className="flex items-center justify-between mb-3">
          <button
            id="back-to-level-select-btn"
            onClick={onBackToLevels}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-[#2D3748] px-3 py-1.5 rounded-full bg-white/80 hover:bg-white shadow-xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Đổi cấp độ</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              id="reshuffle-deck-btn"
              onClick={handleReshuffle}
              title="Xáo trộn lại bài"
              className="p-2 rounded-full bg-white/80 hover:bg-white text-gray-600 hover:text-[#E53E3E] shadow-xs transition-colors cursor-pointer"
              aria-label="Xáo trộn bài"
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <AudioPlayer isPlaying={isPlayingMusic} setIsPlaying={setIsPlayingMusic} />
          </div>
        </div>

        {/* Level Indicator and Progress */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1 px-1">
          <div className="flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-[#E53E3E]"></span>
            <span className="text-[#2D3748] font-serif font-bold text-sm tracking-wide">
              {currentLevelData.title}
            </span>
          </div>
          <span className="font-sans font-medium text-gray-400">
            Lá {currentIndex + 1} / {deck.length}
          </span>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-full bg-rose-100/60 h-1 rounded-full overflow-hidden mb-4">
          <div
            className="bg-[#E53E3E] h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </header>

      {/* Center Game Card Area */}
      <main className="flex-1 flex flex-col justify-center items-center my-auto w-full py-3">
        {isCompleted ? (
          /* Completion Screen when all cards are viewed */
          <div className="w-full max-w-sm bg-white rounded-3xl p-8 text-center shadow-lg border border-rose-100 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-50 flex items-center justify-center text-[#E53E3E]">
              <Heart className="w-8 h-8 fill-[#E53E3E]" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#2D3748] mb-2">
              Đã Hoàn Thành Cấp Độ!
            </h3>
            <p className="text-sm text-gray-600 mb-6 font-sans leading-relaxed">
              Hai bạn đã cùng nhau đi qua trọn vẹn 50 câu hỏi của cấp độ &ldquo;{currentLevelData.title}&rdquo;. Cảm ơn vì đã chân thành lắng nghe và sẻ chia.
            </p>
            <div className="space-y-2.5">
              <button
                onClick={handleReshuffle}
                className="w-full py-3 px-4 rounded-full bg-[#E53E3E] text-white font-medium text-sm hover:bg-[#c53030] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Trộn bài và chơi lại</span>
              </button>
              <button
                onClick={onBackToLevels}
                className="w-full py-3 px-4 rounded-full bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Chọn cấp độ khác
              </button>
            </div>
          </div>
        ) : (
          /* 3D Flip Card Container */
          <div className="w-full flex flex-col items-center">
            {/* The 3D Perspective Card Box */}
            <div
              className={`perspective-1000 w-full max-w-[340px] sm:max-w-[360px] h-[460px] sm:h-[490px] cursor-pointer ${getSlideClasses()}`}
              onClick={handleCardClick}
              title="Chạm vào thẻ bài để lật"
            >
              <div
                className={`relative w-full h-full duration-600 transform-style-preserve-3d transition-transform ease-out ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
                style={{
                  transitionDuration: '600ms',
                  transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
              >
                {/* 1. Face Down (Mặt úp) */}
                <div
                  className="absolute inset-0 w-full h-full rounded-3xl bg-white border border-rose-100/90 shadow-xl flex flex-col justify-between p-7 backface-hidden card-pattern-bg overflow-hidden transition-shadow hover:shadow-2xl"
                >
                  {/* Outer subtle decorative border */}
                  <div className="absolute inset-2.5 rounded-2xl border border-rose-200/50 pointer-events-none"></div>

                  {/* Card Back Header */}
                  <div className="flex justify-between items-center z-10">
                    <span className="text-[10px] tracking-widest uppercase font-semibold text-rose-400/80">
                      CHẠM • COUPLE CARD
                    </span>
                    <Sparkles className="w-3.5 h-3.5 text-[#E53E3E]/60" />
                  </div>

                  {/* Central emblem */}
                  <div className="flex-1 flex flex-col items-center justify-center text-center z-10">
                    <div className="relative mb-5">
                      <div className="w-20 h-20 rounded-full bg-rose-50/80 border border-rose-100 flex items-center justify-center shadow-xs">
                        <Heart className="w-9 h-9 text-[#E53E3E] fill-[#E53E3E]/15" />
                      </div>
                      <div className="absolute -top-1 -right-1">
                        <span className="flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E53E3E] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E53E3E]"></span>
                        </span>
                      </div>
                    </div>

                    <h3 className="font-serif text-3xl font-bold tracking-wider text-[#2D3748] mb-1">
                      Chạm
                    </h3>
                    <p className="text-[12px] font-sans text-gray-400 tracking-wide">
                      {currentLevelData.title}
                    </p>
                  </div>

                  {/* Tap prompt hint at bottom */}
                  <div className="flex items-center justify-center gap-1.5 py-2 px-4 rounded-full bg-rose-50/70 border border-rose-100/60 text-xs text-[#E53E3E] font-medium z-10 mx-auto animate-pulse">
                    <span>✨ Chạm để lật bài</span>
                  </div>
                </div>

                {/* 2. Face Up (Mặt ngửa - hiển thị câu hỏi) */}
                <div
                  className="absolute inset-0 w-full h-full rounded-3xl bg-white border border-rose-100 shadow-xl flex flex-col justify-between p-7 backface-hidden rotate-y-180 overflow-hidden"
                >
                  {/* Subtle inner decorative border */}
                  <div className="absolute inset-2.5 rounded-2xl border border-rose-100/60 pointer-events-none"></div>

                  {/* Question Card Header */}
                  <div className="flex justify-between items-center z-10">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-rose-50 text-[#E53E3E] border border-rose-100/80">
                      {currentLevelData.title} #{currentIndex + 1}
                    </span>
                    <Heart className="w-4 h-4 text-rose-300" />
                  </div>

                  {/* Main Question Text */}
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-2 py-4 z-10">
                    <div className="font-serif text-3xl text-rose-300/40 mb-2 leading-none select-none">
                      &ldquo;
                    </div>
                    <p className="font-serif text-xl sm:text-2xl leading-relaxed text-[#2D3748] font-normal tracking-tight max-w-xs">
                      {currentQuestion}
                    </p>
                    <div className="font-serif text-3xl text-rose-300/40 mt-2 leading-none select-none">
                      &rdquo;
                    </div>
                  </div>

                  {/* Question Card Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-rose-50 text-xs text-gray-400 z-10">
                    <span className="text-[11px] italic font-serif">Lắng nghe với tất cả yêu thương</span>
                    <span className="text-[11px] hover:text-[#E53E3E] transition-colors">
                      Chạm để úp
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Hint for Flipping */}
            <p className="mt-3 text-xs text-gray-400 text-center font-sans">
              {isFlipped ? "Nhấn vào bài để úp lại • Nhấn 'Lá tiếp theo' để qua câu mới" : "Nhấn vào bài để mở câu hỏi"}
            </p>
          </div>
        )}
      </main>

      {/* Bottom Controls Bar */}
      <footer className="w-full pt-4 pb-2">
        <div className="flex items-center justify-center gap-3 max-w-xs mx-auto">
          {/* Previous Button */}
          <button
            id="prev-card-button"
            onClick={handlePrevCard}
            disabled={currentIndex === 0 || isAnimating}
            className={`px-4 py-3 rounded-full border border-gray-200 bg-white font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-xs ${
              currentIndex === 0 || isAnimating
                ? "opacity-40 cursor-not-allowed text-gray-400"
                : "text-gray-700 hover:bg-gray-50 hover:text-black cursor-pointer active:scale-95"
            }`}
            title="Lá trước"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Lá trước</span>
          </button>

          {/* Flip Card / Primary Next Button */}
          <button
            id="next-card-button"
            onClick={handleNextCard}
            disabled={isAnimating}
            className="flex-1 py-3 px-6 rounded-full bg-[#E53E3E] hover:bg-[#c53030] text-white font-medium text-sm shadow-md hover:shadow-lg transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{currentIndex >= deck.length - 1 ? "Hoàn thành" : "Lá tiếp theo"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </footer>
    </div>
  );
};
