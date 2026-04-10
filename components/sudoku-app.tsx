'use client';

import { useState, useCallback } from 'react';
import { HomeView } from './home-view';
import { GameView } from './game-view';
import { GalleryView } from './gallery-view';
import { useGameStorage, type SavedGame } from '@/hooks/use-game-storage';
import { getRandomLevel, type Level, type GridSize, type Difficulty } from '@/lib/game-data';
import type { GameState } from '@/lib/sudoku-engine';

type View = 'home' | 'game' | 'gallery';

export function SudokuApp() {
  const [view, setView] = useState<View>('home');
  const [currentLevel, setCurrentLevel] = useState<Level | null>(null);
  const [resumeData, setResumeData] = useState<{
    gameState: GameState;
    elapsedTime: number;
  } | null>(null);
  const {
    completedLevels,
    savedGame,
    saveCompletedLevel,
    saveCurrentGame,
    clearSavedGame,
    isLoaded,
  } = useGameStorage();

  const handleStartGame = useCallback(
    (gridSize: GridSize, difficulty: Difficulty) => {
      clearSavedGame();
      const level = getRandomLevel(gridSize, difficulty);
      setCurrentLevel(level);
      setResumeData(null);
      setView('game');
    },
    [clearSavedGame],
  );

  const handleResumeGame = useCallback((saved: SavedGame) => {
    setCurrentLevel(saved.level);
    setResumeData({
      gameState: saved.gameState,
      elapsedTime: saved.elapsedTime,
    });
    setView('game');
  }, []);

  const handleGameComplete = useCallback(
    (timeElapsed: number, mistakes: number) => {
      if (currentLevel) {
        saveCompletedLevel(currentLevel.id, timeElapsed, mistakes);
        clearSavedGame();
      }
    },
    [currentLevel, saveCompletedLevel, clearSavedGame],
  );

  const handleSaveAndExit = useCallback(
    (gameState: GameState, elapsedTime: number) => {
      if (currentLevel && !gameState.isComplete) {
        saveCurrentGame(currentLevel, gameState, elapsedTime);
      }
      setView('home');
      setCurrentLevel(null);
      setResumeData(null);
    },
    [currentLevel, saveCurrentGame],
  );

  const handleBackToHome = useCallback(() => {
    setView('home');
    setCurrentLevel(null);
    setResumeData(null);
  }, []);

  const handleOpenGallery = useCallback(() => {
    setView('gallery');
  }, []);

  // Show loading state while localStorage is being read
  if (!isLoaded) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground animate-pulse">Loading...</div>
      </div>
    );
  }

  if (view === 'game' && currentLevel) {
    return (
      <GameView
        level={currentLevel}
        resumeData={resumeData}
        onBack={handleSaveAndExit}
        onComplete={handleGameComplete}
      />
    );
  }

  if (view === 'gallery') {
    return <GalleryView completedLevels={completedLevels} onBack={handleBackToHome} />;
  }

  return (
    <HomeView
      onStartGame={handleStartGame}
      onOpenGallery={handleOpenGallery}
      onResumeGame={handleResumeGame}
      savedGame={savedGame}
      completedCount={completedLevels.length}
    />
  );
}
