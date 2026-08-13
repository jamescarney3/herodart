import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';

import LegsPlayerCard from '~/components/legs/player-card';
import type LegsPlayer from '~/lib/legs/legs-player';
import { LEGS_ACTIVE_INDICATOR, LEGS_STRIKE } from '~/lib/utils';

describe('LegsPlayerCard', () => {
  beforeEach(() => {
    // mock getBoundingClientRect so offsets are deterministic
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function () {
      return { top: 0, bottom: 20, height: 20, left: 0, right: 0, width: 0, x: 0, y: 0 } as unknown as DOMRect;
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('renders player name and strikes', () => {
    const player = { name: 'Candide', strikes: 2 } as LegsPlayer;
    const game = {
      currentPlayer: null,
      scoreWouldEliminateCurrentPlayer: vi.fn().mockReturnValue(false),
    } as unknown as LegsPlayer['legsGame'];

    const { getByText, getAllByText } = render(<LegsPlayerCard player={player} game={game} />);

    expect(getByText('Candide')).toBeTruthy();
    expect(getAllByText(LEGS_STRIKE).length).toBe(player.strikes);
  });

  it('renders current player indicator when not scoring and current player', () => {
    const player = { name: 'Pangloss', strikes: 0 } as LegsPlayer;
    const game = {
      currentPlayer: player,
      scoreWouldEliminateCurrentPlayer: vi.fn().mockReturnValue(false),
    } as unknown as LegsPlayer['legsGame'];
    const { getByText } = render(
      <div>
        <LegsPlayerCard player={player} game={game} score={0} />
      </div>,
    );

    const card = getByText(LEGS_ACTIVE_INDICATOR).parentElement as HTMLElement;
    expect(card).toBeTruthy();
  });

  it('adds transition and translation classes and style when scoring and current player', () => {
    const player = { name: 'Pangloss', strikes: 0 } as LegsPlayer;
    const game = {
      currentPlayer: player,
      scoreWouldEliminateCurrentPlayer: vi.fn().mockReturnValue(false),
    } as unknown as LegsPlayer['legsGame'];

    const { getByText } = render(
      <div>
        <LegsPlayerCard player={player} game={game} scoring score={0} />
        <LegsPlayerCard player={{ name: 'other' } as LegsPlayer} game={game} />
      </div>,
    );

    const card = getByText('Pangloss').parentElement as HTMLElement;
    expect(card).toBeTruthy();

    // transition classes should be present
    expect(card.className).toContain('transition');
    // vertical translation class and calculated style prop should be present
    expect(card.className).toContain('!translate-y-[var(--translation-offset)]');
    expect(card.style.getPropertyValue('--translation-offset')).toBeTruthy();
  });

  it('when scoring and scoring would eliminate current player translates out', () => {
    const player = { name: 'Cacambo', strikes: 1 } as LegsPlayer;
    const game = {
      currentPlayer: player,
      scoreWouldEliminateCurrentPlayer: vi.fn().mockReturnValue(true),
    } as unknown as LegsPlayer['legsGame'];

    const { getByText } = render(
      <div>
        <LegsPlayerCard player={player} game={game} scoring score={10} />
        <LegsPlayerCard player={{ name: 'other' } as LegsPlayer} game={game} />
      </div>,
    );

    const card = getByText('Cacambo').parentElement as HTMLElement;
    expect(card).toBeTruthy();

    // horizontal translation class should be present
    expect(card.className).toContain('translate-x-[200%]');
  });
});
