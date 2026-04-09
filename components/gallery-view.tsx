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
  const completedIds = new Set(completedLevels.map(l => l.levelId));

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gallery</h1>
            <p className="text-sm text-muted-foreground">
              {completedLevels.length} of {levels.length} artworks unlocked
            </p>
          </div>
        </div>

        {/* Empty state */}
        {completedLevels.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Lock className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                No artworks yet
              </h3>
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
            <h2 className="text-lg font-semibold text-foreground">Completed</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {completedLevels.map((completion) => {
                const level = getLevelById(completion.levelId);
                if (!level) return null;
                
                return (
                  <Card
                    key={level.id}
                    className="overflow-hidden group hover:border-primary/50 transition-colors py-0"
                  >
                    <CardContent className="p-0 px-0">
                      <div className="aspect-square bg-muted flex items-center justify-center p-4">
                        <PixelArtPreview
                          colors={level.pixelColors}
                          gridSize={level.gridSize}
                          size={Math.min(140, 100)}
                        />
                      </div>
                      <div className="p-3 border-t border-border">
                        <h3 className="font-medium text-foreground text-sm">
                          {level.name}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(completion.timeElapsed)}
                          </span>
                          <span className="flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
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
            <h2 className="text-lg font-semibold text-muted-foreground">Locked</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {levels
                .filter(level => !completedIds.has(level.id))
                .map((level) => (
                  <Card
                    key={level.id}
                    className="overflow-hidden opacity-60 py-0"
                  >
                    <CardContent className="p-0 px-0">
                      <div className="aspect-square bg-muted/50 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/80" />
                        <Lock className="w-8 h-8 text-muted-foreground/50 relative z-10" />
                      </div>
                      <div className="p-3 border-t border-border/50">
                        <h3 className="font-medium text-muted-foreground text-sm">
                          ???
                        </h3>
                        <div className="text-xs text-muted-foreground/60 mt-1">
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
