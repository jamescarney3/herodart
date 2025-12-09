import { describe, it, expect, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';

import ShanghaiKeypad from '~/components/shanghai/shanghai-keypad';

describe('ShanghaiMarks component', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders without crashing', () => {
    const { container } = render(<ShanghaiKeypad />);
    expect(container).toBeDefined();
  });

  it('calls onClickNumber on number button clicks', () => {
    const handleKeypadClick = vi.fn();
    const { getAllByRole } = render(<ShanghaiKeypad onClickNumber={handleKeypadClick} />);
    const buttons = getAllByRole('button');
    buttons.forEach((button) => {
      fireEvent.click(button);
    });

    expect(handleKeypadClick).toHaveBeenCalledTimes(4);
    expect(handleKeypadClick).toHaveBeenCalledWith(1);
    expect(handleKeypadClick).toHaveBeenCalledWith(2);
    expect(handleKeypadClick).toHaveBeenCalledWith(3);
    expect(handleKeypadClick).toHaveBeenCalledWith(0);
  });
});
