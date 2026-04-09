'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { SudokuGrid } from './sudoku-grid';
import { NumberKeypad } from './number-keypad';
import type { Level } from '@/lib/game-data';
import {
  initializeGame,
  enterNumber,
  clearCell,
  selectCell,
  getProgress,
  formatTime,
  type GameState,
} from '@/lib/sudoku-engine';
import { ArrowLeft, Clock, AlertCircle, Trophy, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GameViewProps {
  level: Level;
  resumeData?: { gameState: GameState; elapsedTime: number } | null;
  onBack: (gameState: GameState, elapsedTime: number) => void;
  onComplete: (timeElapsed: number, mistakes: number) => void;
}

export function GameView({ level, resumeData, onBack, onComplete }: GameViewProps) {
  const [gameState, setGameState] = useState<GameState>(() => 
    resumeData?.gameState ?? initializeGame(level)
  );
  const [showCompleted, setShowCompleted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(resumeData?.elapsedTime ?? 0);
  const [startTime] = useState(() => Date.now() - (resumeData?.elapsedTime ?? 0));

  // Timer
  useEffect(() => {
    if (gameState.isComplete) return;
    
    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [startTime, gameState.isComplete]);

  // Handle completion
  useEffect(() => {
    if (gameState.isComplete && !showCompleted) {
      setTimeout(() => {
        setShowCompleted(true);
        onComplete(elapsedTime, gameState.mistakes);
      }, 500);
    }
  }, [gameState.isComplete, showCompleted, elapsedTime, gameState.mistakes, onComplete]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.isComplete) return;
      
      const { selectedCell } = gameState;
      
      // Arrow keys for navigation
      if (selectedCell && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        let newRow = selectedCell.row;
        let newCol = selectedCell.col;
        
        switch (e.key) {
          case 'ArrowUp': newRow = Math.max(0, newRow - 1); break;
          case 'ArrowDown': newRow = Math.min(level.gridSize - 1, newRow + 1); break;
          case 'ArrowLeft': newCol = Math.max(0, newCol - 1); break;
          case 'ArrowRight': newCol = Math.min(level.gridSize - 1, newCol + 1); break;
        }
        
        setGameState(prev => selectCell(prev, newRow, newCol));
        return;
      }
      
      // Number input
      if (selectedCell) {
        const num = parseInt(e.key);
        if (!isNaN(num) && num >= 1 && num <= level.gridSize) {
          setGameState(prev => enterNumber(prev, selectedCell.row, selectedCell.col, num));
          return;
        }
        
        // Letters A-G for 16x16 (10-16)
        if (level.gridSize === 16) {
          const letterCode = e.key.toUpperCase().charCodeAt(0);
          if (letterCode >= 65 && letterCode <= 71) {
            const num = letterCode - 55;
            setGameState(prev => enterNumber(prev, selectedCell.row, selectedCell.col, num));
            return;
          }
        }
        
        // Delete/Backspace to clear
        if (e.key === 'Delete' || e.key === 'Backspace') {
          setGameState(prev => clearCell(prev, selectedCell.row, selectedCell.col));
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, level.gridSize]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (gameState.isComplete) return;
    setGameState(prev => selectCell(prev, row, col));
  }, [gameState.isComplete]);

  const handleNumberClick = useCallback((num: number) => {
    if (!gameState.selectedCell || gameState.isComplete) return;
    const { row, col } = gameState.selectedCell;
    setGameState(prev => enterNumber(prev, row, col, num));
  }, [gameState.selectedCell, gameState.isComplete]);

  const handleClear = useCallback(() => {
    if (!gameState.selectedCell || gameState.isComplete) return;
    const { row, col } = gameState.selectedCell;
    setGameState(prev => clearCell(prev, row, col));
  }, [gameState.selectedCell, gameState.isComplete]);

  const progress = getProgress(gameState);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-2xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => onBack(gameState, elapsedTime)} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Save & Exit</span>
          </Button>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{formatTime(elapsedTime)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <AlertCircle className="w-4 h-4" />
              <span>{gameState.mistakes} mistakes</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Game Grid */}
        <div className={cn(
          'flex justify-center transition-all duration-700',
          showCompleted && 'scale-105'
        )}>
          <SudokuGrid
            cells={gameState.cells}
            selectedCell={gameState.selectedCell}
            gridSize={level.gridSize}
            showCompleted={showCompleted}
            onCellClick={handleCellClick}
          />
        </div>

        {/* Completion overlay */}
        {showCompleted && (
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="py-6 text-center space-y-4">
              <div className="flex justify-center gap-2">
                <Trophy className="w-8 h-8 text-primary" />
                <Sparkles className="w-8 h-8 text-yellow-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Puzzle Complete!</h2>
                <p className="text-muted-foreground mt-1">
                  You revealed the {level.name} in {formatTime(elapsedTime)}
                </p>
              </div>
              <div className="flex justify-center gap-4 text-sm">
                <div className="px-3 py-1.5 rounded-full bg-secondary">
                  <span className="text-muted-foreground">Time: </span>
                  <span className="font-medium">{formatTime(elapsedTime)}</span>
                </div>
                <div className="px-3 py-1.5 rounded-full bg-secondary">
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
          <div className="max-w-sm mx-auto">
            <NumberKeypad
              gridSize={level.gridSize}
              onNumberClick={handleNumberClick}
              onClear={handleClear}
              disabled={!gameState.selectedCell}
            />
          </div>
        )}

        {/* Instructions */}
        {!showCompleted && (
          <p className="text-center text-xs text-muted-foreground">
            Click a cell and enter a number. Use arrow keys to navigate.
          </p>
        )}
      </div>
    </div>
  );
}
