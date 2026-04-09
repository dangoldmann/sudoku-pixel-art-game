'use client';

import { useState, useEffect, useCallback } from 'react';

export interface CompletedLevel {
  levelId: string;
  completedAt: number;
  timeElapsed: number;
  mistakes: number;
}

const STORAGE_KEY = 'pixel-sudoku-completed';

export function useGameStorage() {
  const [completedLevels, setCompletedLevels] = useState<CompletedLevel[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCompletedLevels(JSON.parse(stored));
      }
    } catch {
      console.error('Failed to load completed levels');
    }
    setIsLoaded(true);
  }, []);

  // Save completed level
  const saveCompletedLevel = useCallback((
    levelId: string,
    timeElapsed: number,
    mistakes: number
  ) => {
    setCompletedLevels(prev => {
      // Check if already completed
      const existing = prev.find(l => l.levelId === levelId);
      if (existing) {
        // Update if better time
        if (timeElapsed < existing.timeElapsed) {
          const updated = prev.map(l => 
            l.levelId === levelId 
              ? { ...l, timeElapsed, mistakes, completedAt: Date.now() }
              : l
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
  }, []);

  // Check if level is completed
  const isLevelCompleted = useCallback((levelId: string): boolean => {
    return completedLevels.some(l => l.levelId === levelId);
  }, [completedLevels]);

  // Get completion data for a level
  const getCompletionData = useCallback((levelId: string): CompletedLevel | undefined => {
    return completedLevels.find(l => l.levelId === levelId);
  }, [completedLevels]);

  // Clear all data
  const clearAllData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCompletedLevels([]);
  }, []);

  return {
    completedLevels,
    isLoaded,
    saveCompletedLevel,
    isLevelCompleted,
    getCompletionData,
    clearAllData,
  };
}
