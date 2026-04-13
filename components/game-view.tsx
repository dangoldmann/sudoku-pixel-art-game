'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { SudokuGrid } from './sudoku-grid';
import { NumberKeypad } from './number-keypad';
import type { Level } from '@/lib/game-data';
import {
  initializeGame,
  enterNumber,
  clearCell,
  getHintCandidates,
  revealHintCell,
  selectCell,
  getProgress,
  formatTime,
  type GameState,
} from '@/lib/sudoku-engine';
import { ArrowLeft, Clock, AlertCircle, Trophy, Sparkles, Pause } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameViewProps {
  level: Level;
  resumeData?: { gameState: GameState; elapsedTime: number } | null;
  onBack: (gameState: GameState, elapsedTime: number) => void;
  onComplete: (timeElapsed: number, mistakes: number) => void;
}

const MULTI_DIGIT_INPUT_WINDOW_MS = 200;
const MAX_HINTS = 3;

export function GameView({ level, resumeData, onBack, onComplete }: GameViewProps) {
  const [gameState, setGameState] = useState<GameState>(
    () => resumeData?.gameState ?? initializeGame(level),
  );
  const [showCompleted, setShowCompleted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(resumeData?.elapsedTime ?? 0);
  const [startTime] = useState(() => Date.now() - (resumeData?.elapsedTime ?? 0));
  const [isPaused, setIsPaused] = useState(false);
  const [, setPauseStartedAt] = useState<number | null>(null);
  const [totalPausedTime, setTotalPausedTime] = useState(0);
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [blockedInputCell, setBlockedInputCell] = useState<{ row: number; col: number } | null>(
    null,
  );
  const [hintedCell, setHintedCell] = useState<{ row: number; col: number } | null>(null);
  const blockedInputTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hintedCellTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingOneTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingOneTimestampRef = useRef<number | null>(null);

  const completedNumbers = useMemo(() => {
    const counts = new Map<number, number>();

    for (const row of gameState.cells) {
      for (const cell of row) {
        if (cell.isCorrect && cell.value !== null) {
          counts.set(cell.value, (counts.get(cell.value) ?? 0) + 1);
        }
      }
    }

    return new Set(
      Array.from({ length: level.gridSize }, (_, i) => i + 1).filter(
        (num) => (counts.get(num) ?? 0) >= level.gridSize,
      ),
    );
  }, [gameState.cells, level.gridSize]);

  const triggerBlockedInputFeedback = useCallback((row: number, col: number) => {
    if (blockedInputTimeoutRef.current) {
      clearTimeout(blockedInputTimeoutRef.current);
    }

    setBlockedInputCell(null);
    requestAnimationFrame(() => {
      setBlockedInputCell({ row, col });
      blockedInputTimeoutRef.current = setTimeout(() => {
        setBlockedInputCell(null);
        blockedInputTimeoutRef.current = null;
      }, 240);
    });
  }, []);

  const clearPendingOneInput = useCallback(() => {
    if (pendingOneTimeoutRef.current) {
      clearTimeout(pendingOneTimeoutRef.current);
      pendingOneTimeoutRef.current = null;
    }
    pendingOneTimestampRef.current = null;
  }, []);

  // Timer
  useEffect(() => {
    if (gameState.isComplete || isPaused) return;

    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startTime - totalPausedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, totalPausedTime, gameState.isComplete, isPaused]);

  // Handle completion
  useEffect(() => {
    if (gameState.isComplete && !showCompleted) {
      setTimeout(() => {
        setShowCompleted(true);
        onComplete(elapsedTime, gameState.mistakes);
      }, 500);
    }
  }, [gameState.isComplete, showCompleted, elapsedTime, gameState.mistakes, onComplete]);

  useEffect(() => {
    return () => {
      if (blockedInputTimeoutRef.current) {
        clearTimeout(blockedInputTimeoutRef.current);
      }
      if (hintedCellTimeoutRef.current) {
        clearTimeout(hintedCellTimeoutRef.current);
      }
      clearPendingOneInput();
    };
  }, [clearPendingOneInput]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.isComplete || isPaused) return;

      const { selectedCell } = gameState;

      // Arrow keys for navigation
      if (selectedCell && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        clearPendingOneInput();
        let newRow = selectedCell.row;
        let newCol = selectedCell.col;

        switch (e.key) {
          case 'ArrowUp':
            newRow = Math.max(0, newRow - 1);
            break;
          case 'ArrowDown':
            newRow = Math.min(level.gridSize - 1, newRow + 1);
            break;
          case 'ArrowLeft':
            newCol = Math.max(0, newCol - 1);
            break;
          case 'ArrowRight':
            newCol = Math.min(level.gridSize - 1, newCol + 1);
            break;
        }

        setGameState((prev) => selectCell(prev, newRow, newCol));
        return;
      }

      // Number input
      if (selectedCell) {
        const commitNumber = (num: number) => {
          if (completedNumbers.has(num)) {
            triggerBlockedInputFeedback(selectedCell.row, selectedCell.col);
            return;
          }
          setGameState((prev) => enterNumber(prev, selectedCell.row, selectedCell.col, num));
        };

        const commitPendingOne = () => {
          if (pendingOneTimestampRef.current === null) return;
          clearPendingOneInput();
          commitNumber(1);
        };

        const startPendingOne = () => {
          clearPendingOneInput();
          pendingOneTimestampRef.current = Date.now();
          pendingOneTimeoutRef.current = setTimeout(() => {
            if (pendingOneTimestampRef.current !== null) {
              commitPendingOne();
            }
          }, MULTI_DIGIT_INPUT_WINDOW_MS);
        };

        if (e.key === 'Delete' || e.key === 'Backspace') {
          clearPendingOneInput();
          setGameState((prev) => clearCell(prev, selectedCell.row, selectedCell.col));
          return;
        }

        if (level.gridSize === 16 && /^\d$/.test(e.key)) {
          const keyDigit = Number(e.key);
          const hasPendingOne = pendingOneTimestampRef.current !== null;
          const pendingIsFresh =
            hasPendingOne &&
            Date.now() - pendingOneTimestampRef.current <= MULTI_DIGIT_INPUT_WINDOW_MS;

          if (pendingIsFresh) {
            const combined = Number(`1${e.key}`);
            if (combined >= 10 && combined <= 16) {
              clearPendingOneInput();
              commitNumber(combined);
              return;
            }

            commitPendingOne();

            if (keyDigit >= 2 && keyDigit <= 9) {
              commitNumber(keyDigit);
            } else if (keyDigit === 1) {
              startPendingOne();
            }
            return;
          }

          if (hasPendingOne) {
            clearPendingOneInput();
          }

          if (keyDigit === 1) {
            startPendingOne();
            return;
          }

          if (keyDigit >= 2 && keyDigit <= 9) {
            commitNumber(keyDigit);
            return;
          }

          return;
        }

        const num = parseInt(e.key);
        if (!isNaN(num) && num >= 1 && num <= level.gridSize) {
          clearPendingOneInput();
          commitNumber(num);
          return;
        }

        // Letters A-G for 16x16 (10-16)
        if (level.gridSize === 16) {
          clearPendingOneInput();
          const letterCode = e.key.toUpperCase().charCodeAt(0);
          if (letterCode >= 65 && letterCode <= 71) {
            const num = letterCode - 55;
            commitNumber(num);
            return;
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    gameState,
    level.gridSize,
    isPaused,
    completedNumbers,
    triggerBlockedInputFeedback,
    clearPendingOneInput,
  ]);

  useEffect(() => {
    clearPendingOneInput();
  }, [gameState.selectedCell, clearPendingOneInput]);

  const resumeGame = useCallback(() => {
    clearPendingOneInput();
    setIsPauseModalOpen(false);
    setIsPaused((prev) => {
      if (!prev) return prev;
      return false;
    });
    setPauseStartedAt((prev) => {
      if (prev !== null) {
        setTotalPausedTime((current) => current + (Date.now() - prev));
      }
      return null;
    });
  }, [clearPendingOneInput]);

  const pauseGame = useCallback(() => {
    if (gameState.isComplete || isPaused) return;
    clearPendingOneInput();
    setElapsedTime(Date.now() - startTime - totalPausedTime);
    setPauseStartedAt(Date.now());
    setIsPaused(true);
    setIsPauseModalOpen(true);
  }, [gameState.isComplete, isPaused, startTime, totalPausedTime, clearPendingOneInput]);

  const handlePauseModalChange = useCallback(
    (open: boolean) => {
      if (open) {
        setIsPauseModalOpen(true);
        return;
      }
      resumeGame();
    },
    [resumeGame],
  );

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (gameState.isComplete || isPaused) return;
      clearPendingOneInput();
      setGameState((prev) => selectCell(prev, row, col));
    },
    [gameState.isComplete, isPaused, clearPendingOneInput],
  );

  const handleNumberClick = useCallback(
    (num: number) => {
      if (!gameState.selectedCell || gameState.isComplete || isPaused) return;
      clearPendingOneInput();
      const { row, col } = gameState.selectedCell;
      if (completedNumbers.has(num)) {
        triggerBlockedInputFeedback(row, col);
        return;
      }
      setGameState((prev) => enterNumber(prev, row, col, num));
    },
    [
      gameState.selectedCell,
      gameState.isComplete,
      isPaused,
      completedNumbers,
      triggerBlockedInputFeedback,
      clearPendingOneInput,
    ],
  );

  const handleClear = useCallback(() => {
    if (!gameState.selectedCell || gameState.isComplete || isPaused) return;
    clearPendingOneInput();
    const { row, col } = gameState.selectedCell;
    setGameState((prev) => clearCell(prev, row, col));
  }, [gameState.selectedCell, gameState.isComplete, isPaused, clearPendingOneInput]);

  const canUseHint = !isPaused && !gameState.isComplete && hintsUsed < MAX_HINTS;

  const handleHint = () => {
    if (!canUseHint) return;
    clearPendingOneInput();

    const hintCandidates = getHintCandidates(gameState);
    if (hintCandidates.length === 0) return;
    const hintedPosition = hintCandidates[Math.floor(Math.random() * hintCandidates.length)];

    setGameState((prev) => revealHintCell(prev, hintedPosition.row, hintedPosition.col));
    setHintsUsed((prev) => prev + 1);
    setHintedCell(hintedPosition);

    if (hintedCellTimeoutRef.current) {
      clearTimeout(hintedCellTimeoutRef.current);
    }

    hintedCellTimeoutRef.current = setTimeout(() => {
      setHintedCell(null);
      hintedCellTimeoutRef.current = null;
    }, 320);
  };

  const progress = getProgress(gameState);
  const formattedDifficulty = level.difficulty.charAt(0).toUpperCase() + level.difficulty.slice(1);

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6">
      <div className="mx-auto max-w-2xl space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => onBack(gameState, elapsedTime)} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Save & Exit</span>
          </Button>

          <div className="flex items-center gap-3 text-sm sm:gap-4">
            <div className="text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span className="font-mono">{formatTime(elapsedTime)}</span>
            </div>
            {!showCompleted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={pauseGame}
                aria-label="Pause game"
                className="text-muted-foreground h-8 w-8"
              >
                <Pause className="h-4 w-4" />
              </Button>
            )}
            <div className="text-muted-foreground flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4" />
              <span>{gameState.mistakes} mistakes</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="text-primary font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Game Grid */}
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

        {/* Completion overlay */}
        {showCompleted && (
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="space-y-4 py-6 text-center">
              <div className="flex justify-center gap-2">
                <Trophy className="text-primary h-8 w-8" />
                <Sparkles className="h-8 w-8 text-yellow-500" />
              </div>
              <div>
                <h2 className="text-foreground text-2xl font-bold">Puzzle Complete!</h2>
                <p className="text-muted-foreground mt-1">
                  You revealed the {level.name} in {formatTime(elapsedTime)}
                </p>
              </div>
              <div className="flex justify-center gap-4 text-sm">
                <div className="bg-secondary rounded-full px-3 py-1.5">
                  <span className="text-muted-foreground">Time: </span>
                  <span className="font-medium">{formatTime(elapsedTime)}</span>
                </div>
                <div className="bg-secondary rounded-full px-3 py-1.5">
                  <span className="text-muted-foreground">Mistakes: </span>
                  <span className="font-medium">{gameState.mistakes}</span>
                </div>
              </div>
              <Button onClick={() => onBack(gameState, elapsedTime)} className="mt-4">
                Play Another
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Keypad - hidden when complete */}
        {!showCompleted && (
          <div className="mx-auto w-full max-w-2xl">
            <NumberKeypad
              gridSize={level.gridSize}
              onNumberClick={handleNumberClick}
              onClear={handleClear}
              onHint={handleHint}
              hintsRemaining={MAX_HINTS - hintsUsed}
              canUseHint={canUseHint}
              completedNumbers={completedNumbers}
              disabled={!gameState.selectedCell || isPaused}
            />
          </div>
        )}

        {/* Instructions */}
        {!showCompleted && (
          <p className="text-muted-foreground text-center text-xs">
            Click a cell and enter a number. Use arrow keys to navigate.
          </p>
        )}
      </div>

      <Dialog open={isPauseModalOpen} onOpenChange={handlePauseModalChange}>
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
              <div className="mt-1 font-mono font-semibold">{formatTime(elapsedTime)}</div>
            </div>
            <div className="bg-muted rounded-md p-3">
              <div className="text-muted-foreground text-xs">Mistakes</div>
              <div className="mt-1 font-semibold">{gameState.mistakes}</div>
            </div>
            <div className="bg-muted rounded-md p-3">
              <div className="text-muted-foreground text-xs">Difficulty</div>
              <div className="mt-1 font-semibold">{formattedDifficulty}</div>
            </div>
            <div className="bg-muted rounded-md p-3">
              <div className="text-muted-foreground text-xs">Grid Size</div>
              <div className="mt-1 font-semibold">
                {level.gridSize} x {level.gridSize}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={resumeGame} className="w-full sm:w-auto">
              Resume Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
