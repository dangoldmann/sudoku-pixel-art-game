'use client';

import { memo } from 'react';
import { cn } from '@/lib/utils';
import type { CellState } from '@/lib/sudoku-engine';
import { getContrastColor } from '@/lib/sudoku-engine';
import type { GridSize } from '@/lib/game-data';

interface SudokuCellProps {
  cell: CellState;
  isSelected: boolean;
  isHighlighted: boolean;
  gridSize: GridSize;
  showCompleted: boolean;
  onClick: () => void;
}

export const SudokuCell = memo(function SudokuCell({
  cell,
  isSelected,
  isHighlighted,
  gridSize,
  showCompleted,
  onClick,
}: SudokuCellProps) {
  const boxSize = gridSize === 9 ? 3 : 4;
  const isRightBorder = (cell.col + 1) % boxSize === 0 && cell.col < gridSize - 1;
  const isBottomBorder = (cell.row + 1) % boxSize === 0 && cell.row < gridSize - 1;

  const showColor = cell.isCorrect || showCompleted;
  const bgColor = showColor ? cell.color : '#374151';
  const textColor = showColor ? getContrastColor(cell.color) : '#e5e7eb';

  // For 16x16, use hex digits A-G for 10-16
  const displayValue = cell.value
    ? cell.value > 9
      ? String.fromCharCode(55 + cell.value)
      : cell.value.toString()
    : '';

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex items-center justify-center transition-all duration-300 ease-out',
        'font-semibold select-none focus:outline-none',
        gridSize === 9 ? 'text-lg sm:text-xl' : 'text-xs sm:text-sm',
        isSelected && !showCompleted && 'ring-2 ring-primary ring-inset z-10',
        isHighlighted && !isSelected && !showCompleted && 'bg-primary/10',
        cell.isIncorrect && 'animate-shake',
        isRightBorder && !showCompleted && 'border-r-2 border-r-primary/30',
        isBottomBorder && !showCompleted && 'border-b-2 border-b-primary/30',
        showCompleted && 'border-0',
      )}
      style={{
        backgroundColor: bgColor,
        color: showCompleted ? 'transparent' : textColor,
        textShadow:
          showColor && !showCompleted ? `0 1px 2px ${getContrastColor(textColor)}40` : 'none',
        aspectRatio: '1',
      }}
      disabled={cell.isRevealed || showCompleted}
    >
      {!showCompleted && displayValue}
    </button>
  );
});
