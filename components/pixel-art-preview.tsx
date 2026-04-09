'use client';

import type { GridSize } from '@/lib/game-data';

interface PixelArtPreviewProps {
  colors: string[][];
  gridSize: GridSize;
  size?: number;
}

export function PixelArtPreview({ colors, gridSize, size = 120 }: PixelArtPreviewProps) {
  const cellSize = size / gridSize;

  return (
    <div
      className="rounded-lg overflow-hidden shadow-lg"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
        gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
        width: size,
        height: size,
      }}
    >
      {colors.flat().map((color, index) => (
        <div key={index} style={{ backgroundColor: color }} />
      ))}
    </div>
  );
}
