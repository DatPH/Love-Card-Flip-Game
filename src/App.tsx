import React, { useState } from 'react';
import { GameScreen, LevelKey } from './types';
import { WelcomeScreen } from './components/WelcomeScreen';
import { LevelSelectScreen } from './components/LevelSelectScreen';
import { CardGame } from './components/CardGame';

/**
 * Main Application Component: "Chạm" (Touch) - Couple Card Game
 * Clean, romantic, mobile-first design with 3D card flip & audio playback.
 */
export default function App() {
  // Navigation & Game State
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('welcome');
  const [selectedLevel, setSelectedLevel] = useState<LevelKey>('level_1');
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);

  // Navigate to Level Selection Screen
  const handleStartGame = () => {
    setCurrentScreen('level_select');
  };

  // Select a level and start playing
  const handleSelectLevel = (level: LevelKey) => {
    setSelectedLevel(level);
    setCurrentScreen('gameplay');
  };

  // Return to Level Selection from Gameplay
  const handleBackToLevels = () => {
    setCurrentScreen('level_select');
  };

  // Return to Welcome screen
  const handleBackToWelcome = () => {
    setCurrentScreen('welcome');
  };

  return (
    <div className="min-h-screen bg-[#FFF5F5] text-[#2D3748] flex flex-col justify-center relative overflow-hidden font-sans">
      {/* Subtle ambient light gradient background for romance & intimacy */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle at 50% 20%, #ffe4e6 0%, transparent 60%), radial-gradient(circle at 80% 80%, #fed7aa 0%, transparent 50%)'
        }}
      />

      <div className="relative z-10 w-full max-w-lg mx-auto min-h-screen flex flex-col justify-center">
        {currentScreen === 'welcome' && (
          <WelcomeScreen
            onStart={handleStartGame}
            isPlayingMusic={isPlayingMusic}
            setIsPlayingMusic={setIsPlayingMusic}
          />
        )}

        {currentScreen === 'level_select' && (
          <LevelSelectScreen
            onSelectLevel={handleSelectLevel}
            onBack={handleBackToWelcome}
            isPlayingMusic={isPlayingMusic}
            setIsPlayingMusic={setIsPlayingMusic}
          />
        )}

        {currentScreen === 'gameplay' && (
          <CardGame
            level={selectedLevel}
            onBackToLevels={handleBackToLevels}
            isPlayingMusic={isPlayingMusic}
            setIsPlayingMusic={setIsPlayingMusic}
          />
        )}
      </div>
    </div>
  );
}
