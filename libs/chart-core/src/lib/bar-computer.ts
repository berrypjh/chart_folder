export interface DataPoint {
  id: string | number;
  value: number;
  label: string;
}

export interface BarGeometry {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  data: DataPoint;
}

interface ComputeOptions {
  data: DataPoint[];
  width: number;
  height: number;
  padding?: number;
  barGap?: number;
}

export function computeBarCoordinates(options: ComputeOptions): BarGeometry[] {
  const { data, width, height, padding = 20, barGap = 10 } = options;

  const effectiveWidth = width - padding * 2;
  const effectiveHeight = height - padding * 2;

  const maxValue = Math.max(...data.map((d) => d.value), 0);

  const totalGapWidth = barGap * (data.length - 1);
  const barWidth = (effectiveWidth - totalGapWidth) / data.length;

  return data.map((point, index) => {
    const ratio = point.value / maxValue;
    const barHeight = effectiveHeight * ratio;

    return {
      x: padding + index * (barWidth + barGap),
      y: height - padding - barHeight,
      width: barWidth,
      height: barHeight,
      color: '#3b82f6',
      data: point,
    };
  });
}
