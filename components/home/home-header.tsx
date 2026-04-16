export function HomeHeader() {
  const pixelCells = [
    'brand-pixel-active',
    'brand-pixel-soft',
    'brand-pixel-active',
    'brand-pixel-soft',
    'brand-pixel-active',
    'brand-pixel-soft',
    'brand-pixel-active',
    'brand-pixel-soft',
    'brand-pixel-active',
  ];

  return (
    <div className="flex items-center gap-3 lg:w-auto">
      <div className="shrink-0">
        <div className="brand-badge-surface flex h-11 w-11 items-center justify-center rounded-xl shadow-md">
          <div className="grid grid-cols-3 gap-0.5" aria-hidden="true">
            {pixelCells.map((pixelClass, index) => (
              <span
                key={`pixel-cell-${index}`}
                className={`h-1.5 w-1.5 rounded-[2px] ${pixelClass}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="min-w-0">
        <h1 className="text-foreground truncate text-xl font-bold tracking-tight sm:text-2xl">
          <span className="brand-title-accent">Pixel</span>{' '}
          <span className="text-foreground">Sudoku</span>
        </h1>
        <p className="text-muted-foreground hidden text-sm lg:block">
          Solve puzzles to reveal hidden pixel art masterpieces
        </p>
      </div>
    </div>
  );
}
