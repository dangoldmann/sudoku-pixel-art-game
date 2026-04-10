'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { GridSize, Difficulty } from '@/lib/game-data';
import type { SavedGame } from '@/hooks/use-game-storage';
import { Grid3x3, Grid2x2, Palette, Play, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatTime, getProgress } from '@/lib/sudoku-engine';

interface HomeViewProps {
  onStartGame: (gridSize: GridSize, difficulty: Difficulty) => void;
  onOpenGallery: () => void;
  onResumeGame: (saved: SavedGame) => void;
  savedGame: SavedGame | null;
  completedCount: number;
}

const gridSizes: { value: GridSize; label: string; icon: typeof Grid3x3 }[] = [
  { value: 9, label: '9 x 9', icon: Grid3x3 },
  { value: 16, label: '16 x 16', icon: Grid2x2 },
];

const difficulties: { value: Difficulty; label: string; description: string }[] = [
  { value: 'easy', label: 'Easy', description: '55% pre-filled' },
  { value: 'medium', label: 'Medium', description: '45% pre-filled' },
  { value: 'hard', label: 'Hard', description: '35% pre-filled' },
];

export function HomeView({
  onStartGame,
  onOpenGallery,
  onResumeGame,
  savedGame,
  completedCount,
}: HomeViewProps) {
  const [selectedSize, setSelectedSize] = useState<GridSize>(9);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="space-y-3 text-center">
          <div className="flex justify-center">
            <div className="relative">
              <div className="from-primary/80 to-primary shadow-primary/25 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br shadow-lg">
                <Palette className="text-primary-foreground h-8 w-8" />
              </div>
              <div className="bg-secondary border-background absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-lg border-2">
                <span className="text-xs font-bold">9</span>
              </div>
            </div>
          </div>
          <h1 className="text-foreground text-3xl font-bold tracking-tight">Pixel Sudoku</h1>
          <p className="text-muted-foreground text-balance">
            Solve puzzles to reveal hidden pixel art masterpieces
          </p>
        </div>

        {/* Grid Size Selection */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm font-medium">Grid Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {gridSizes.map(({ value, label, icon: Icon }) => (
                <Card
                  key={value}
                  className={cn(
                    'hover:border-primary/50 cursor-pointer py-0 transition-all duration-200',
                    selectedSize === value ? 'border-primary bg-primary/5' : 'border-border',
                  )}
                  onClick={() => setSelectedSize(value)}
                >
                  <CardContent className="flex items-center justify-center gap-3 p-4 px-4">
                    <Icon
                      className={cn(
                        'h-5 w-5 transition-colors',
                        selectedSize === value ? 'text-primary' : 'text-muted-foreground',
                      )}
                    />
                    <span
                      className={cn(
                        'font-medium transition-colors',
                        selectedSize === value ? 'text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      {label}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Difficulty Selection */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-sm font-medium">Difficulty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {difficulties.map(({ value, label, description }) => (
              <Card
                key={value}
                className={cn(
                  'hover:border-primary/50 cursor-pointer py-0 transition-all duration-200',
                  selectedDifficulty === value ? 'border-primary bg-primary/5' : 'border-border',
                )}
                onClick={() => setSelectedDifficulty(value)}
              >
                <CardContent className="flex items-center justify-between p-4 px-4">
                  <div>
                    <div
                      className={cn(
                        'font-medium transition-colors',
                        selectedDifficulty === value ? 'text-foreground' : 'text-muted-foreground',
                      )}
                    >
                      {label}
                    </div>
                    <div className="text-muted-foreground text-xs">{description}</div>
                  </div>
                  <div
                    className={cn(
                      'h-4 w-4 rounded-full border-2 transition-all',
                      selectedDifficulty === value
                        ? 'border-primary bg-primary'
                        : 'border-muted-foreground',
                    )}
                  >
                    {selectedDifficulty === value && (
                      <div className="bg-primary-foreground h-full w-full scale-50 rounded-full" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Resume Game */}
        {savedGame && (
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="text-foreground text-sm font-medium">Continue Game</div>
                  <div className="text-muted-foreground mt-0.5 text-xs">
                    {savedGame.level.gridSize}x{savedGame.level.gridSize}{' '}
                    {savedGame.level.difficulty} - {getProgress(savedGame.gameState)}% complete -{' '}
                    {formatTime(savedGame.elapsedTime)}
                  </div>
                </div>
                <Button
                  onClick={() => onResumeGame(savedGame)}
                  size="sm"
                  className="shrink-0 gap-1.5"
                >
                  <RotateCcw className="h-4 w-4" />
                  Resume
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={() => onStartGame(selectedSize, selectedDifficulty)}
            className="h-12 w-full gap-2 text-base font-semibold"
            size="lg"
          >
            <Play className="h-5 w-5" />
            {savedGame ? 'New Game' : 'Start Game'}
          </Button>

          <Button variant="outline" onClick={onOpenGallery} className="w-full">
            <Palette className="mr-2 h-4 w-4" />
            Gallery
            {completedCount > 0 && (
              <span className="bg-primary/10 text-primary ml-2 rounded-full px-2 py-0.5 text-xs font-medium">
                {completedCount}
              </span>
            )}
          </Button>
        </div>

        {/* Footer */}
        <p className="text-muted-foreground text-center text-xs">
          Each correct number reveals part of a hidden pixel art image
        </p>
      </div>
    </div>
  );
}
