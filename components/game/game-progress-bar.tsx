'use client';

import { Progress } from '@/components/ui/progress';

interface GameProgressBarProps {
  progress: number;
}

export function GameProgressBar({ progress }: GameProgressBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Progress</span>
        <span className="text-primary font-medium">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
