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

// Helper to generate a valid Sudoku solution
function generateSudokuSolution(size: GridSize): number[][] {
  const grid: number[][] = Array(size).fill(null).map(() => Array(size).fill(0));
  const boxSize = size === 9 ? 3 : 4;

  function isValid(row: number, col: number, num: number): boolean {
    for (let i = 0; i < size; i++) {
      if (grid[row][i] === num || grid[i][col] === num) return false;
    }
    const startRow = Math.floor(row / boxSize) * boxSize;
    const startCol = Math.floor(col / boxSize) * boxSize;
    for (let i = 0; i < boxSize; i++) {
      for (let j = 0; j < boxSize; j++) {
        if (grid[startRow + i][startCol + j] === num) return false;
      }
    }
    return true;
  }

  function solve(): boolean {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (grid[row][col] === 0) {
          const nums = shuffle(Array.from({ length: size }, (_, i) => i + 1));
          for (const num of nums) {
            if (isValid(row, col, num)) {
              grid[row][col] = num;
              if (solve()) return true;
              grid[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  solve();
  return grid;
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Pixel art patterns - each returns a 2D array of hex colors
const pixelArtPatterns = {
  heart9x9: (): string[][] => {
    const r = '#EF4444', p = '#EC4899', w = '#FDF2F8', d = '#BE123C';
    return [
      [w, r, r, w, w, w, r, r, w],
      [r, d, r, r, w, r, r, d, r],
      [r, r, r, r, r, r, r, r, r],
      [r, r, r, r, r, r, r, r, r],
      [w, r, r, r, r, r, r, r, w],
      [w, w, r, r, r, r, r, w, w],
      [w, w, w, r, r, r, w, w, w],
      [w, w, w, w, r, w, w, w, w],
      [w, w, w, w, w, w, w, w, w],
    ];
  },
  star9x9: (): string[][] => {
    const y = '#FBBF24', g = '#FDE047', b = '#1E3A5F', d = '#F59E0B';
    return [
      [b, b, b, b, y, b, b, b, b],
      [b, b, b, y, g, y, b, b, b],
      [b, b, b, y, y, y, b, b, b],
      [y, y, y, y, y, y, y, y, y],
      [b, y, y, y, y, y, y, y, b],
      [b, b, y, y, y, y, y, b, b],
      [b, y, y, d, y, d, y, y, b],
      [b, y, b, b, y, b, b, y, b],
      [y, b, b, b, y, b, b, b, y],
    ];
  },
  mushroom9x9: (): string[][] => {
    const r = '#DC2626', w = '#FEFCE8', t = '#92400E', b = '#FEF3C7', c = '#B91C1C';
    return [
      [b, b, r, r, r, r, r, b, b],
      [b, r, r, w, r, w, r, r, b],
      [r, r, w, w, r, w, w, r, r],
      [r, c, r, r, r, r, r, c, r],
      [r, r, r, r, r, r, r, r, r],
      [b, b, t, t, t, t, t, b, b],
      [b, b, b, t, t, t, b, b, b],
      [b, b, b, t, t, t, b, b, b],
      [b, b, t, t, t, t, t, b, b],
    ];
  },
  tree9x9: (): string[][] => {
    const g = '#22C55E', d = '#15803D', t = '#92400E', s = '#E0F2FE', l = '#86EFAC';
    return [
      [s, s, s, s, d, s, s, s, s],
      [s, s, s, d, g, d, s, s, s],
      [s, s, d, g, l, g, d, s, s],
      [s, d, g, g, g, g, g, d, s],
      [d, g, l, g, g, g, l, g, d],
      [s, d, g, g, g, g, g, d, s],
      [s, s, s, s, t, s, s, s, s],
      [s, s, s, s, t, s, s, s, s],
      [s, s, s, t, t, t, s, s, s],
    ];
  },
  sun9x9: (): string[][] => {
    const y = '#FBBF24', o = '#F97316', w = '#FFFBEB', r = '#FDE047';
    return [
      [w, w, y, w, y, w, y, w, w],
      [w, w, w, y, y, y, w, w, w],
      [y, w, y, y, y, y, y, w, y],
      [w, y, y, r, r, r, y, y, w],
      [y, y, y, r, o, r, y, y, y],
      [w, y, y, r, r, r, y, y, w],
      [y, w, y, y, y, y, y, w, y],
      [w, w, w, y, y, y, w, w, w],
      [w, w, y, w, y, w, y, w, w],
    ];
  },
  ghost9x9: (): string[][] => {
    const w = '#F8FAFC', g = '#94A3B8', b = '#1E293B', p = '#E2E8F0', d = '#475569';
    return [
      [b, b, p, p, p, p, p, b, b],
      [b, p, w, w, w, w, w, p, b],
      [p, w, g, w, w, w, g, w, p],
      [p, w, d, w, w, w, d, w, p],
      [p, w, w, w, w, w, w, w, p],
      [p, w, w, w, w, w, w, w, p],
      [p, w, w, w, w, w, w, w, p],
      [p, w, w, w, w, w, w, w, p],
      [w, b, w, b, w, b, w, b, w],
    ];
  },
  flower16x16: (): string[][] => {
    const p = '#EC4899', r = '#F472B6', y = '#FBBF24', g = '#22C55E', l = '#86EFAC', w = '#FDF4FF', d = '#BE185D', s = '#15803D';
    const row = (colors: string[]) => colors;
    return [
      row([w, w, w, w, w, p, p, w, w, p, p, w, w, w, w, w]),
      row([w, w, w, w, p, r, r, p, p, r, r, p, w, w, w, w]),
      row([w, w, w, p, r, r, r, r, r, r, r, r, p, w, w, w]),
      row([w, w, p, r, r, r, r, r, r, r, r, r, r, p, w, w]),
      row([w, p, r, r, r, r, y, y, y, y, r, r, r, r, p, w]),
      row([p, r, r, r, r, y, y, y, y, y, y, r, r, r, r, p]),
      row([p, r, r, r, y, y, y, y, y, y, y, y, r, r, r, p]),
      row([w, p, r, r, y, y, y, y, y, y, y, y, r, r, p, w]),
      row([w, w, p, r, r, y, y, y, y, y, y, r, r, p, w, w]),
      row([w, w, w, p, r, r, r, r, r, r, r, r, p, w, w, w]),
      row([w, w, w, w, p, d, p, g, g, p, d, p, w, w, w, w]),
      row([w, w, w, w, w, w, w, g, g, w, w, w, w, w, w, w]),
      row([w, w, w, w, l, l, g, g, g, g, l, l, w, w, w, w]),
      row([w, w, w, l, g, g, g, g, g, g, g, g, l, w, w, w]),
      row([w, w, w, w, w, s, g, g, g, g, s, w, w, w, w, w]),
      row([w, w, w, w, w, w, s, s, s, s, w, w, w, w, w, w]),
    ];
  },
  rocket16x16: (): string[][] => {
    const w = '#F8FAFC', r = '#EF4444', b = '#3B82F6', g = '#94A3B8', d = '#1E293B', o = '#F97316', y = '#FBBF24', s = '#0F172A';
    const row = (colors: string[]) => colors;
    return [
      row([s, s, s, s, s, s, s, w, w, s, s, s, s, s, s, s]),
      row([s, s, s, s, s, s, w, g, g, w, s, s, s, s, s, s]),
      row([s, s, s, s, s, w, g, g, g, g, w, s, s, s, s, s]),
      row([s, s, s, s, w, g, g, g, g, g, g, w, s, s, s, s]),
      row([s, s, s, w, g, g, b, g, g, b, g, g, w, s, s, s]),
      row([s, s, s, w, g, g, g, g, g, g, g, g, w, s, s, s]),
      row([s, s, w, g, g, g, g, g, g, g, g, g, g, w, s, s]),
      row([s, s, w, g, g, g, g, g, g, g, g, g, g, w, s, s]),
      row([s, w, g, r, g, g, g, g, g, g, g, g, r, g, w, s]),
      row([s, w, r, r, g, g, g, g, g, g, g, g, r, r, w, s]),
      row([w, r, r, g, g, g, g, g, g, g, g, g, g, r, r, w]),
      row([w, r, g, g, g, g, g, g, g, g, g, g, g, g, r, w]),
      row([s, w, g, g, g, g, g, g, g, g, g, g, g, g, w, s]),
      row([s, s, w, w, w, g, g, g, g, g, g, w, w, w, s, s]),
      row([s, s, s, s, s, w, o, y, y, o, w, s, s, s, s, s]),
      row([s, s, s, s, s, s, o, y, y, o, s, s, s, s, s, s]),
    ];
  },
  cat16x16: (): string[][] => {
    const o = '#F97316', b = '#0F172A', w = '#FFF7ED', p = '#FFEDD5', n = '#EC4899', g = '#22C55E', d = '#EA580C';
    const row = (colors: string[]) => colors;
    return [
      row([w, w, o, o, w, w, w, w, w, w, w, w, o, o, w, w]),
      row([w, o, d, o, o, w, w, w, w, w, w, o, o, d, o, w]),
      row([o, o, o, o, o, o, w, w, w, w, o, o, o, o, o, o]),
      row([o, o, o, o, o, o, o, o, o, o, o, o, o, o, o, o]),
      row([o, o, o, o, o, o, o, o, o, o, o, o, o, o, o, o]),
      row([o, o, g, b, o, o, o, o, o, o, o, o, g, b, o, o]),
      row([o, o, b, b, o, o, o, o, o, o, o, o, b, b, o, o]),
      row([o, o, o, o, o, o, o, n, n, o, o, o, o, o, o, o]),
      row([o, o, o, o, o, o, o, o, o, o, o, o, o, o, o, o]),
      row([o, o, o, o, p, p, p, p, p, p, p, p, o, o, o, o]),
      row([o, o, o, p, p, p, p, p, p, p, p, p, p, o, o, o]),
      row([w, o, o, o, o, o, o, o, o, o, o, o, o, o, o, w]),
      row([w, w, o, o, o, o, o, o, o, o, o, o, o, o, w, w]),
      row([w, w, w, o, o, o, o, o, o, o, o, o, o, w, w, w]),
      row([w, w, w, w, o, o, o, o, o, o, o, o, w, w, w, w]),
      row([w, w, w, w, w, o, o, o, o, o, o, w, w, w, w, w]),
    ];
  },
};

// Generate levels with pre-computed solutions
export const levels: Level[] = [
  {
    id: 'heart-9-easy',
    name: 'Heart',
    gridSize: 9,
    difficulty: 'easy',
    solution: generateSudokuSolution(9),
    pixelColors: pixelArtPatterns.heart9x9(),
    initialRevealed: 55,
  },
  {
    id: 'star-9-easy',
    name: 'Star',
    gridSize: 9,
    difficulty: 'easy',
    solution: generateSudokuSolution(9),
    pixelColors: pixelArtPatterns.star9x9(),
    initialRevealed: 55,
  },
  {
    id: 'mushroom-9-medium',
    name: 'Mushroom',
    gridSize: 9,
    difficulty: 'medium',
    solution: generateSudokuSolution(9),
    pixelColors: pixelArtPatterns.mushroom9x9(),
    initialRevealed: 45,
  },
  {
    id: 'tree-9-medium',
    name: 'Tree',
    gridSize: 9,
    difficulty: 'medium',
    solution: generateSudokuSolution(9),
    pixelColors: pixelArtPatterns.tree9x9(),
    initialRevealed: 45,
  },
  {
    id: 'sun-9-hard',
    name: 'Sun',
    gridSize: 9,
    difficulty: 'hard',
    solution: generateSudokuSolution(9),
    pixelColors: pixelArtPatterns.sun9x9(),
    initialRevealed: 35,
  },
  {
    id: 'ghost-9-hard',
    name: 'Ghost',
    gridSize: 9,
    difficulty: 'hard',
    solution: generateSudokuSolution(9),
    pixelColors: pixelArtPatterns.ghost9x9(),
    initialRevealed: 35,
  },
  {
    id: 'flower-16-easy',
    name: 'Flower',
    gridSize: 16,
    difficulty: 'easy',
    solution: generateSudokuSolution(16),
    pixelColors: pixelArtPatterns.flower16x16(),
    initialRevealed: 50,
  },
  {
    id: 'rocket-16-medium',
    name: 'Rocket',
    gridSize: 16,
    difficulty: 'medium',
    solution: generateSudokuSolution(16),
    pixelColors: pixelArtPatterns.rocket16x16(),
    initialRevealed: 40,
  },
  {
    id: 'cat-16-hard',
    name: 'Cat',
    gridSize: 16,
    difficulty: 'hard',
    solution: generateSudokuSolution(16),
    pixelColors: pixelArtPatterns.cat16x16(),
    initialRevealed: 30,
  },
];

export function getLevelsByFilter(gridSize: GridSize, difficulty: Difficulty): Level[] {
  return levels.filter(l => l.gridSize === gridSize && l.difficulty === difficulty);
}

export function getRandomLevel(gridSize: GridSize, difficulty: Difficulty): Level {
  const filtered = getLevelsByFilter(gridSize, difficulty);
  if (filtered.length === 0) {
    // Fallback to any level of matching size
    const sizeFiltered = levels.filter(l => l.gridSize === gridSize);
    return sizeFiltered[Math.floor(Math.random() * sizeFiltered.length)];
  }
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function getLevelById(id: string): Level | undefined {
  return levels.find(l => l.id === id);
}
