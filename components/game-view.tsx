'use client';

import { useCallback } from 'react';
import { GameCompletionCard } from '@/components/game/game-completion-card';
import { GameHeader } from '@/components/game/game-header';
import { GameProgressBar } from '@/components/game/game-progress-bar';
import { PauseGameDialog } from '@/components/game/pause-game-dialog';
import { SudokuGrid } from './sudoku-grid';
import { NumberKeypad } from './number-keypad';
import { useGameKeyboardControls } from '@/hooks/use-game-keyboard-controls';
import { useGameSession } from '@/hooks/use-game-session';
import type { Level } from '@/lib/game-data';
import type { GameState } from '@/lib/sudoku-engine';
import { cn } from '@/lib/utils';

interface GameViewProps {
  level: Level;
  resumeData?: { gameState: GameState; elapsedTime: number } | null;
  onBack: (gameState: GameState, elapsedTime: number) => void;
  onComplete: (timeElapsed: number, mistakes: number) => void;
}

export function GameView({ level, resumeData, onBack, onComplete }: GameViewProps) {
  const {
    gameState,
    showCompleted,
    elapsedTime,
    isPaused,
    isPauseModalOpen,
    blockedInputCell,
    hintedCell,
    completedNumbers,
    canUseHint,
    progress,
    formattedDifficulty,
    hintsRemaining,
    pauseGame,
    handlePauseModalChange,
    handleCellClick: handleCellClickBase,
    handleNumberClick: handleNumberClickBase,
    handleClear: handleClearBase,
    handleHint: handleHintBase,
    selectCellAt,
    enterNumberAt,
    clearCellAt,
    triggerBlockedInputFeedback,
    formatTime,
  } = useGameSession({
    level,
    resumeData,
    onComplete,
  });

  const { clearPendingOneInput } = useGameKeyboardControls({
    gridSize: level.gridSize,
    isPaused,
    isComplete: gameState.isComplete,
    selectedCell: gameState.selectedCell,
    completedNumbers,
    onSelectCell: selectCellAt,
    onEnterNumber: enterNumberAt,
    onClearCell: clearCellAt,
    onBlockedInput: triggerBlockedInputFeedback,
  });

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      clearPendingOneInput();
      handleCellClickBase(row, col);
    },
    [clearPendingOneInput, handleCellClickBase],
  );

  const handleNumberClick = useCallback(
    (num: number) => {
      clearPendingOneInput();
      handleNumberClickBase(num);
    },
    [clearPendingOneInput, handleNumberClickBase],
  );

  const handleClear = useCallback(() => {
    clearPendingOneInput();
    handleClearBase();
  }, [clearPendingOneInput, handleClearBase]);

  const handleHint = useCallback(() => {
    clearPendingOneInput();
    handleHintBase();
  }, [clearPendingOneInput, handleHintBase]);

  const handlePause = useCallback(() => {
    clearPendingOneInput();
    pauseGame();
  }, [clearPendingOneInput, pauseGame]);

  const handlePauseDialogChange = useCallback(
    (open: boolean) => {
      if (!open) {
        clearPendingOneInput();
      }
      handlePauseModalChange(open);
    },
    [clearPendingOneInput, handlePauseModalChange],
  );

  return (
    <div className="bg-background min-h-screen p-3 sm:p-6">
      <div className="mx-auto max-w-2xl space-y-4 sm:space-y-6">
        <GameHeader
          elapsedTimeLabel={formatTime(elapsedTime)}
          mistakes={gameState.mistakes}
          showCompleted={showCompleted}
          onBack={() => onBack(gameState, elapsedTime)}
          onPause={handlePause}
        />

        <GameProgressBar progress={progress} />

        <div
          className={cn(
            'flex justify-center transition-all duration-700',
            showCompleted && 'scale-105',
          )}
        >
          <SudokuGrid
            cells={gameState.cells}
            selectedCell={gameState.selectedCell}
            blockedInputCell={blockedInputCell}
            hintedCell={hintedCell}
            gridSize={level.gridSize}
            showCompleted={showCompleted}
            onCellClick={handleCellClick}
          />
        </div>

        {showCompleted && (
          <GameCompletionCard
            levelName={level.name}
            elapsedTimeLabel={formatTime(elapsedTime)}
            mistakes={gameState.mistakes}
            onPlayAnother={() => onBack(gameState, elapsedTime)}
          />
        )}

        {!showCompleted && (
          <div className="mx-auto w-full max-w-2xl">
            <NumberKeypad
              gridSize={level.gridSize}
              onNumberClick={handleNumberClick}
              onClear={handleClear}
              onHint={handleHint}
              hintsRemaining={hintsRemaining}
              canUseHint={canUseHint}
              completedNumbers={completedNumbers}
              disabled={!gameState.selectedCell || isPaused}
            />
          </div>
        )}

        {!showCompleted && (
          <p className="text-muted-foreground hidden text-center text-xs lg:block">
            Click a cell and enter a number. Use arrow keys to navigate.
          </p>
        )}
      </div>

      <PauseGameDialog
        open={isPauseModalOpen}
        elapsedTimeLabel={formatTime(elapsedTime)}
        mistakes={gameState.mistakes}
        formattedDifficulty={formattedDifficulty}
        gridSize={level.gridSize}
        onOpenChange={handlePauseDialogChange}
      />
    </div>
  );
}
