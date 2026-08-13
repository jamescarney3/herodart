import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render } from '@testing-library/react';

import ScoreToast from '~/components/legs/score-toast';
import { LEGS_STRIKE, LEGS_ELIMINATION, LEGS_SCORE } from '~/lib/utils';
import type LegsGame from '~/lib/legs/legs-game';

describe('ScoreToast', () => {
  let mockGame: LegsGame;

  beforeEach(() => {
    // Reset all mocks before each test
    mockGame = vi.mockObject({
      scoreWouldEliminateCurrentPlayer: vi.fn(),
      scoreWouldBeStrike: vi.fn(),
    } as unknown as LegsGame);
    Object.defineProperty(window, 'innerWidth', { value: 768 });
  });

  it('renders empty when no score provided', () => {
    const { container } = render(<ScoreToast game={mockGame} />);
    expect(container.textContent).toBe('');
    const firstChild = container.firstChild as HTMLElement;
    expect(firstChild.classList).toContain('fixed');
    expect(firstChild.classList).not.toContain('transition-transform');
  });

  it('renders valid score content when score is valid', () => {
    vi.mocked(mockGame.scoreWouldEliminateCurrentPlayer).mockReturnValue(false);
    vi.mocked(mockGame.scoreWouldBeStrike).mockReturnValue(false);

    const { container } = render(<ScoreToast game={mockGame} score={20} />);
    expect(container.textContent).toBe(LEGS_SCORE);
  });

  it('renders eliminated content for eliminating score', () => {
    vi.mocked(mockGame.scoreWouldEliminateCurrentPlayer).mockReturnValue(true);

    const { container } = render(<ScoreToast game={mockGame} score={181} />);
    expect(container.textContent).toBe(LEGS_ELIMINATION);
  });

  it('renders strike incurred content for strike score', () => {
    vi.mocked(mockGame.scoreWouldEliminateCurrentPlayer).mockReturnValue(false);
    vi.mocked(mockGame.scoreWouldBeStrike).mockReturnValue(true);

    const { container } = render(<ScoreToast game={mockGame} score={0} />);
    expect(container.textContent).toBe(LEGS_STRIKE);
  });

  it('applies animation classes when scoring', () => {
    const { container } = render(<ScoreToast game={mockGame} score={20} />);
    const firstChild = container.firstChild as HTMLElement;
    expect(firstChild.classList).toContain('transition-transform');
  });
});
