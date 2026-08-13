import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';

import ShanghaiMarks from '~/components/shanghai/shanghai-marks';

describe('ShanghaiMarks component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders without crashing', () => {
    const { container } = render(<ShanghaiMarks darts={[]} editing={null} onSelect={() => {}} />);
    expect(container).toBeDefined();
  });

  it('renders formatted dart values', () => {
    const { getByText } = render(<ShanghaiMarks darts={[1, 0]} editing={null} onSelect={() => {}} />);
    expect(getByText('Ø')).toBeDefined();
    expect(getByText(1)).toBeDefined();
  });

  it('calls onSelect on mark button click', () => {
    const onSelect = vi.fn();
    const { getAllByRole } = render(<ShanghaiMarks darts={[1, 0]} editing={null} onSelect={onSelect} />);
    const buttons = getAllByRole('button');
    buttons.forEach((button) => fireEvent.click(button));
    expect(onSelect).toHaveBeenCalledTimes(2);
  });
});
