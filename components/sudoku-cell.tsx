'use client';

import { memo, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import type { CellState } from '@/lib/sudoku-engine';
import { getContrastColor } from '@/lib/sudoku-engine';
import type { GridSize } from '@/lib/game-data';

interface SudokuCellProps {
  cell: CellState;
  isSelected: boolean;
  isBlockedInput: boolean;
  isHighlighted: boolean;
  gridSize: GridSize;
  showCompleted: boolean;
  onClick: () => void;
}

export const SudokuCell = memo(function SudokuCell({
  cell,
  isSelected,
  isBlockedInput,
  isHighlighted,
  gridSize,
  showCompleted,
  onClick,
}: SudokuCellProps) {
  const boxSize = gridSize === 9 ? 3 : 4;
  const isFirstRowInBox = cell.row % boxSize === 0;
  const isLastRowInBox = (cell.row + 1) % boxSize === 0;
  const isFirstColInBox = cell.col % boxSize === 0;
  const isLastColInBox = (cell.col + 1) % boxSize === 0;

  const isTopLeftCorner = isFirstRowInBox && isFirstColInBox;
  const isTopRightCorner = isFirstRowInBox && isLastColInBox;
  const isBottomLeftCorner = isLastRowInBox && isFirstColInBox;
  const isBottomRightCorner = isLastRowInBox && isLastColInBox;

  const isIncorrectInput = cell.isIncorrect && !showCompleted;

  const showColor = cell.isCorrect || showCompleted;
  const bgColor = showColor ? cell.color : '#374151';
  const textColor = showColor ? getContrastColor(cell.color) : '#e5e7eb';
  const selectionRingColor = getContrastColor(bgColor);
  const feedbackRingColor = isIncorrectInput
    ? 'oklch(0.637 0.237 25.331 / 0.95)'
    : selectionRingColor;
  const feedbackTextColor = isIncorrectInput ? '#fecaca' : textColor;

  const displayValue = cell.value ? cell.value.toString() : '';

  const cellStyle: CSSProperties & { '--tw-ring-color'?: string } = {
    backgroundColor: bgColor,
    color: showCompleted ? 'transparent' : feedbackTextColor,
    textShadow: isIncorrectInput
      ? '0 0 8px oklch(0.637 0.237 25.331 / 0.5)'
      : showColor && !showCompleted
        ? `0 1px 2px ${getContrastColor(textColor)}40`
        : 'none',
    aspectRatio: '1',
    '--tw-ring-color': feedbackRingColor,
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'relative flex items-center justify-center transition-all duration-300 ease-out',
        'font-semibold select-none focus:outline-none',
        gridSize === 9 ? 'text-lg sm:text-xl' : 'text-xs sm:text-sm',
        isSelected && !showCompleted && 'z-10 ring-2 ring-inset',
        isHighlighted && !isSelected && !showCompleted && 'bg-primary/10',
        isIncorrectInput && 'animate-incorrect-input ring-2 ring-inset',
        isBlockedInput && !showCompleted && 'animate-blocked-input',
        isTopLeftCorner && !showCompleted && 'rounded-tl-md',
        isTopRightCorner && !showCompleted && 'rounded-tr-md',
        isBottomLeftCorner && !showCompleted && 'rounded-bl-md',
        isBottomRightCorner && !showCompleted && 'rounded-br-md',
        showCompleted && 'border-0',
      )}
      style={cellStyle}
      disabled={cell.isRevealed || showCompleted}
    >
      {!showCompleted && displayValue}
    </button>
  );
});
