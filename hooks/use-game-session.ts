'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Level } from '@/lib/game-data';
import {
  clearCell,
  enterNumber,
  formatTime,
  getHintCandidates,
  getProgress,
  initializeGame,
  revealHintCell,
  selectCell,
  type GameState,
} from '@/lib/sudoku-engine';

export const MAX_HINTS = 3;

interface UseGameSessionOptions {
  level: Level;
  resumeData?: { gameState: GameState; elapsedTime: number } | null;
  onComplete: (timeElapsed: number, mistakes: number) => void;
}

export function useGameSession({ level, resumeData, onComplete }: UseGameSessionOptions) {
  const initialElapsed = resumeData?.elapsedTime ?? 0;
  const [gameState, setGameState] = useState<GameState>(
    () => resumeData?.gameState ?? initializeGame(level),
  );
  const [showCompleted, setShowCompleted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(initialElapsed);
  const [sessionStartedAt] = useState(() => Date.now());
  const [isPaused, setIsPaused] = useState(false);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [blockedInputCell, setBlockedInputCell] = useState<{ row: number; col: number } | null>(
    null,
  );
  const [hintedCell, setHintedCell] = useState<{ row: number; col: number } | null>(null);

  const blockedInputTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hintedCellTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accumulatedElapsedRef = useRef(initialElapsed);
  const runningSinceRef = useRef<number | null>(sessionStartedAt);

  const completedNumbers = useMemo(() => {
    const counts = new Map<number, number>();

    for (const row of gameState.cells) {
      for (const cell of row) {
        if (cell.isCorrect && cell.value !== null) {
          counts.set(cell.value, (counts.get(cell.value) ?? 0) + 1);
        }
      }
    }

    return new Set(
      Array.from({ length: level.gridSize }, (_, i) => i + 1).filter(
        (num) => (counts.get(num) ?? 0) >= level.gridSize,
      ),
    );
  }, [gameState.cells, level.gridSize]);

  const triggerBlockedInputFeedback = useCallback((row: number, col: number) => {
    if (blockedInputTimeoutRef.current) {
      clearTimeout(blockedInputTimeoutRef.current);
    }

    setBlockedInputCell(null);
    requestAnimationFrame(() => {
      setBlockedInputCell({ row, col });
      blockedInputTimeoutRef.current = setTimeout(() => {
        setBlockedInputCell(null);
        blockedInputTimeoutRef.current = null;
      }, 240);
    });
  }, []);

  useEffect(() => {
    if (gameState.isComplete || isPaused) return;

    const tick = () => {
      const runningSince = runningSinceRef.current ?? Date.now();
      setElapsedTime(Math.max(0, accumulatedElapsedRef.current + (Date.now() - runningSince)));
    };

    tick();
    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.isComplete, isPaused]);

  useEffect(() => {
    if (gameState.isComplete && !showCompleted) {
      setTimeout(() => {
        setShowCompleted(true);
        onComplete(elapsedTime, gameState.mistakes);
      }, 500);
    }
  }, [elapsedTime, gameState.isComplete, gameState.mistakes, onComplete, showCompleted]);

  useEffect(() => {
    return () => {
      if (blockedInputTimeoutRef.current) {
        clearTimeout(blockedInputTimeoutRef.current);
      }
      if (hintedCellTimeoutRef.current) {
        clearTimeout(hintedCellTimeoutRef.current);
      }
    };
  }, []);

  const selectCellAt = useCallback((row: number, col: number) => {
    setGameState((prev) => selectCell(prev, row, col));
  }, []);

  const enterNumberAt = useCallback((row: number, col: number, num: number) => {
    setGameState((prev) => enterNumber(prev, row, col, num));
  }, []);

  const clearCellAt = useCallback((row: number, col: number) => {
    setGameState((prev) => clearCell(prev, row, col));
  }, []);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (gameState.isComplete || isPaused) return;
      selectCellAt(row, col);
    },
    [gameState.isComplete, isPaused, selectCellAt],
  );

  const handleNumberClick = useCallback(
    (num: number) => {
      if (!gameState.selectedCell || gameState.isComplete || isPaused) return;
      const { row, col } = gameState.selectedCell;
      if (completedNumbers.has(num)) {
        triggerBlockedInputFeedback(row, col);
        return;
      }
      enterNumberAt(row, col, num);
    },
    [
      completedNumbers,
      enterNumberAt,
      gameState.isComplete,
      gameState.selectedCell,
      isPaused,
      triggerBlockedInputFeedback,
    ],
  );

  const handleClear = useCallback(() => {
    if (!gameState.selectedCell || gameState.isComplete || isPaused) return;
    const { row, col } = gameState.selectedCell;
    clearCellAt(row, col);
  }, [clearCellAt, gameState.isComplete, gameState.selectedCell, isPaused]);

  const canUseHint = !isPaused && !gameState.isComplete && hintsUsed < MAX_HINTS;

  const handleHint = useCallback(() => {
    if (!canUseHint) return;

    const hintCandidates = getHintCandidates(gameState);
    if (hintCandidates.length === 0) return;
    const hintedPosition = hintCandidates[Math.floor(Math.random() * hintCandidates.length)];

    setGameState((prev) => revealHintCell(prev, hintedPosition.row, hintedPosition.col));
    setHintsUsed((prev) => prev + 1);
    setHintedCell(hintedPosition);

    if (hintedCellTimeoutRef.current) {
      clearTimeout(hintedCellTimeoutRef.current);
    }

    hintedCellTimeoutRef.current = setTimeout(() => {
      setHintedCell(null);
      hintedCellTimeoutRef.current = null;
    }, 320);
  }, [canUseHint, gameState]);

  const resumeGame = useCallback(() => {
    setIsPauseModalOpen(false);
    setIsPaused((prev) => {
      if (!prev) return prev;
      return false;
    });
    if (runningSinceRef.current === null) {
      runningSinceRef.current = Date.now();
    }
    setElapsedTime(Math.max(0, accumulatedElapsedRef.current));
  }, []);

  const pauseGame = useCallback(() => {
    if (gameState.isComplete || isPaused) return;

    const pausedAt = Date.now();
    const runningSince = runningSinceRef.current;
    if (runningSince !== null) {
      accumulatedElapsedRef.current = Math.max(
        0,
        accumulatedElapsedRef.current + (pausedAt - runningSince),
      );
      runningSinceRef.current = null;
    }

    setElapsedTime(Math.max(0, accumulatedElapsedRef.current));
    setIsPaused(true);
    setIsPauseModalOpen(true);
  }, [gameState.isComplete, isPaused]);

  const handlePauseModalChange = useCallback(
    (open: boolean) => {
      if (open) {
        setIsPauseModalOpen(true);
        return;
      }
      resumeGame();
    },
    [resumeGame],
  );

  const progress = getProgress(gameState);
  const formattedDifficulty = level.difficulty.charAt(0).toUpperCase() + level.difficulty.slice(1);

  return {
    gameState,
    showCompleted,
    elapsedTime,
    isPaused,
    isPauseModalOpen,
    blockedInputCell,
    hintedCell,
    completedNumbers,
    canUseHint,
    progress,
    formattedDifficulty,
    hintsRemaining: MAX_HINTS - hintsUsed,
    pauseGame,
    resumeGame,
    handlePauseModalChange,
    handleCellClick,
    handleNumberClick,
    handleClear,
    handleHint,
    selectCellAt,
    enterNumberAt,
    clearCellAt,
    triggerBlockedInputFeedback,
    formatTime,
  };
}
