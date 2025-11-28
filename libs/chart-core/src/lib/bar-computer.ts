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
  width: number; // 캔버스/컨테이너 너비
  height: number; // 캔버스/컨테이너 높이
  padding?: number; // 차트 내부 여백
  barGap?: number; // 막대 사이 간격
}

/**
 * 데이터를 받아 렌더링 가능한 사각형(Rect) 좌표 배열을 반환합니다.
 */
export function computeBarCoordinates(options: ComputeOptions): BarGeometry[] {
  const { data, width, height, padding = 20, barGap = 10 } = options;

  // 그릴 수 있는 유효 영역 계산
  const effectiveWidth = width - padding * 2;
  const effectiveHeight = height - padding * 2;

  // Y축 스케일 계산 (Max Value 찾기)
  const maxValue = Math.max(...data.map((d) => d.value), 0);

  // 막대 하나의 너비 계산
  const totalGapWidth = barGap * (data.length - 1);
  const barWidth = (effectiveWidth - totalGapWidth) / data.length;

  return data.map((point, index) => {
    // 값에 따른 막대 높이 비율 계산 (0 ~ 1)
    const ratio = point.value / maxValue;
    const barHeight = effectiveHeight * ratio;

    return {
      x: padding + index * (barWidth + barGap),
      // SVG 좌표계는 왼쪽 위가 (0,0)이므로 y값을 뒤집어서 계산
      y: height - padding - barHeight,
      width: barWidth,
      height: barHeight,
      color: '#3b82f6', // 기본 컬러 (Blue-500)
      data: point,
    };
  });
}
