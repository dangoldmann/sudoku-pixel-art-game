'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { GridSize } from '@/lib/game-data';

const MULTI_DIGIT_INPUT_WINDOW_MS = 200;

interface UseGameKeyboardControlsOptions {
  gridSize: GridSize;
  isPaused: boolean;
  isComplete: boolean;
  selectedCell: { row: number; col: number } | null;
  completedNumbers: Set<number>;
  onSelectCell: (row: number, col: number) => void;
  onEnterNumber: (row: number, col: number, num: number) => void;
  onClearCell: (row: number, col: number) => void;
  onBlockedInput: (row: number, col: number) => void;
}

export function useGameKeyboardControls({
  gridSize,
  isPaused,
  isComplete,
  selectedCell,
  completedNumbers,
  onSelectCell,
  onEnterNumber,
  onClearCell,
  onBlockedInput,
}: UseGameKeyboardControlsOptions) {
  const pendingOneTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingOneTimestampRef = useRef<number | null>(null);

  const clearPendingOneInput = useCallback(() => {
    if (pendingOneTimeoutRef.current) {
      clearTimeout(pendingOneTimeoutRef.current);
      pendingOneTimeoutRef.current = null;
    }
    pendingOneTimestampRef.current = null;
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isComplete || isPaused) return;

      if (selectedCell && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        clearPendingOneInput();
        let newRow = selectedCell.row;
        let newCol = selectedCell.col;

        switch (e.key) {
          case 'ArrowUp':
            newRow = Math.max(0, newRow - 1);
            break;
          case 'ArrowDown':
            newRow = Math.min(gridSize - 1, newRow + 1);
            break;
          case 'ArrowLeft':
            newCol = Math.max(0, newCol - 1);
            break;
          case 'ArrowRight':
            newCol = Math.min(gridSize - 1, newCol + 1);
            break;
        }

        onSelectCell(newRow, newCol);
        return;
      }

      if (!selectedCell) return;

      const commitNumber = (num: number) => {
        if (completedNumbers.has(num)) {
          onBlockedInput(selectedCell.row, selectedCell.col);
          return;
        }
        onEnterNumber(selectedCell.row, selectedCell.col, num);
      };

      const commitPendingOne = () => {
        if (pendingOneTimestampRef.current === null) return;
        clearPendingOneInput();
        commitNumber(1);
      };

      const startPendingOne = () => {
        clearPendingOneInput();
        pendingOneTimestampRef.current = Date.now();
        pendingOneTimeoutRef.current = setTimeout(() => {
          if (pendingOneTimestampRef.current !== null) {
            commitPendingOne();
          }
        }, MULTI_DIGIT_INPUT_WINDOW_MS);
      };

      if (e.key === 'Delete' || e.key === 'Backspace') {
        clearPendingOneInput();
        onClearCell(selectedCell.row, selectedCell.col);
        return;
      }

      if (gridSize === 16 && /^\d$/.test(e.key)) {
        const keyDigit = Number(e.key);
        const hasPendingOne = pendingOneTimestampRef.current !== null;
        const pendingIsFresh =
          hasPendingOne &&
          Date.now() - pendingOneTimestampRef.current <= MULTI_DIGIT_INPUT_WINDOW_MS;

        if (pendingIsFresh) {
          const combined = Number(`1${e.key}`);
          if (combined >= 10 && combined <= 16) {
            clearPendingOneInput();
            commitNumber(combined);
            return;
          }

          commitPendingOne();

          if (keyDigit >= 2 && keyDigit <= 9) {
            commitNumber(keyDigit);
          } else if (keyDigit === 1) {
            startPendingOne();
          }
          return;
        }

        if (hasPendingOne) {
          clearPendingOneInput();
        }

        if (keyDigit === 1) {
          startPendingOne();
          return;
        }

        if (keyDigit >= 2 && keyDigit <= 9) {
          commitNumber(keyDigit);
          return;
        }

        return;
      }

      const num = Number.parseInt(e.key, 10);
      if (!Number.isNaN(num) && num >= 1 && num <= gridSize) {
        clearPendingOneInput();
        commitNumber(num);
        return;
      }

      if (gridSize === 16) {
        clearPendingOneInput();
        const letterCode = e.key.toUpperCase().charCodeAt(0);
        if (letterCode >= 65 && letterCode <= 71) {
          const num = letterCode - 55;
          commitNumber(num);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    clearPendingOneInput,
    completedNumbers,
    gridSize,
    isComplete,
    isPaused,
    onBlockedInput,
    onClearCell,
    onEnterNumber,
    onSelectCell,
    selectedCell,
  ]);

  useEffect(() => {
    clearPendingOneInput();
  }, [selectedCell, clearPendingOneInput]);

  useEffect(() => {
    return () => {
      clearPendingOneInput();
    };
  }, [clearPendingOneInput]);

  return {
    clearPendingOneInput,
  };
}
