import { render } from '@testing-library/react';
import { BarChart } from './bar-chart';

const mockData = [
  { id: 1, label: 'A', value: 10 },
  { id: 2, label: 'B', value: 20 },
];

describe('BarChart Component', () => {
  it('should render correct number of bars', () => {
    const { container } = render(
      <BarChart width={300} height={200} data={mockData} />
    );

    const bars = container.querySelectorAll('rect');
    expect(bars.length).toBe(2);
  });

  it('should render labels', () => {
    const { getByText } = render(
      <BarChart width={300} height={200} data={mockData} />
    );

    expect(getByText('A')).toBeTruthy();
    expect(getByText('B')).toBeTruthy();
  });
});
