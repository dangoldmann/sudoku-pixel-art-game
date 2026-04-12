import { Palette } from 'lucide-react';

export function HomeHeader() {
  return (
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
  );
}
