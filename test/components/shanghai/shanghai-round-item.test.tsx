import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';

import ShanghaiRoundItem from '~/components/shanghai/shanghai-round-item';

describe('ShanghaiRoundItem component', () => {
  let round;

  beforeEach(() => {
    round = { wedge: 17, marks: 9, player: { name: 'boromir' }};
  });

  afterEach(cleanup);

  it('renders without crashing', () => {
    const { container } = render(<ShanghaiRoundItem round={round} />);
    expect(container).toBeDefined();
  });

  it('renders while editing round', () => {
    const { container } = render(<ShanghaiRoundItem round={round} editingRound={round} />);
    expect(container).toBeDefined();
  });

  it('calls onClick callback', () => {
    const handleClick = vi.fn();
    const { container } = render(<ShanghaiRoundItem round={round} onClick={handleClick} />);
    fireEvent.click(container.firstChild);
    expect(handleClick).toHaveBeenCalled();
  });
});
