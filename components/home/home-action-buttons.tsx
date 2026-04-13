import { Palette, Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SavedGame } from '@/hooks/use-game-storage';
import type { Difficulty, GridSize } from '@/lib/game-data';

interface HomeActionButtonsProps {
  selectedSize: GridSize;
  selectedDifficulty: Difficulty;
  savedGame: SavedGame | null;
  completedCount: number;
  onStartGame: (gridSize: GridSize, difficulty: Difficulty) => void;
  onOpenGallery: () => void;
  onResumeGame?: (saved: SavedGame) => void;
}

export function HomeActionButtons({
  selectedSize,
  selectedDifficulty,
  savedGame,
  completedCount,
  onStartGame,
  onOpenGallery,
  onResumeGame,
}: HomeActionButtonsProps) {
  const canResume = Boolean(savedGame && onResumeGame);

  return (
    <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end lg:w-auto">
      <Button
        onClick={() => onStartGame(selectedSize, selectedDifficulty)}
        className="h-12 w-full gap-2 text-base font-semibold sm:w-auto sm:min-w-38"
        size="lg"
      >
        <Play className="h-5 w-5" />
        New Game
      </Button>

      {canResume && (
        <Button
          variant="secondary"
          onClick={() => {
            if (savedGame && onResumeGame) {
              onResumeGame(savedGame);
            }
          }}
          className="h-12 w-full gap-2 text-base font-semibold sm:w-auto sm:min-w-38"
          size="lg"
        >
          <RotateCcw className="h-5 w-5" />
          Resume Game
        </Button>
      )}

      <Button
        variant="outline"
        onClick={onOpenGallery}
        className="h-12 w-full sm:w-auto sm:min-w-34"
      >
        <Palette className="mr-2 h-4 w-4" />
        Gallery
        {completedCount > 0 && (
          <span className="bg-primary/10 text-primary ml-2 rounded-full px-2 py-0.5 text-xs font-medium">
            {completedCount}
          </span>
        )}
      </Button>
    </div>
  );
}
