import { Palette, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Difficulty, GridSize } from '@/lib/game-data';

interface HomeActionButtonsProps {
  selectedSize: GridSize;
  selectedDifficulty: Difficulty;
  savedGameExists: boolean;
  completedCount: number;
  onStartGame: (gridSize: GridSize, difficulty: Difficulty) => void;
  onOpenGallery: () => void;
}

export function HomeActionButtons({
  selectedSize,
  selectedDifficulty,
  savedGameExists,
  completedCount,
  onStartGame,
  onOpenGallery,
}: HomeActionButtonsProps) {
  return (
    <div className="space-y-3">
      <Button
        onClick={() => onStartGame(selectedSize, selectedDifficulty)}
        className="h-12 w-full gap-2 text-base font-semibold"
        size="lg"
      >
        <Play className="h-5 w-5" />
        {savedGameExists ? 'New Game' : 'Start Game'}
      </Button>

      <Button variant="outline" onClick={onOpenGallery} className="w-full">
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
