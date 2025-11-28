import { computeBarCoordinates } from './bar-computer';

describe('computeBarCoordinates', () => {
  it('should calculate correct bar heights based on value ratio', () => {
    // Given
    const data = [
      { id: 1, label: 'A', value: 50 },
      { id: 2, label: 'B', value: 100 }, // Max Value
    ];
    const width = 200;
    const height = 100;
    const padding = 0;
    const barGap = 0;

    // When
    const result = computeBarCoordinates({
      data,
      width,
      height,
      padding,
      barGap,
    });

    // Then
    // 1. 값 100(Max)인 막대는 높이가 전체(100)여야 함
    expect(result[1].height).toBe(100);
    expect(result[1].y).toBe(0); // y는 위에서부터 시작하므로 0

    // 2. 값 50인 막대는 높이가 절반(50)이어야 함
    expect(result[0].height).toBe(50);
    expect(result[0].y).toBe(50); // 높이가 50이므로 y는 50 위치에서 시작
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

    // 높이는 (100 - 20) = 80 이어야 함
    expect(result[0].height).toBe(80);
    // x 좌표는 padding 만큼 밀려야 함
    expect(result[0].x).toBe(10);
  });
});
