'use client';

import { useMemo, useState } from 'react';
import type { Difficulty, GridSize } from '@/lib/game-data';
import { difficulties } from '@/components/home/constants';
import { GameSetupCard } from '@/components/home/game-setup-card';
import { HomeActionButtons } from '@/components/home/home-action-buttons';
import { HomeHeader } from '@/components/home/home-header';
import { PuzzlePreviewCard } from '@/components/home/puzzle-preview-card';
import { getRevealPercentagesByDifficulty } from '@/components/home/preview-utils';
import type { HomeViewProps } from '@/components/home/types';

export function HomeView({
  onStartGame,
  onOpenGallery,
  onResumeGame,
  savedGame,
  completedCount,
}: HomeViewProps) {
  const [selectedSize, setSelectedSize] = useState<GridSize>(9);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const revealPercentagesByDifficulty = useMemo(
    () => getRevealPercentagesByDifficulty(selectedSize),
    [selectedSize],
  );
  const selectedDifficultyLabel =
    difficulties.find(({ value }) => value === selectedDifficulty)?.label ?? 'Easy';
  const selectedRevealPercentage = revealPercentagesByDifficulty[selectedDifficulty];

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-5xl space-y-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <HomeHeader />
          <HomeActionButtons
            selectedSize={selectedSize}
            selectedDifficulty={selectedDifficulty}
            savedGame={savedGame}
            completedCount={completedCount}
            onStartGame={onStartGame}
            onOpenGallery={onOpenGallery}
            onResumeGame={onResumeGame}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-stretch lg:gap-6">
          <GameSetupCard
            selectedSize={selectedSize}
            selectedDifficulty={selectedDifficulty}
            revealPercentagesByDifficulty={revealPercentagesByDifficulty}
            onSelectSize={setSelectedSize}
            onSelectDifficulty={setSelectedDifficulty}
          />

          <div className="h-full">
            <PuzzlePreviewCard
              selectedSize={selectedSize}
              selectedDifficultyLabel={selectedDifficultyLabel}
              selectedDifficulty={selectedDifficulty}
              selectedRevealPercentage={selectedRevealPercentage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
