import type { Meta, StoryObj } from '@storybook/react';
import { BarChart } from './bar-chart';

const meta: Meta<typeof BarChart> = {
  component: BarChart,
  title: 'Charts/BarChart',
};
export default meta;

type Story = StoryObj<typeof BarChart>;

export const Primary: Story = {
  args: {
    width: 500,
    height: 300,
    data: [
      { id: 1, label: 'A', value: 100 },
      { id: 2, label: 'B', value: 200 },
      { id: 3, label: 'C', value: 150 },
      { id: 4, label: 'D', value: 130 },
      { id: 5, label: 'E', value: 0 },
      { id: 6, label: 'F', value: 40 },
      { id: 7, label: 'G', value: 100 },
      { id: 8, label: 'H', value: 230 },
      { id: 9, label: 'I', value: 20 },
      { id: 10, label: 'J', value: 10 },
    ],
  },
};
