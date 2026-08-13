import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';

import ShanghaiRoundItem from '~/components/shanghai/shanghai-round-item';
import ShanghaiRound from '~/lib/shanghai/shanghai-round';

describe('ShanghaiRoundItem component', () => {
  let round: ShanghaiRound;

  beforeEach(() => {
    round = { wedge: 17, marks: 9, shanghaiPlayer: { name: 'boromir' } } as ShanghaiRound;
  });

  afterEach(cleanup);

  it('renders without crashing', () => {
    const { container } = render(<ShanghaiRoundItem round={round} editingRound={null} onClick={() => {}} />);
    expect(container).toBeDefined();
  });

  it('renders while editing round', () => {
    const { container } = render(<ShanghaiRoundItem round={round} editingRound={round} onClick={() => {}} />);
    expect(container).toBeDefined();
  });

  it('calls onClick callback', () => {
    const handleClick = vi.fn();
    const { container } = render(<ShanghaiRoundItem round={round} onClick={handleClick} editingRound={null} />);
    fireEvent.click(container.firstChild as HTMLElement);
    expect(handleClick).toHaveBeenCalled();
  });
});
