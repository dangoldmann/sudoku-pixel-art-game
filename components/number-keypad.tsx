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
  const actionButtonClass = 'h-11 w-11 shrink-0 px-0 sm:h-12 sm:w-12';
  const numberButtonClass =
    'h-8 w-8 shrink-0 bg-transparent px-0 text-3xl sm:font-semibold hover:bg-transparent sm:h-12 sm:w-12 sm:border sm:bg-secondary sm:text-lg sm:hover:bg-secondary/80';

  const clearButton = (
    <Button
      variant="outline"
      onClick={onClear}
      disabled={disabled}
      aria-label="Clear selected cell"
      className={
        isSixteenBySixteen ? `col-start-9 row-start-1 ${actionButtonClass}` : actionButtonClass
      }
    >
      <Delete className="h-4 w-4" />
    </Button>
  );

  const hintButton = (
    <Button
      variant="outline"
      onClick={onHint}
      disabled={!canUseHint}
      className={
        isSixteenBySixteen
          ? `relative col-start-9 row-start-2 overflow-visible ${actionButtonClass}`
          : `relative overflow-visible ${actionButtonClass}`
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
  );

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
              ? 'sm:mx-auto grid sm:w-fit grid-cols-[repeat(8,auto)_auto] grid-rows-2 items-center gap-1.5'
              : 'sm:mx-auto flex sm:w-fit min-w-max flex-col gap-4 sm:flex-row sm:items-center sm:justify-center sm:gap-1.5'
          }
        >
          {!isSixteenBySixteen ? (
            <div className="order-1 flex items-center justify-end gap-2 sm:order-2">
              {hintButton}
              {clearButton}
            </div>  
          ) : null}
          {!isSixteenBySixteen ? (
            <div className="order-2 flex items-center justify-between gap-1.5 sm:order-1 sm:gap-2">
              {numbers.map((num) => (
                <Button
                  key={num}
                  variant="secondary"
                  size="sm"
                  onClick={() => onNumberClick(num)}
                  disabled={disabled || completedNumbers?.has(num)}
                  className={numberButtonClass}
                >
                  {num}
                </Button>
              ))}
            </div>
          ) : null}
          {numbers.map((num) => {
            const isTopRow = num <= 8;
            const colStart = isTopRow ? num : num - 8;
            const rowStart = isTopRow ? 1 : 2;

            return isSixteenBySixteen ? (
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
            ) : null;
          })}
          {isSixteenBySixteen ? clearButton : null}
          {isSixteenBySixteen ? hintButton : null}
        </div>
      </div>
    </div>
  );
}
