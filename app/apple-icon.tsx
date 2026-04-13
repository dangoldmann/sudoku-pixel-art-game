import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  const blockSize = 18;
  const step = 29;
  const start = 52;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
      }}
    >
      <div
        style={{
          width: 152,
          height: 152,
          borderRadius: 36,
          background: 'oklch(0.24 0.02 235)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {[
          [0, 0, '#14A8B2'],
          [1, 0, '#72CABB'],
          [2, 0, '#14A8B2'],
          [0, 1, '#72CABB'],
          [1, 1, '#109CA8'],
          [2, 1, '#72CABB'],
          [0, 2, '#14A8B2'],
          [1, 2, '#72CABB'],
          [2, 2, '#14A8B2'],
        ].map(([col, row, color], index) => (
          <div
            // Satori requires explicit keys for generated children.
            key={`block-${index}`}
            style={{
              position: 'absolute',
              left: start + Number(col) * step,
              top: start + Number(row) * step,
              width: blockSize,
              height: blockSize,
              borderRadius: 6,
              background: String(color),
            }}
          />
        ))}
      </div>
    </div>,
    {
      ...size,
    },
  );
}
