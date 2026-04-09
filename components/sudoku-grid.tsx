'use client';

import { SudokuCell } from './sudoku-cell';
import type { CellState } from '@/lib/sudoku-engine';
import type { GridSize } from '@/lib/game-data';
import { cn } from '@/lib/utils';

interface SudokuGridProps {
  cells: CellState[][];
  selectedCell: { row: number; col: number } | null;
  gridSize: GridSize;
  showCompleted: boolean;
  onCellClick: (row: number, col: number) => void;
}

export function SudokuGrid({
  cells,
  selectedCell,
  gridSize,
  showCompleted,
  onCellClick,
}: SudokuGridProps) {
  const isHighlighted = (row: number, col: number): boolean => {
    if (!selectedCell) return false;
    const boxSize = gridSize === 9 ? 3 : 4;
    const sameRow = row === selectedCell.row;
    const sameCol = col === selectedCell.col;
    const sameBox = 
      Math.floor(row / boxSize) === Math.floor(selectedCell.row / boxSize) &&
      Math.floor(col / boxSize) === Math.floor(selectedCell.col / boxSize);
    return sameRow || sameCol || sameBox;
  };

  return (
    <div
      className={cn(
        'grid gap-px bg-border p-px rounded-lg overflow-hidden transition-all duration-500',
        showCompleted && 'gap-0 p-0 rounded-xl shadow-2xl'
      )}
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        maxWidth: gridSize === 9 ? '400px' : '500px',
      }}
    >
      {cells.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <SudokuCell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            isSelected={selectedCell?.row === rowIndex && selectedCell?.col === colIndex}
            isHighlighted={isHighlighted(rowIndex, colIndex)}
            gridSize={gridSize}
            showCompleted={showCompleted}
            onClick={() => onCellClick(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
}
