import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface AudioPlayerProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  className?: string;
}

const AUDIO_URL = "https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3";

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ isPlaying, setIsPlaying, className = "" }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [audioError, setAudioError] = useState(false);

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(AUDIO_URL);
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = 0.4; // Comfortably gentle background level
      
      audio.addEventListener('error', () => {
        console.warn("Audio load error, fallback gracefully");
        setAudioError(true);
      });

      audioRef.current = audio;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Sync state with audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Browser blocked autoplay or error:", err);
          setIsPlaying(false);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying, setIsPlaying]);

  const toggleMusic = () => {
    setHasInteracted(true);
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      id="music-toggle-button"
      onClick={toggleMusic}
      title={isPlaying ? "Tắt nhạc nền" : "Bật nhạc nền lãng mạn"}
      className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer select-none active:scale-95 ${
        isPlaying
          ? "bg-[#E53E3E] text-white ring-2 ring-[#E53E3E]/20"
          : "bg-white/90 backdrop-blur text-[#2D3748] hover:bg-white ring-1 ring-gray-200"
      } ${className}`}
      aria-label={isPlaying ? "Tắt nhạc" : "Bật nhạc"}
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-4 h-4 animate-pulse" />
          <span className="text-xs font-medium tracking-wide">Nhạc đang phát</span>
          {/* Animated sound wave bars */}
          <span className="flex items-center gap-0.5 h-3 ml-0.5">
            <span className="w-0.5 h-2 bg-white rounded-full animate-bounce [animation-delay:0ms]"></span>
            <span className="w-0.5 h-3 bg-white rounded-full animate-bounce [animation-delay:150ms]"></span>
            <span className="w-0.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:300ms]"></span>
          </span>
        </>
      ) : (
        <>
          <Music className="w-4 h-4 text-[#E53E3E]" />
          <span className="text-xs font-medium tracking-wide">🎵 Bật nhạc</span>
        </>
      )}
    </button>
  );
};
