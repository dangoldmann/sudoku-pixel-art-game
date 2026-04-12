import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Difficulty, GridSize } from '@/lib/game-data';
import { SudokuBoardPreview } from './sudoku-board-preview';

interface PuzzlePreviewCardProps {
  selectedSize: GridSize;
  selectedDifficultyLabel: string;
  selectedDifficulty: Difficulty;
  selectedRevealPercentage: number;
}

export function PuzzlePreviewCard({
  selectedSize,
  selectedDifficultyLabel,
  selectedDifficulty,
  selectedRevealPercentage,
}: PuzzlePreviewCardProps) {
  return (
    <Card className="border-border/50 gap-0">
      <CardHeader className="pb-0">
        <CardTitle className="text-muted-foreground text-sm font-medium">Puzzle Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4 pb-6">
        <div className="space-y-1">
          <p className="text-foreground text-sm font-semibold">
            {selectedSize} x {selectedSize} - {selectedDifficultyLabel}
          </p>
          <p className="text-muted-foreground text-xs">
            {selectedRevealPercentage}% of cells shown at start
          </p>
        </div>

        <SudokuBoardPreview
          gridSize={selectedSize}
          difficulty={selectedDifficulty}
          revealPercentage={selectedRevealPercentage}
        />
      </CardContent>
    </Card>
  );
}
