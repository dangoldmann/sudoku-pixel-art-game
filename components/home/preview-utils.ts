import { getLevelsByFilter, type Difficulty, type GridSize } from '@/lib/game-data';
import { difficulties, revealFallbackBySize } from './constants';

export function getRevealPercentage(gridSize: GridSize, difficulty: Difficulty): number {
  const matchingLevels = getLevelsByFilter(gridSize, difficulty);

  if (matchingLevels.length > 0) {
    const total = matchingLevels.reduce((sum, level) => sum + level.initialRevealed, 0);
    return Math.round(total / matchingLevels.length);
  }

  return revealFallbackBySize[gridSize][difficulty];
}

export function getRevealPercentagesByDifficulty(gridSize: GridSize): Record<Difficulty, number> {
  return difficulties.reduce(
    (acc, { value }) => {
      acc[value] = getRevealPercentage(gridSize, value);
      return acc;
    },
    {} as Record<Difficulty, number>,
  );
}

export function getRevealedCellIndices(
  gridSize: GridSize,
  revealPercentage: number,
): Set<number> {
  const totalCells = gridSize * gridSize;
  const revealCount = Math.round((totalCells * revealPercentage) / 100);

  return new Set(Array.from({ length: revealCount }, (_, index) => index));
}
