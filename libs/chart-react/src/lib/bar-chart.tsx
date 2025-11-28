import React, { useMemo } from 'react';
import { computeBarCoordinates, DataPoint } from '@my-chart/core';

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
    <svg width={width} height={height} style={{ backgroundColor: '#f3f4f6' }}>
      {bars.map((bar) => (
        <g key={bar.data.id} className="bar-group">
          <rect
            x={bar.x}
            y={bar.y}
            width={bar.width}
            height={bar.height}
            fill={bar.color}
            rx={4}
            ry={4}
            className="transition-all duration-300 hover:opacity-80"
          />
          <text
            x={bar.x + bar.width / 2}
            y={height - 5}
            textAnchor="middle"
            fontSize={12}
            fill="#666"
          >
            {bar.data.label}
          </text>
        </g>
      ))}
    </svg>
  );
};
