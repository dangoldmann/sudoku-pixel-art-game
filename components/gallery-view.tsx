'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PixelArtPreview } from './pixel-art-preview';
import { levels, getLevelById } from '@/lib/game-data';
import { formatTime } from '@/lib/sudoku-engine';
import type { CompletedLevel } from '@/hooks/use-game-storage';
import { ArrowLeft, Clock, AlertCircle, Lock } from 'lucide-react';

interface GalleryViewProps {
  completedLevels: CompletedLevel[];
  onBack: () => void;
}

export function GalleryView({ completedLevels, onBack }: GalleryViewProps) {
  const completedIds = new Set(completedLevels.map((l) => l.levelId));

  return (
    <div className="bg-background min-h-screen p-4 sm:p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div>
            <h1 className="text-foreground text-2xl font-bold">Gallery</h1>
            <p className="text-muted-foreground text-sm">
              {completedLevels.length} of {levels.length} artworks unlocked
            </p>
          </div>
        </div>

        {/* Empty state */}
        {completedLevels.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Lock className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
              <h3 className="text-foreground mb-2 text-lg font-medium">No artworks yet</h3>
              <p className="text-muted-foreground mb-4">
                Complete puzzles to unlock pixel art for your gallery
              </p>
              <Button onClick={onBack}>Start Playing</Button>
            </CardContent>
          </Card>
        )}

        {/* Completed artworks */}
        {completedLevels.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-foreground text-lg font-semibold">Completed</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {completedLevels.map((completion) => {
                const level = getLevelById(completion.levelId);
                if (!level) return null;

                return (
                  <Card
                    key={level.id}
                    className="group hover:border-primary/50 overflow-hidden py-0 transition-colors"
                  >
                    <CardContent className="p-0 px-0">
                      <div className="bg-muted flex aspect-square items-center justify-center p-4">
                        <PixelArtPreview
                          colors={level.pixelColors}
                          gridSize={level.gridSize}
                          size={Math.min(140, 100)}
                        />
                      </div>
                      <div className="border-border border-t p-3">
                        <h3 className="text-foreground text-sm font-medium">{level.name}</h3>
                        <div className="text-muted-foreground mt-1 flex items-center gap-3 text-xs">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatTime(completion.timeElapsed)}
                          </span>
                          <span className="flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {completion.mistakes}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Locked artworks */}
        {levels.length > completedLevels.length && (
          <div className="space-y-4">
            <h2 className="text-muted-foreground text-lg font-semibold">Locked</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {levels
                .filter((level) => !completedIds.has(level.id))
                .map((level) => (
                  <Card key={level.id} className="overflow-hidden py-0 opacity-60">
                    <CardContent className="p-0 px-0">
                      <div className="bg-muted/50 relative flex aspect-square items-center justify-center">
                        <div className="from-muted to-muted/80 absolute inset-0 bg-gradient-to-br" />
                        <Lock className="text-muted-foreground/50 relative z-10 h-8 w-8" />
                      </div>
                      <div className="border-border/50 border-t p-3">
                        <h3 className="text-muted-foreground text-sm font-medium">???</h3>
                        <div className="text-muted-foreground/60 mt-1 text-xs">
                          {level.gridSize}x{level.gridSize} / {level.difficulty}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
