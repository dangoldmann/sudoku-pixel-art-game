'use client';

import { ArrowLeft, AlertCircle, Clock, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GameHeaderProps {
  elapsedTimeLabel: string;
  mistakes: number;
  showCompleted: boolean;
  onBack: () => void;
  onPause: () => void;
}

export function GameHeader({
  elapsedTimeLabel,
  mistakes,
  showCompleted,
  onBack,
  onPause,
}: GameHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Save & Exit</span>
      </Button>

      <div className="flex items-center gap-3 text-sm sm:gap-4">
        <div className="text-muted-foreground flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          <span className="font-mono">{elapsedTimeLabel}</span>
        </div>
        {!showCompleted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onPause}
            aria-label="Pause game"
            className="text-muted-foreground h-8 w-8"
          >
            <Pause className="h-4 w-4" />
          </Button>
        )}
        <div className="text-muted-foreground flex items-center gap-1.5">
          <AlertCircle className="h-4 w-4" />
          <span>{mistakes} mistakes</span>
        </div>
      </div>
    </div>
  );
}
