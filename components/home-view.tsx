'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { GridSize, Difficulty } from '@/lib/game-data';
import { Grid3x3, Grid2x2, Palette, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HomeViewProps {
  onStartGame: (gridSize: GridSize, difficulty: Difficulty) => void;
  onOpenGallery: () => void;
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

export function HomeView({ onStartGame, onOpenGallery, completedCount }: HomeViewProps) {
  const [selectedSize, setSelectedSize] = useState<GridSize>(9);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center shadow-lg shadow-primary/25">
                <Palette className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-secondary border-2 border-background flex items-center justify-center">
                <span className="text-xs font-bold">9</span>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Pixel Sudoku
          </h1>
          <p className="text-muted-foreground text-balance">
            Solve puzzles to reveal hidden pixel art masterpieces
          </p>
        </div>

        {/* Grid Size Selection */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Grid Size
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-3">
              {gridSizes.map(({ value, label, icon: Icon }) => (
                <Card
                  key={value}
                  className={cn(
                    'cursor-pointer transition-all duration-200 hover:border-primary/50 py-0',
                    selectedSize === value
                      ? 'border-primary bg-primary/5'
                      : 'border-border'
                  )}
                  onClick={() => setSelectedSize(value)}
                >
                  <CardContent className="flex items-center justify-center gap-3 p-4 px-4">
                    <Icon className={cn(
                      'h-5 w-5 transition-colors',
                      selectedSize === value ? 'text-primary' : 'text-muted-foreground'
                    )} />
                    <span className={cn(
                      'font-medium transition-colors',
                      selectedSize === value ? 'text-foreground' : 'text-muted-foreground'
                    )}>
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
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Difficulty
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {difficulties.map(({ value, label, description }) => (
              <Card
                key={value}
                className={cn(
                  'cursor-pointer transition-all duration-200 hover:border-primary/50 py-0',
                  selectedDifficulty === value
                    ? 'border-primary bg-primary/5'
                    : 'border-border'
                )}
                onClick={() => setSelectedDifficulty(value)}
              >
                <CardContent className="flex items-center justify-between p-4 px-4">
                  <div>
                    <div className={cn(
                      'font-medium transition-colors',
                      selectedDifficulty === value ? 'text-foreground' : 'text-muted-foreground'
                    )}>
                      {label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {description}
                    </div>
                  </div>
                  <div className={cn(
                    'w-4 h-4 rounded-full border-2 transition-all',
                    selectedDifficulty === value
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                  )}>
                    {selectedDifficulty === value && (
                      <div className="w-full h-full rounded-full bg-primary-foreground scale-50" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={() => onStartGame(selectedSize, selectedDifficulty)}
            className="w-full h-12 text-base font-semibold gap-2"
            size="lg"
          >
            <Play className="w-5 h-5" />
            Start Game
          </Button>
          
          <Button
            variant="outline"
            onClick={onOpenGallery}
            className="w-full"
          >
            <Palette className="w-4 h-4 mr-2" />
            Gallery
            {completedCount > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                {completedCount}
              </span>
            )}
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Each correct number reveals part of a hidden pixel art image
        </p>
      </div>
    </div>
  );
}
