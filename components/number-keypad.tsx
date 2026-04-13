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
  const isSixteenBySixteen = gridSize === 16;
  const numberButtonClass = 'h-11 w-11 shrink-0 text-sm font-semibold sm:h-12 sm:w-12 sm:text-base';

  return (
    <div className="w-full">
      <div className={isSixteenBySixteen ? '' : 'overflow-x-auto pb-1'}>
        <div
          className={
            isSixteenBySixteen
              ? 'mx-auto grid w-fit grid-cols-[repeat(8,auto)_auto] grid-rows-2 items-stretch gap-1.5'
              : 'mx-auto flex w-fit min-w-max items-center justify-center gap-1.5'
          }
        >
          {numbers.map((num) => {
            const isTopRow = num <= 8;
            const colStart = isTopRow ? num : num - 8;
            const rowStart = isTopRow ? 1 : 2;

            return (
              <Button
                key={num}
                variant="secondary"
                size="sm"
                onClick={() => onNumberClick(num)}
                disabled={disabled || completedNumbers?.has(num)}
                className={numberButtonClass}
                style={
                  isSixteenBySixteen
                    ? { gridColumnStart: colStart, gridRowStart: rowStart }
                    : undefined
                }
              >
                {num}
              </Button>
            );
          })}
          <Button
            variant="outline"
            onClick={onClear}
            disabled={disabled}
            className={
              isSixteenBySixteen
                ? 'col-start-9 row-span-2 row-start-1 h-full gap-1.5 px-3 text-sm font-semibold sm:px-4 sm:text-base'
                : 'h-11 shrink-0 gap-1.5 px-3 text-sm font-semibold sm:h-12 sm:px-4 sm:text-base'
            }
          >
            <Delete className="h-4 w-4" />
            <span>Clear</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
