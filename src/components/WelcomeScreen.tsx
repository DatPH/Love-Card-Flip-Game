import React from 'react';
import { Heart, Sparkles, ArrowRight, Music, ShieldCheck } from 'lucide-react';
import { AudioPlayer } from './AudioPlayer';

interface WelcomeScreenProps {
  onStart: () => void;
  isPlayingMusic: boolean;
  setIsPlayingMusic: (playing: boolean) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStart,
  isPlayingMusic,
  setIsPlayingMusic,
}) => {
  return (
    <div className="relative min-h-[90vh] flex flex-col justify-between items-center px-4 py-8 max-w-lg mx-auto text-center">
      {/* Top Bar with Music Toggle */}
      <header className="w-full flex justify-end items-center mb-6">
        <AudioPlayer isPlaying={isPlayingMusic} setIsPlaying={setIsPlayingMusic} />
      </header>

      {/* Main Hero Card */}
      <main className="flex-1 flex flex-col justify-center items-center w-full my-auto">
        {/* Subtle decorative heart aura */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-[#E53E3E]/10 rounded-full blur-2xl transform scale-150 animate-pulse"></div>
          <div className="relative w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center border border-rose-100/80">
            <Heart className="w-9 h-9 text-[#E53E3E] fill-[#E53E3E]/20" />
          </div>
        </div>

        {/* Title */}
        <h1 className="font-serif text-5xl sm:text-6xl font-bold tracking-tight text-[#2D3748] mb-4">
          Chạm
        </h1>

        <div className="w-12 h-0.5 bg-[#E53E3E]/40 mb-5 rounded-full"></div>

        {/* Subtitle / Description */}
        <p className="font-serif italic text-lg sm:text-xl text-[#2D3748]/85 max-w-sm mb-2 leading-relaxed">
          &ldquo;Không gian để lắng nghe và thấu hiểu&rdquo;
        </p>

        <p className="text-xs sm:text-sm text-gray-500 max-w-xs mb-10 leading-relaxed font-sans">
          Một bộ bài gồm 150 câu hỏi dành riêng cho hai người. Chậm rãi lật mở từng trang cảm xúc và gắn kết sâu sắc hơn.
        </p>

        {/* Start Button */}
        <div className="w-full max-w-xs space-y-3">
          <button
            id="start-game-button"
            onClick={onStart}
            className="w-full group py-3.5 px-6 rounded-full bg-[#E53E3E] hover:bg-[#c53030] text-white font-medium text-base shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Bắt đầu</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          {!isPlayingMusic && (
            <button
              onClick={() => setIsPlayingMusic(true)}
              className="text-xs text-[#E53E3E] hover:text-[#c53030] flex items-center justify-center gap-1.5 mx-auto py-1 font-medium transition-colors cursor-pointer"
            >
              <Music className="w-3.5 h-3.5" />
              <span>Nhấn để phát giai điệu lãng mạn</span>
            </button>
          )}
        </div>
      </main>

      {/* Footer subtle details */}
      <footer className="w-full pt-6 text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-[#E53E3E]/60" />
        <span>Tận hưởng trọn vẹn từng khoảnh khắc bên nhau</span>
      </footer>
    </div>
  );
};
