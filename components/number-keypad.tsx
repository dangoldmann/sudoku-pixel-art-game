'use client';

import { Button } from '@/components/ui/button';
import type { GridSize } from '@/lib/game-data';
import { Delete } from 'lucide-react';

interface NumberKeypadProps {
  gridSize: GridSize;
  onNumberClick: (num: number) => void;
  onClear: () => void;
  disabled?: boolean;
}

export function NumberKeypad({
  gridSize,
  onNumberClick,
  onClear,
  disabled = false,
}: NumberKeypadProps) {
  const numbers = Array.from({ length: gridSize }, (_, i) => i + 1);
  
  // For 16x16, display A-G for 10-16
  const getDisplayValue = (num: number): string => {
    return num > 9 ? String.fromCharCode(55 + num) : num.toString();
  };

  return (
    <div className="flex flex-col gap-2">
      <div 
        className="grid gap-1.5"
        style={{
          gridTemplateColumns: gridSize === 9 ? 'repeat(5, 1fr)' : 'repeat(8, 1fr)',
        }}
      >
        {numbers.map((num) => (
          <Button
            key={num}
            variant="secondary"
            size="sm"
            onClick={() => onNumberClick(num)}
            disabled={disabled}
            className="aspect-square text-sm sm:text-base font-semibold h-auto py-2"
          >
            {getDisplayValue(num)}
          </Button>
        ))}
      </div>
      <Button
        variant="outline"
        onClick={onClear}
        disabled={disabled}
        className="w-full"
      >
        <Delete className="w-4 h-4 mr-2" />
        Clear
      </Button>
    </div>
  );
}
