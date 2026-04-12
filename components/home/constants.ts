import { Grid2x2, Grid3x3, type LucideIcon } from 'lucide-react';
import type { Difficulty, GridSize } from '@/lib/game-data';

export const gridSizes: { value: GridSize; label: string; icon: LucideIcon }[] = [
  { value: 9, label: '9 x 9', icon: Grid3x3 },
  { value: 16, label: '16 x 16', icon: Grid2x2 },
];

export const difficulties: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

export const difficultyStyles: Record<
  Difficulty,
  {
    card: string;
    selectedCard: string;
    label: string;
    selectedDot: string;
    dot: string;
  }
> = {
  easy: {
    card: 'border-emerald-300 bg-emerald-100/60 hover:border-emerald-400',
    selectedCard: 'border-emerald-500 bg-emerald-100/70',
    label: 'text-emerald-800',
    selectedDot: 'border-emerald-600 bg-emerald-600',
    dot: 'border-emerald-500/70',
  },
  medium: {
    card: 'border-amber-300 bg-amber-100/60 hover:border-amber-400',
    selectedCard: 'border-amber-500 bg-amber-100/70',
    label: 'text-amber-800',
    selectedDot: 'border-amber-600 bg-amber-600',
    dot: 'border-amber-500/70',
  },
  hard: {
    card: 'border-red-300 bg-red-100/60 hover:border-red-400',
    selectedCard: 'border-red-500 bg-red-100/70',
    label: 'text-red-800',
    selectedDot: 'border-red-600 bg-red-600',
    dot: 'border-red-500/70',
  },
};

export const previewStyles: Record<
  Difficulty,
  {
    frame: string;
    filled: string;
    empty: string;
  }
> = {
  easy: {
    frame: 'border-emerald-300/70 bg-emerald-100/30',
    filled: 'border-emerald-500/60 bg-emerald-500/55',
    empty: 'border-border/70 bg-background/70',
  },
  medium: {
    frame: 'border-amber-300/70 bg-amber-100/30',
    filled: 'border-amber-500/60 bg-amber-500/55',
    empty: 'border-border/70 bg-background/70',
  },
  hard: {
    frame: 'border-red-300/70 bg-red-100/25',
    filled: 'border-red-500/60 bg-red-500/55',
    empty: 'border-border/70 bg-background/70',
  },
};

export const revealFallbackBySize: Record<GridSize, Record<Difficulty, number>> = {
  9: {
    easy: 55,
    medium: 45,
    hard: 35,
  },
  16: {
    easy: 50,
    medium: 40,
    hard: 30,
  },
};

export const difficultySeed: Record<Difficulty, number> = {
  easy: 131,
  medium: 349,
  hard: 719,
};
