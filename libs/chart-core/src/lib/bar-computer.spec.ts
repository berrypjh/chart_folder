import { computeBarCoordinates } from './bar-computer';

describe('computeBarCoordinates', () => {
  it('should calculate correct bar heights based on value ratio', () => {
    const data = [
      { id: 1, label: 'A', value: 50 },
      { id: 2, label: 'B', value: 100 },
    ];
    const width = 200;
    const height = 100;
    const padding = 0;
    const barGap = 0;

    const result = computeBarCoordinates({
      data,
      width,
      height,
      padding,
      barGap,
    });

    expect(result[1].height).toBe(100);
    expect(result[1].y).toBe(0);

    expect(result[0].height).toBe(50);
    expect(result[0].y).toBe(50);
  });

  it('should respect padding', () => {
    const data = [{ id: 1, label: 'A', value: 100 }];
    const padding = 10;
    const result = computeBarCoordinates({
      data,
      width: 100,
      height: 100,
      padding,
    });

    expect(result[0].height).toBe(80);
    expect(result[0].x).toBe(10);
  });
});
