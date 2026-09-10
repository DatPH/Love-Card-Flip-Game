import React from 'react';
import { ArrowLeft, Sparkles, Compass, Flame, HeartHandshake, ChevronRight } from 'lucide-react';
import { LevelKey } from '../types';
import { cardData } from '../data/cardData';
import { AudioPlayer } from './AudioPlayer';

interface LevelSelectScreenProps {
  onSelectLevel: (level: LevelKey) => void;
  onBack: () => void;
  isPlayingMusic: boolean;
  setIsPlayingMusic: (playing: boolean) => void;
}

export const LevelSelectScreen: React.FC<LevelSelectScreenProps> = ({
  onSelectLevel,
  onBack,
  isPlayingMusic,
  setIsPlayingMusic,
}) => {
  const levels: { key: LevelKey; badge: string; icon: React.ReactNode; color: string; bgTone: string }[] = [
    {
      key: 'level_1',
      badge: 'Cấp độ 1',
      icon: <Sparkles className="w-5 h-5 text-amber-600" />,
      color: 'border-amber-100 hover:border-amber-300',
      bgTone: 'bg-amber-50/50',
    },
    {
      key: 'level_2',
      badge: 'Cấp độ 2',
      icon: <Compass className="w-5 h-5 text-rose-500" />,
      color: 'border-rose-100 hover:border-rose-300',
      bgTone: 'bg-rose-50/50',
    },
    {
      key: 'level_3',
      badge: 'Cấp độ 3',
      icon: <HeartHandshake className="w-5 h-5 text-[#E53E3E]" />,
      color: 'border-red-100 hover:border-[#E53E3E]/40',
      bgTone: 'bg-red-50/40',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between px-4 py-6 max-w-lg mx-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          id="back-to-welcome-button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-[#2D3748] px-3 py-1.5 rounded-full bg-white/80 hover:bg-white shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>

        <AudioPlayer isPlaying={isPlayingMusic} setIsPlaying={setIsPlayingMusic} />
      </div>

      {/* Screen Title */}
      <div className="text-center mb-6">
        <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#2D3748] mb-2">
          Chọn Cấp Độ
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 max-w-xs mx-auto">
          Chọn một không gian trò chuyện phù hợp với tâm trạng của hai bạn lúc này
        </p>
      </div>

      {/* Levels list */}
      <div className="space-y-4 my-auto">
        {levels.map(({ key, badge, icon, color, bgTone }) => {
          const item = cardData[key];
          return (
            <button
              key={key}
              id={`select-level-${key}`}
              onClick={() => onSelectLevel(key)}
              className={`w-full text-left p-5 rounded-2xl bg-white border ${color} shadow-xs hover:shadow-md transition-all duration-300 group cursor-pointer relative overflow-hidden transform hover:-translate-y-0.5 active:scale-[0.99]`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${bgTone}`}>
                    {icon}
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold tracking-wider uppercase text-gray-400">
                      {badge} • {item.questions.length} câu hỏi
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2D3748] group-hover:text-[#E53E3E] transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-[#E53E3E] flex items-center justify-center transition-all duration-300 shrink-0">
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </div>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed font-sans">
                {item.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Footer advice */}
      <div className="mt-8 text-center text-xs text-gray-400 font-sans">
        Không có câu trả lời đúng hay sai, chỉ có sự chân thành và lắng nghe.
      </div>
    </div>
  );
};
