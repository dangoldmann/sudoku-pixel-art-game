import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Difficulty, GridSize } from '@/lib/game-data';
import { difficulties, difficultyStyles, gridSizes } from './constants';

interface GameSetupCardProps {
  selectedSize: GridSize;
  selectedDifficulty: Difficulty;
  revealPercentagesByDifficulty: Record<Difficulty, number>;
  onSelectSize: (size: GridSize) => void;
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

export function GameSetupCard({
  selectedSize,
  selectedDifficulty,
  revealPercentagesByDifficulty,
  onSelectSize,
  onSelectDifficulty,
}: GameSetupCardProps) {
  return (
    <Card className="border-border/50 gap-0">
      <CardHeader className="pb-0">
        <CardTitle className="text-muted-foreground text-sm font-medium">Game Setup</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-4 pb-6">
        <section className="space-y-3">
          <h2 className="text-muted-foreground text-sm font-medium">Grid Size</h2>
          <div className="grid grid-cols-2 gap-3">
            {gridSizes.map(({ value, label, icon: Icon }) => (
              <Card
                key={value}
                className={cn(
                  'hover:border-primary/50 cursor-pointer py-0 transition-all duration-200',
                  selectedSize === value ? 'border-primary bg-primary/5' : 'border-border',
                )}
                onClick={() => onSelectSize(value)}
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
        </section>

        <section className="border-border/60 space-y-2 border-t pt-6">
          <h2 className="text-muted-foreground text-sm font-medium">Difficulty</h2>
          {difficulties.map(({ value, label }) => (
            <Card
              key={value}
              className={cn(
                'cursor-pointer py-0 transition-all duration-200',
                difficultyStyles[value].card,
                selectedDifficulty === value && difficultyStyles[value].selectedCard,
              )}
              onClick={() => onSelectDifficulty(value)}
            >
              <CardContent className="flex items-center justify-between p-4 px-4">
                <div>
                  <div
                    className={cn('font-medium transition-colors', difficultyStyles[value].label)}
                  >
                    {label}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {revealPercentagesByDifficulty[value]}% pre-filled
                  </div>
                </div>
                <div
                  className={cn(
                    'h-4 w-4 rounded-full border-2 transition-all',
                    selectedDifficulty === value
                      ? difficultyStyles[value].selectedDot
                      : difficultyStyles[value].dot,
                  )}
                >
                  {selectedDifficulty === value && (
                    <div className="bg-primary-foreground h-full w-full scale-50 rounded-full" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </CardContent>
    </Card>
  );
}
