import type { Level, GridSize } from './game-data';

export interface CellState {
  row: number;
  col: number;
  value: number | null;
  solution: number;
  isRevealed: boolean;  // Pre-filled cell
  isCorrect: boolean;   // User entered correct value
  isIncorrect: boolean; // User entered wrong value
  color: string;        // Pixel art color for this cell
}

export interface GameState {
  cells: CellState[][];
  selectedCell: { row: number; col: number } | null;
  mistakes: number;
  isComplete: boolean;
  startTime: number;
  elapsedTime: number;
}

export function initializeGame(level: Level): GameState {
  const { solution, pixelColors, initialRevealed, gridSize } = level;
  const totalCells = gridSize * gridSize;
  const revealCount = Math.floor(totalCells * (initialRevealed / 100));
  
  // Randomly select cells to reveal
  const allPositions: { row: number; col: number }[] = [];
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      allPositions.push({ row, col });
    }
  }
  
  // Shuffle and take first revealCount positions
  const shuffled = allPositions.sort(() => Math.random() - 0.5);
  const revealedPositions = new Set(
    shuffled.slice(0, revealCount).map(p => `${p.row}-${p.col}`)
  );
  
  const cells: CellState[][] = [];
  for (let row = 0; row < gridSize; row++) {
    const rowCells: CellState[] = [];
    for (let col = 0; col < gridSize; col++) {
      const isRevealed = revealedPositions.has(`${row}-${col}`);
      rowCells.push({
        row,
        col,
        value: isRevealed ? solution[row][col] : null,
        solution: solution[row][col],
        isRevealed,
        isCorrect: isRevealed,
        isIncorrect: false,
        color: pixelColors[row][col],
      });
    }
    cells.push(rowCells);
  }
  
  return {
    cells,
    selectedCell: null,
    mistakes: 0,
    isComplete: false,
    startTime: Date.now(),
    elapsedTime: 0,
  };
}

export function enterNumber(
  state: GameState,
  row: number,
  col: number,
  value: number
): GameState {
  const cell = state.cells[row][col];
  
  // Can't modify revealed cells
  if (cell.isRevealed) return state;
  
  const newCells = state.cells.map(r => r.map(c => ({ ...c })));
  const targetCell = newCells[row][col];
  
  if (value === cell.solution) {
    targetCell.value = value;
    targetCell.isCorrect = true;
    targetCell.isIncorrect = false;
  } else {
    targetCell.value = value;
    targetCell.isCorrect = false;
    targetCell.isIncorrect = true;
  }
  
  // Check if puzzle is complete
  const isComplete = newCells.every(r => 
    r.every(c => c.isCorrect)
  );
  
  return {
    ...state,
    cells: newCells,
    mistakes: targetCell.isIncorrect ? state.mistakes + 1 : state.mistakes,
    isComplete,
  };
}

export function clearCell(state: GameState, row: number, col: number): GameState {
  const cell = state.cells[row][col];
  
  // Can't modify revealed cells
  if (cell.isRevealed) return state;
  
  const newCells = state.cells.map(r => r.map(c => ({ ...c })));
  newCells[row][col].value = null;
  newCells[row][col].isCorrect = false;
  newCells[row][col].isIncorrect = false;
  
  return {
    ...state,
    cells: newCells,
  };
}

export function selectCell(
  state: GameState,
  row: number,
  col: number
): GameState {
  return {
    ...state,
    selectedCell: { row, col },
  };
}

export function getProgress(state: GameState): number {
  const totalCells = state.cells.length * state.cells.length;
  const correctCells = state.cells.flat().filter(c => c.isCorrect).length;
  return Math.round((correctCells / totalCells) * 100);
}

export function isValidPlacement(
  cells: CellState[][],
  row: number,
  col: number,
  value: number,
  gridSize: GridSize
): boolean {
  const boxSize = gridSize === 9 ? 3 : 4;
  
  // Check row
  for (let c = 0; c < gridSize; c++) {
    if (c !== col && cells[row][c].value === value) return false;
  }
  
  // Check column
  for (let r = 0; r < gridSize; r++) {
    if (r !== row && cells[r][col].value === value) return false;
  }
  
  // Check box
  const startRow = Math.floor(row / boxSize) * boxSize;
  const startCol = Math.floor(col / boxSize) * boxSize;
  for (let r = startRow; r < startRow + boxSize; r++) {
    for (let c = startCol; c < startCol + boxSize; c++) {
      if ((r !== row || c !== col) && cells[r][c].value === value) return false;
    }
  }
  
  return true;
}

// Get contrasting text color for a background
export function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#1a1a2e' : '#ffffff';
}

// Format time as MM:SS
export function formatTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
