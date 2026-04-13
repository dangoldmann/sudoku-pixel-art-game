import { levels } from './game-level-data';

export type GridSize = 9 | 16;
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Level {
  id: string;
  name: string;
  gridSize: GridSize;
  difficulty: Difficulty;
  solution: number[][];
  pixelColors: string[][];
  initialRevealed: number; // percentage of cells pre-filled
}

export { levels };

export function getLevelsByFilter(gridSize: GridSize, difficulty: Difficulty): Level[] {
  return levels.filter((l) => l.gridSize === gridSize && l.difficulty === difficulty);
}

function pickRandomLevel(levelPool: Level[]): Level {
  return levelPool[Math.floor(Math.random() * levelPool.length)];
}

export function getRandomUncompletedLevel(
  gridSize: GridSize,
  difficulty: Difficulty,
  completedLevelIds: string[],
): Level {
  const completedSet = new Set(completedLevelIds);
  const candidatePool = getLevelsByFilter(gridSize, difficulty);
  const uncompletedPool = candidatePool.filter((level) => !completedSet.has(level.id));

  if (uncompletedPool.length > 0) {
    return pickRandomLevel(uncompletedPool);
  }

  return pickRandomLevel(candidatePool);
}

export function getLevelById(id: string): Level | undefined {
  return levels.find((l) => l.id === id);
}
