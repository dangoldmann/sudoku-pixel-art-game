import { useMemo } from 'react';
import type { Difficulty, GridSize } from '@/lib/game-data';
import { cn } from '@/lib/utils';
import { previewStyles } from './constants';
import { getRevealedCellIndices } from './preview-utils';

interface SudokuBoardPreviewProps {
  gridSize: GridSize;
  difficulty: Difficulty;
  revealPercentage: number;
}

export function SudokuBoardPreview({
  gridSize,
  difficulty,
  revealPercentage,
}: SudokuBoardPreviewProps) {
  const boxSize = gridSize === 9 ? 3 : 4;
  const boxesPerSide = gridSize / boxSize;
  const style = previewStyles[difficulty];

  const revealedCells = useMemo(
    () => getRevealedCellIndices(gridSize, revealPercentage),
    [gridSize, revealPercentage],
  );
  const boardKey = `${gridSize}-${difficulty}-${revealPercentage}`;

  return (
    <div className={cn('mx-auto w-full max-w-[260px] rounded-xl border p-2', style.frame)}>
      <div
        key={boardKey}
        className="bg-background/70 grid gap-[5px] rounded-lg p-1"
        style={{ gridTemplateColumns: `repeat(${boxesPerSide}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: boxesPerSide * boxesPerSide }, (_, boxIndex) => {
          const boxRow = Math.floor(boxIndex / boxesPerSide);
          const boxCol = boxIndex % boxesPerSide;
          return (
            <div key={`${boardKey}-box-${boxIndex}`}>
              <div
                className="grid gap-px"
                style={{ gridTemplateColumns: `repeat(${boxSize}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: boxSize * boxSize }, (_, cellIndex) => {
                  const cellRowInBox = Math.floor(cellIndex / boxSize);
                  const cellColInBox = cellIndex % boxSize;
                  const row = boxRow * boxSize + cellRowInBox;
                  const col = boxCol * boxSize + cellColInBox;
                  const index = row * gridSize + col;
                  const isRevealed = revealedCells.has(index);

                  return (
                    <div
                      key={`${boardKey}-${index}`}
                      className={cn(
                        'aspect-square rounded-[2px] border border-border/70',
                        isRevealed ? style.filled : style.empty,
                      )}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
