'use client';

import { Button } from '@/components/ui/button';
import type { GridSize } from '@/lib/game-data';
import { Delete } from 'lucide-react';

interface NumberKeypadProps {
  gridSize: GridSize;
  onNumberClick: (num: number) => void;
  onClear: () => void;
  completedNumbers?: Set<number>;
  disabled?: boolean;
}

export function NumberKeypad({
  gridSize,
  onNumberClick,
  onClear,
  completedNumbers,
  disabled = false,
}: NumberKeypadProps) {
  const numbers = Array.from({ length: gridSize }, (_, i) => i + 1);

  // For 16x16, display A-G for 10-16
  const getDisplayValue = (num: number): string => {
    return num > 9 ? String.fromCharCode(55 + num) : num.toString();
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto pb-1">
        <div className="mx-auto flex w-fit min-w-max items-center justify-center gap-1.5">
          {numbers.map((num) => (
            <Button
              key={num}
              variant="secondary"
              size="sm"
              onClick={() => onNumberClick(num)}
              disabled={disabled || completedNumbers?.has(num)}
              className="h-11 w-11 shrink-0 text-sm font-semibold sm:h-12 sm:w-12 sm:text-base"
            >
              {getDisplayValue(num)}
            </Button>
          ))}
          <Button
            variant="outline"
            onClick={onClear}
            disabled={disabled}
            className="h-11 shrink-0 gap-1.5 px-3 text-sm font-semibold sm:h-12 sm:px-4 sm:text-base"
          >
            <Delete className="h-4 w-4" />
            <span>Clear</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
