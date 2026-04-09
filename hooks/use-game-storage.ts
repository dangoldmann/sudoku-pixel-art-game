'use client';

import { useState, useEffect, useCallback } from 'react';
import type { GameState } from '@/lib/sudoku-engine';
import type { Level } from '@/lib/game-data';

export interface CompletedLevel {
  levelId: string;
  completedAt: number;
  timeElapsed: number;
  mistakes: number;
}

export interface SavedGame {
  level: Level;
  gameState: GameState;
  elapsedTime: number;
  savedAt: number;
}

const STORAGE_KEY = 'pixel-sudoku-completed';
const SAVED_GAME_KEY = 'pixel-sudoku-saved-game';

export function useGameStorage() {
  const [completedLevels, setCompletedLevels] = useState<CompletedLevel[]>([]);
  const [savedGame, setSavedGame] = useState<SavedGame | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCompletedLevels(JSON.parse(stored));
      }
      const savedGameData = localStorage.getItem(SAVED_GAME_KEY);
      if (savedGameData) {
        setSavedGame(JSON.parse(savedGameData));
      }
    } catch {
      console.error('Failed to load data');
    }
    setIsLoaded(true);
  }, []);

  // Save completed level
  const saveCompletedLevel = useCallback(
    (levelId: string, timeElapsed: number, mistakes: number) => {
      setCompletedLevels((prev) => {
        // Check if already completed
        const existing = prev.find((l) => l.levelId === levelId);
        if (existing) {
          // Update if better time
          if (timeElapsed < existing.timeElapsed) {
            const updated = prev.map((l) =>
              l.levelId === levelId ? { ...l, timeElapsed, mistakes, completedAt: Date.now() } : l,
            );
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
          }
          return prev;
        }

        // Add new completion
        const newLevel: CompletedLevel = {
          levelId,
          completedAt: Date.now(),
          timeElapsed,
          mistakes,
        };
        const updated = [...prev, newLevel];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    [],
  );

  // Check if level is completed
  const isLevelCompleted = useCallback(
    (levelId: string): boolean => {
      return completedLevels.some((l) => l.levelId === levelId);
    },
    [completedLevels],
  );

  // Get completion data for a level
  const getCompletionData = useCallback(
    (levelId: string): CompletedLevel | undefined => {
      return completedLevels.find((l) => l.levelId === levelId);
    },
    [completedLevels],
  );

  // Clear saved game
  const clearSavedGame = useCallback(() => {
    localStorage.removeItem(SAVED_GAME_KEY);
    setSavedGame(null);
  }, []);

  // Save current game state
  const saveCurrentGame = useCallback(
    (level: Level, gameState: GameState, elapsedTime: number) => {
      // Don't save if game is complete
      if (gameState.isComplete) {
        clearSavedGame();
        return;
      }

      const saved: SavedGame = {
        level,
        gameState,
        elapsedTime,
        savedAt: Date.now(),
      };
      localStorage.setItem(SAVED_GAME_KEY, JSON.stringify(saved));
      setSavedGame(saved);
    },
    [clearSavedGame],
  );

  // Clear all data
  const clearAllData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SAVED_GAME_KEY);
    setCompletedLevels([]);
    setSavedGame(null);
  }, []);

  return {
    completedLevels,
    savedGame,
    isLoaded,
    saveCompletedLevel,
    isLevelCompleted,
    getCompletionData,
    saveCurrentGame,
    clearSavedGame,
    clearAllData,
  };
}
