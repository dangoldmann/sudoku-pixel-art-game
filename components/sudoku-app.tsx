'use client';

import { useState, useCallback } from 'react';
import { HomeView } from './home-view';
import { GameView } from './game-view';
import { GalleryView } from './gallery-view';
import { useGameStorage } from '@/hooks/use-game-storage';
import { getRandomLevel, type Level, type GridSize, type Difficulty } from '@/lib/game-data';

type View = 'home' | 'game' | 'gallery';

export function SudokuApp() {
  const [view, setView] = useState<View>('home');
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const { completedLevels, saveCompletedLevel, isLoaded } = useGameStorage();

  const handleStartGame = useCallback((gridSize: GridSize, difficulty: Difficulty) => {
    const level = getRandomLevel(gridSize, difficulty);
    setCurrentLevel(level);
    setView('game');
  }, []);

  const handleGameComplete = useCallback((timeElapsed: number, mistakes: number) => {
    if (currentLevel) {
      saveCompletedLevel(currentLevel.id, timeElapsed, mistakes);
    }
  }, [currentLevel, saveCompletedLevel]);

  const handleBackToHome = useCallback(() => {
    setView('home');
    setCurrentLevel(null);
  }, []);

  const handleOpenGallery = useCallback(() => {
    setView('gallery');
  }, []);

  // Show loading state while localStorage is being read
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (view === 'game' && currentLevel) {
    return (
      <GameView
        level={currentLevel}
        onBack={handleBackToHome}
        onComplete={handleGameComplete}
      />
    );
  }

  if (view === 'gallery') {
    return (
      <GalleryView
        completedLevels={completedLevels}
        onBack={handleBackToHome}
      />
    );
  }

  return (
    <HomeView
      onStartGame={handleStartGame}
      onOpenGallery={handleOpenGallery}
      completedCount={completedLevels.length}
    />
  );
}
