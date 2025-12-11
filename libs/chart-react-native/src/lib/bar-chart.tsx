import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Rect, Text as SvgText, G } from 'react-native-svg';
import { computeBarCoordinates, DataPoint } from '@berry-test-chart/core';

interface BarChartProps {
  data: DataPoint[];
  width: number;
  height: number;
}

export const BarChart: React.FC<BarChartProps> = ({ data, width, height }) => {
  const bars = useMemo(() => {
    return computeBarCoordinates({ data, width, height });
  }, [data, width, height]);

  return (
    <View>
      <Svg width={width} height={height} style={{ backgroundColor: '#f3f4f6' }}>
        {bars.map((bar) => (
          <G key={bar.data.id}>
            <Rect
              x={bar.x}
              y={bar.y}
              width={bar.width}
              height={bar.height}
              fill={bar.color}
              rx={4}
              ry={4}
            />
            <SvgText
              x={bar.x + bar.width / 2}
              y={height - 5}
              textAnchor="middle"
              fontSize={12}
              fill="#666"
            >
              {bar.data.label}
            </SvgText>
          </G>
        ))}
      </Svg>
    </View>
  );
};
