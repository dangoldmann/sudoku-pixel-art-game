'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface PauseGameDialogProps {
  open: boolean;
  elapsedTimeLabel: string;
  mistakes: number;
  formattedDifficulty: string;
  gridSize: number;
  onOpenChange: (open: boolean) => void;
}

export function PauseGameDialog({
  open,
  elapsedTimeLabel,
  mistakes,
  formattedDifficulty,
  gridSize,
  onOpenChange,
}: PauseGameDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Game Paused</DialogTitle>
          <DialogDescription>
            Your timer is paused. Resume whenever you are ready.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-muted rounded-md p-3">
            <div className="text-muted-foreground text-xs">Time</div>
            <div className="mt-1 font-mono font-semibold">{elapsedTimeLabel}</div>
          </div>
          <div className="bg-muted rounded-md p-3">
            <div className="text-muted-foreground text-xs">Mistakes</div>
            <div className="mt-1 font-semibold">{mistakes}</div>
          </div>
          <div className="bg-muted rounded-md p-3">
            <div className="text-muted-foreground text-xs">Difficulty</div>
            <div className="mt-1 font-semibold">{formattedDifficulty}</div>
          </div>
          <div className="bg-muted rounded-md p-3">
            <div className="text-muted-foreground text-xs">Grid Size</div>
            <div className="mt-1 font-semibold">
              {gridSize} x {gridSize}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Resume Game
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
