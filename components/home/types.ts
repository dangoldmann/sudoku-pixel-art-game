import type { Difficulty, GridSize } from '@/lib/game-data';
import type { SavedGame } from '@/hooks/use-game-storage';

export interface HomeViewProps {
  onStartGame: (gridSize: GridSize, difficulty: Difficulty) => void;
  onOpenGallery: () => void;
  onResumeGame: (saved: SavedGame) => void;
  savedGame: SavedGame | null;
  completedCount: number;
}
