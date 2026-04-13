'use client';

import { Button } from '@/components/ui/button';
import type { GridSize } from '@/lib/game-data';
import { Delete, Lightbulb } from 'lucide-react';

interface NumberKeypadProps {
  gridSize: GridSize;
  onNumberClick: (num: number) => void;
  onClear: () => void;
  onHint: () => void;
  hintsRemaining: number;
  canUseHint: boolean;
  completedNumbers?: Set<number>;
  disabled?: boolean;
}

export function NumberKeypad({
  gridSize,
  onNumberClick,
  onClear,
  onHint,
  hintsRemaining,
  canUseHint,
  completedNumbers,
  disabled = false,
}: NumberKeypadProps) {
  const numbers = Array.from({ length: gridSize }, (_, i) => i + 1);
  const isSixteenBySixteen = gridSize === 16;
  const numberButtonClass = 'h-11 w-11 shrink-0 text-sm font-semibold sm:h-12 sm:w-12 sm:text-base';

  return (
    <div className="w-full">
      <div
        className={
          isSixteenBySixteen ? 'overflow-visible pb-3' : 'overflow-x-auto overflow-y-hidden pb-3'
        }
      >
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
            aria-label="Clear selected cell"
            className={
              isSixteenBySixteen
                ? `col-start-9 row-start-1 ${numberButtonClass}`
                : numberButtonClass
            }
          >
            <Delete className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            onClick={onHint}
            disabled={!canUseHint}
            className={
              isSixteenBySixteen
                ? `relative col-start-9 row-start-2 overflow-visible ${numberButtonClass}`
                : `relative overflow-visible ${numberButtonClass}`
            }
            aria-label={`Use hint (${hintsRemaining} remaining)`}
          >
            <Lightbulb className="h-4 w-4" />
            <span
              className="pointer-events-none absolute -right-2 -bottom-2 z-10 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] leading-none font-bold text-white"
              aria-hidden="true"
            >
              {hintsRemaining}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}
