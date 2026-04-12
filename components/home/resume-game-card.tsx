import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { SavedGame } from '@/hooks/use-game-storage';
import { formatTime, getProgress } from '@/lib/sudoku-engine';

interface ResumeGameCardProps {
  savedGame: SavedGame;
  onResumeGame: (saved: SavedGame) => void;
}

export function ResumeGameCard({ savedGame, onResumeGame }: ResumeGameCardProps) {
  return (
    <Card className="border-primary/50 bg-primary/5 gap-0">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="text-foreground text-sm font-medium">Continue Game</div>
            <div className="text-muted-foreground mt-0.5 text-xs">
              {savedGame.level.gridSize}x{savedGame.level.gridSize} {savedGame.level.difficulty} -{' '}
              {getProgress(savedGame.gameState)}% complete - {formatTime(savedGame.elapsedTime)}
            </div>
          </div>
          <Button onClick={() => onResumeGame(savedGame)} size="sm" className="shrink-0 gap-1.5">
            <RotateCcw className="h-4 w-4" />
            Resume
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
