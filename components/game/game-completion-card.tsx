'use client';

import { Sparkles, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface GameCompletionCardProps {
  levelName: string;
  elapsedTimeLabel: string;
  mistakes: number;
  onPlayAnother: () => void;
}

export function GameCompletionCard({
  levelName,
  elapsedTimeLabel,
  mistakes,
  onPlayAnother,
}: GameCompletionCardProps) {
  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardContent className="space-y-4 py-6 text-center">
        <div className="flex justify-center gap-2">
          <Trophy className="text-primary h-8 w-8" />
          <Sparkles className="h-8 w-8 text-yellow-500" />
        </div>
        <div>
          <h2 className="text-foreground text-2xl font-bold">Puzzle Complete!</h2>
          <p className="text-muted-foreground mt-1">You revealed the {levelName}</p>
        </div>
        <div className="flex justify-center gap-4 text-sm">
          <div className="bg-secondary rounded-full px-3 py-1.5">
            <span className="text-muted-foreground">Time: </span>
            <span className="font-medium">{elapsedTimeLabel}</span>
          </div>
          <div className="bg-secondary rounded-full px-3 py-1.5">
            <span className="text-muted-foreground">Mistakes: </span>
            <span className="font-medium">{mistakes}</span>
          </div>
        </div>
        <Button onClick={onPlayAnother} className="mt-4">
          Play Another
        </Button>
      </CardContent>
    </Card>
  );
}
