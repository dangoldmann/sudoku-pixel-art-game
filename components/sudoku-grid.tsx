'use client';

import { SudokuCell } from './sudoku-cell';
import type { CellState } from '@/lib/sudoku-engine';
import type { GridSize } from '@/lib/game-data';
import { cn } from '@/lib/utils';

interface SudokuGridProps {
  cells: CellState[][];
  selectedCell: { row: number; col: number } | null;
  blockedInputCell: { row: number; col: number } | null;
  gridSize: GridSize;
  showCompleted: boolean;
  onCellClick: (row: number, col: number) => void;
}

export function SudokuGrid({
  cells,
  selectedCell,
  blockedInputCell,
  gridSize,
  showCompleted,
  onCellClick,
}: SudokuGridProps) {
  const boxSize = gridSize === 9 ? 3 : 4;
  const boxCount = gridSize / boxSize;

  const isHighlighted = (row: number, col: number): boolean => {
    if (!selectedCell) return false;
    const sameRow = row === selectedCell.row;
    const sameCol = col === selectedCell.col;
    const sameBox =
      Math.floor(row / boxSize) === Math.floor(selectedCell.row / boxSize) &&
      Math.floor(col / boxSize) === Math.floor(selectedCell.col / boxSize);
    return sameRow || sameCol || sameBox;
  };

  // Group cells into boxes for better visual separation
  const boxes: CellState[][] = [];
  for (let boxRow = 0; boxRow < boxCount; boxRow++) {
    for (let boxCol = 0; boxCol < boxCount; boxCol++) {
      const box: CellState[] = [];
      for (let r = 0; r < boxSize; r++) {
        for (let c = 0; c < boxSize; c++) {
          const globalRow = boxRow * boxSize + r;
          const globalCol = boxCol * boxSize + c;
          box.push(cells[globalRow][globalCol]);
        }
      }
      boxes.push(box);
    }
  }

  return (
    <div
      className={cn(
        'grid overflow-hidden rounded-2xl bg-[#bcc7dc] p-1.5 shadow-[0_18px_40px_-26px_rgba(15,23,42,0.85)] transition-all duration-500 sm:p-2',
        showCompleted ? 'gap-0 p-0 shadow-2xl' : 'gap-1.5 sm:gap-2',
      )}
      style={{
        gridTemplateColumns: `repeat(${boxCount}, 1fr)`,
        maxWidth: gridSize === 9 ? '400px' : '520px',
      }}
    >
      {boxes.map((boxCells, boxIndex) => {
        const boxRow = Math.floor(boxIndex / boxCount);
        const boxCol = boxIndex % boxCount;

        return (
          <div
            key={boxIndex}
            className={cn(
              'grid gap-px overflow-hidden rounded-lg bg-[#8d9bb7] p-px transition-all duration-500',
              showCompleted && 'gap-0 rounded-none p-0',
            )}
            style={{
              gridTemplateColumns: `repeat(${boxSize}, 1fr)`,
            }}
          >
            {boxCells.map((cell, cellIndex) => {
              const localRow = Math.floor(cellIndex / boxSize);
              const localCol = cellIndex % boxSize;
              const globalRow = boxRow * boxSize + localRow;
              const globalCol = boxCol * boxSize + localCol;

              return (
                <SudokuCell
                  key={`${globalRow}-${globalCol}`}
                  cell={cell}
                  isSelected={selectedCell?.row === globalRow && selectedCell?.col === globalCol}
                  isBlockedInput={
                    blockedInputCell?.row === globalRow && blockedInputCell?.col === globalCol
                  }
                  isHighlighted={isHighlighted(globalRow, globalCol)}
                  gridSize={gridSize}
                  showCompleted={showCompleted}
                  onClick={() => onCellClick(globalRow, globalCol)}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
