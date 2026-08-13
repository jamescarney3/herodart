import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { cleanup, render, fireEvent, waitFor } from '@testing-library/react';

import ShanghaiSetup from '~/components/shanghai/shanghai-setup';
import ShanghaiGame from '~/lib/shanghai/shanghai-game';
import { SCORING, ELIMINATION, END_WEDGE, TURN_ORDER } from '~/lib/shanghai';

const consoleMock = vi.spyOn(console, 'log').mockImplementation(() => void 0);

describe('ShanghaiSetup component', () => {
  let game: ShanghaiGame;

  beforeEach(() => {
    game = {
      staticPlayerOrder: [{ name: 'mac' }, { name: 'charlie' }] as ShanghaiGame['staticPlayerOrder'],
      createPlayer: vi.fn(),
      canStart: false,
      start: vi.fn(),
      shanghaiRules: {
        scoring: SCORING.MARKS,
        elimination: ELIMINATION.NONE,
        endWedge: END_WEDGE.TWENTY,
        turnOrder: TURN_ORDER.BY_SHOT,
      } as ShanghaiGame['shanghaiRules'],
    } as unknown as ShanghaiGame;
    consoleMock.mockReset();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<ShanghaiSetup game={game} />);
    expect(container).toBeDefined();
  });

  it('adds a player', () => {
    const { getByText, getByRole } = render(<ShanghaiSetup game={game} />);

    fireEvent.click(getByText('add player'));
    fireEvent.change(getByRole('textbox'), { target: { value: 'Artemis' } });
    fireEvent.click(getByText('enter'));
    fireEvent.click(getByText(6));
    fireEvent.click(getByText(7));
    fireEvent.click(getByText('enter'));

    expect(game.createPlayer).toHaveBeenCalled();
  });

  it('adds a player with enter key', () => {
    const { getByText, getByRole } = render(<ShanghaiSetup game={game} />);

    fireEvent.click(getByText('add player'));
    const nameInput = getByRole('textbox');
    fireEvent.change(nameInput, { target: { value: 'Artemis' } });
    fireEvent.keyUp(nameInput, { key: '' });
    fireEvent.keyUp(nameInput, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(getByText(1)).toBeDefined();
  });

  it('does not add a player with an invalid splash value', () => {
    const { getByText, getByRole } = render(<ShanghaiSetup game={game} />);

    fireEvent.click(getByText('add player'));
    fireEvent.change(getByRole('textbox'), { target: { value: 'Artemis' } });
    fireEvent.click(getByText('enter'));
    fireEvent.click(getByText(6));
    fireEvent.click(getByText('+'));
    fireEvent.click(getByText('enter'));

    waitFor(async () => expect(consoleMock).toHaveBeenCalled());
  });

  it('cancels adding a player before splash', () => {
    const { getByText } = render(<ShanghaiSetup game={game} />);
    fireEvent.click(getByText('add player'));
    fireEvent.click(getByText('cancel'));

    expect(getByText('add player')).toBeDefined();
  });

  it('does not cancel adding player while entering splash value', () => {
    const { getByText, queryByText, getByRole } = render(<ShanghaiSetup game={game} />);

    fireEvent.click(getByText('add player'));
    fireEvent.change(getByRole('textbox'), { target: { value: 'Artemis' } });
    fireEvent.click(getByText('enter'));
    fireEvent.click(getByText(6));
    fireEvent.click(getByText('back'));

    expect(queryByText('add player')).toBeNull();

    fireEvent.click(getByText('back'));
    expect(getByText('add player')).toBeDefined();
  });

  it('starts a game', () => {
    vi.spyOn(game, 'canStart', 'get').mockReturnValue(true);
    const { getByText } = render(<ShanghaiSetup game={game} />);

    fireEvent.click(getByText('start game'));

    expect(game.start).toHaveBeenCalled();
  });
});
