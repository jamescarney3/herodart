import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { cleanup, render, fireEvent } from '@testing-library/react';

import ShanghaiRules from '~/components/shanghai/shanghai-rules';
import { SCORING, ELIMINATION, END_WEDGE, TURN_ORDER } from '~/lib/shanghai';

interface MockGame {
  id: string;
  rules: {
    scoring: SCORING;
    elimination: ELIMINATION;
    endWedge: END_WEDGE;
    turnOrder: TURN_ORDER;
  };
}

describe('ShanghaiRules component', () => {
  let game: MockGame;

  beforeEach(() => {
    game = {
      id: 'test-game',
      rules: {
        scoring: SCORING.MARKS,
        elimination: ELIMINATION.NONE,
        endWedge: END_WEDGE.TWENTY,
        turnOrder: TURN_ORDER.BY_SHOT,
      },
    };
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const onConfirm = vi.fn();
    const { container } = render(<ShanghaiRules game={game} onConfirm={onConfirm} />);
    expect(container).toBeDefined();
  });

  it('renders all rule fieldsets with legends', () => {
    const onConfirm = vi.fn();
    const { getByText } = render(<ShanghaiRules game={game} onConfirm={onConfirm} />);

    expect(getByText('Scoring')).toBeDefined();
    expect(getByText('Elimination')).toBeDefined();
    expect(getByText('End Wedge')).toBeDefined();
    expect(getByText('Turn Order')).toBeDefined();
  });

  it('initializes with default rule values', () => {
    const onConfirm = vi.fn();
    const { getByText } = render(<ShanghaiRules game={game} onConfirm={onConfirm} />);

    expect(getByText('marks')).toBeDefined();
    expect(getByText('none')).toBeDefined();
    expect(getByText('20')).toBeDefined();
    expect(getByText('splash')).toBeDefined();
  });

  it('checks the default scoring radio button', () => {
    const onConfirm = vi.fn();
    const { getByDisplayValue } = render(<ShanghaiRules game={game} onConfirm={onConfirm} />);

    const marksRadio = getByDisplayValue(SCORING.MARKS) as HTMLInputElement;
    expect(marksRadio.checked).toBe(true);
  });

  it('checks the default elimination radio button', () => {
    const onConfirm = vi.fn();
    const { getByDisplayValue } = render(<ShanghaiRules game={game} onConfirm={onConfirm} />);

    const noneRadio = getByDisplayValue(ELIMINATION.NONE) as HTMLInputElement;
    expect(noneRadio.checked).toBe(true);
  });

  it('checks the default end wedge radio button', () => {
    const onConfirm = vi.fn();
    const { getByDisplayValue } = render(<ShanghaiRules game={game} onConfirm={onConfirm} />);

    const twentyRadio = getByDisplayValue(String(END_WEDGE.TWENTY)) as HTMLInputElement;
    expect(twentyRadio.checked).toBe(true);
  });

  it('checks the default turn order radio button', () => {
    const onConfirm = vi.fn();
    const { getByDisplayValue } = render(<ShanghaiRules game={game} onConfirm={onConfirm} />);

    const byShotRadio = getByDisplayValue(TURN_ORDER.BY_SHOT) as HTMLInputElement;
    expect(byShotRadio.checked).toBe(true);
  });

  it('changes scoring rule via radio button', () => {
    const onConfirm = vi.fn();
    const { getByDisplayValue, getByText } = render(<ShanghaiRules game={game} onConfirm={onConfirm} />);

    const wedgeRadio = getByDisplayValue(SCORING.WEDGE) as HTMLInputElement;
    fireEvent.click(getByText('wedge'));

    expect(wedgeRadio.checked).toBe(true);
  });

  it('changes elimination rule via radio button', () => {
    const onConfirm = vi.fn();
    const { getByDisplayValue, getByText } = render(<ShanghaiRules game={game} onConfirm={onConfirm} />);

    const singleRadio = getByDisplayValue(ELIMINATION.SINGLE) as HTMLInputElement;
    fireEvent.click(getByText('single'));

    expect(singleRadio.checked).toBe(true);
  });

  it('changes end wedge rule via radio button', () => {
    const onConfirm = vi.fn();
    const { getByDisplayValue, getByText } = render(<ShanghaiRules game={game} onConfirm={onConfirm} />);

    const nineRadio = getByDisplayValue('9') as HTMLInputElement;
    fireEvent.click(getByText('9'));

    expect(nineRadio.checked).toBe(true);
  });

  it('changes turn order rule via radio button', () => {
    const onConfirm = vi.fn();
    const { getByDisplayValue, getByText } = render(<ShanghaiRules game={game} onConfirm={onConfirm} />);

    const randomRadio = getByDisplayValue(TURN_ORDER.RANDOM) as HTMLInputElement;
    fireEvent.click(getByText('random'));

    expect(randomRadio.checked).toBe(true);
  });

  it('confirms all rule changes at once', () => {
    const onConfirm = vi.fn();
    const { getByText } = render(<ShanghaiRules game={game} onConfirm={onConfirm} />);

    fireEvent.click(getByText('wedge'));
    fireEvent.click(getByText('double'));
    fireEvent.click(getByText('7'));
    fireEvent.click(getByText('entry'));

    fireEvent.click(getByText('confirm rules'));

    expect(game.rules.scoring).toBe(SCORING.WEDGE);
    expect(game.rules.elimination).toBe(ELIMINATION.DOUBLE);
    expect(game.rules.endWedge).toBe(END_WEDGE.SEVEN);
    expect(game.rules.turnOrder).toBe(TURN_ORDER.ENTRY);
    expect(onConfirm).toHaveBeenCalled();
  });

  it('confirms only changed scoring rule', () => {
    const onConfirm = vi.fn();
    const { getByText } = render(<ShanghaiRules game={game} onConfirm={onConfirm} />);

    fireEvent.click(getByText('wedge'));
    fireEvent.click(getByText('confirm rules'));

    expect(game.rules.scoring).toBe(SCORING.WEDGE);
    expect(game.rules.elimination).toBe(ELIMINATION.NONE);
    expect(game.rules.endWedge).toBe(END_WEDGE.TWENTY);
    expect(game.rules.turnOrder).toBe(TURN_ORDER.BY_SHOT);
    expect(onConfirm).toHaveBeenCalled();
  });

  it('confirms only changed elimination rule', () => {
    const onConfirm = vi.fn();
    const { getByText } = render(<ShanghaiRules game={game} onConfirm={onConfirm} />);

    fireEvent.click(getByText('single'));
    fireEvent.click(getByText('confirm rules'));

    expect(game.rules.scoring).toBe(SCORING.MARKS);
    expect(game.rules.elimination).toBe(ELIMINATION.SINGLE);
    expect(game.rules.endWedge).toBe(END_WEDGE.TWENTY);
    expect(game.rules.turnOrder).toBe(TURN_ORDER.BY_SHOT);
    expect(onConfirm).toHaveBeenCalled();
  });

  it('confirms only changed end wedge rule', () => {
    const onConfirm = vi.fn();
    const { getByText } = render(<ShanghaiRules game={game} onConfirm={onConfirm} />);

    fireEvent.click(getByText('9'));
    fireEvent.click(getByText('confirm rules'));

    expect(game.rules.scoring).toBe(SCORING.MARKS);
    expect(game.rules.elimination).toBe(ELIMINATION.NONE);
    expect(game.rules.endWedge).toBe(END_WEDGE.NINE);
    expect(game.rules.turnOrder).toBe(TURN_ORDER.BY_SHOT);
    expect(onConfirm).toHaveBeenCalled();
  });

  it('confirms only changed turn order rule', () => {
    const onConfirm = vi.fn();
    const { getByText } = render(<ShanghaiRules game={game} onConfirm={onConfirm} />);

    fireEvent.click(getByText('random'));
    fireEvent.click(getByText('confirm rules'));

    expect(game.rules.scoring).toBe(SCORING.MARKS);
    expect(game.rules.elimination).toBe(ELIMINATION.NONE);
    expect(game.rules.endWedge).toBe(END_WEDGE.TWENTY);
    expect(game.rules.turnOrder).toBe(TURN_ORDER.RANDOM);
    expect(onConfirm).toHaveBeenCalled();
  });

  it('renders confirm button', () => {
    const onConfirm = vi.fn();
    const { getByText } = render(<ShanghaiRules game={game} onConfirm={onConfirm} />);
    expect(getByText('confirm rules')).toBeDefined();
  });

  it('renders all scoring options', () => {
    const onConfirm = vi.fn();
    const { getByText } = render(<ShanghaiRules game={game} onConfirm={onConfirm} />);

    expect(getByText('marks')).toBeDefined();
    expect(getByText('wedge')).toBeDefined();
  });

  it('renders all elimination options', () => {
    const onConfirm = vi.fn();
    const { getByText } = render(<ShanghaiRules game={game} onConfirm={onConfirm} />);

    expect(getByText('none')).toBeDefined();
    expect(getByText('single')).toBeDefined();
    expect(getByText('double')).toBeDefined();
  });

  it('renders all end wedge options', () => {
    const onConfirm = vi.fn();
    const { getByText } = render(<ShanghaiRules game={game} onConfirm={onConfirm} />);

    expect(getByText('7')).toBeDefined();
    expect(getByText('9')).toBeDefined();
    expect(getByText('20')).toBeDefined();
  });

  it('renders all turn order options', () => {
    const onConfirm = vi.fn();
    const { getByText } = render(<ShanghaiRules game={game} onConfirm={onConfirm} />);

    expect(getByText('splash')).toBeDefined();
    expect(getByText('random')).toBeDefined();
    expect(getByText('entry')).toBeDefined();
  });

  it('updates all rules independently', () => {
    const onConfirm = vi.fn();
    const { getByText, getByDisplayValue } = render(<ShanghaiRules game={game} onConfirm={onConfirm} />);

    fireEvent.click(getByText('wedge'));
    expect((getByDisplayValue(SCORING.WEDGE) as HTMLInputElement).checked).toBe(true);

    fireEvent.click(getByText('double'));
    expect((getByDisplayValue(ELIMINATION.DOUBLE) as HTMLInputElement).checked).toBe(true);

    fireEvent.click(getByText('7'));
    expect((getByDisplayValue(String(END_WEDGE.SEVEN)) as HTMLInputElement).checked).toBe(true);

    fireEvent.click(getByText('entry'));
    expect((getByDisplayValue(TURN_ORDER.ENTRY) as HTMLInputElement).checked).toBe(true);

    fireEvent.click(getByText('confirm rules'));

    expect(game.rules.scoring).toBe(SCORING.WEDGE);
    expect(game.rules.elimination).toBe(ELIMINATION.DOUBLE);
    expect(game.rules.endWedge).toBe(END_WEDGE.SEVEN);
    expect(game.rules.turnOrder).toBe(TURN_ORDER.ENTRY);
    expect(onConfirm).toHaveBeenCalled();
  });

  it('toggles between scoring options multiple times', () => {
    const onConfirm = vi.fn();
    const { getByText, getByDisplayValue } = render(<ShanghaiRules game={game} onConfirm={onConfirm} />);

    fireEvent.click(getByText('wedge'));
    expect((getByDisplayValue(SCORING.WEDGE) as HTMLInputElement).checked).toBe(true);

    fireEvent.click(getByText('marks'));
    expect((getByDisplayValue(SCORING.MARKS) as HTMLInputElement).checked).toBe(true);

    fireEvent.click(getByText('wedge'));
    expect((getByDisplayValue(SCORING.WEDGE) as HTMLInputElement).checked).toBe(true);

    fireEvent.click(getByText('confirm rules'));

    expect(game.rules.scoring).toBe(SCORING.WEDGE);
    expect(onConfirm).toHaveBeenCalled();
  });

  it('toggles between elimination options multiple times', () => {
    const onConfirm = vi.fn();
    const { getByText, getByDisplayValue } = render(<ShanghaiRules game={game} onConfirm={onConfirm} />);

    fireEvent.click(getByText('single'));
    expect((getByDisplayValue(ELIMINATION.SINGLE) as HTMLInputElement).checked).toBe(true);

    fireEvent.click(getByText('double'));
    expect((getByDisplayValue(ELIMINATION.DOUBLE) as HTMLInputElement).checked).toBe(true);

    fireEvent.click(getByText('none'));
    expect((getByDisplayValue(ELIMINATION.NONE) as HTMLInputElement).checked).toBe(true);

    fireEvent.click(getByText('confirm rules'));

    expect(game.rules.elimination).toBe(ELIMINATION.NONE);
    expect(onConfirm).toHaveBeenCalled();
  });

  it('toggles between end wedge options multiple times', () => {
    const onConfirm = vi.fn();
    const { getByText, getByDisplayValue } = render(<ShanghaiRules game={game} onConfirm={onConfirm} />);

    fireEvent.click(getByText('7'));
    expect((getByDisplayValue(String(END_WEDGE.SEVEN)) as HTMLInputElement).checked).toBe(true);

    fireEvent.click(getByText('9'));
    expect((getByDisplayValue(String(END_WEDGE.NINE)) as HTMLInputElement).checked).toBe(true);

    fireEvent.click(getByText('20'));
    expect((getByDisplayValue(String(END_WEDGE.TWENTY)) as HTMLInputElement).checked).toBe(true);

    fireEvent.click(getByText('confirm rules'));

    expect(game.rules.endWedge).toBe(END_WEDGE.TWENTY);
    expect(onConfirm).toHaveBeenCalled();
  });

  it('toggles between turn order options multiple times', () => {
    const onConfirm = vi.fn();
    const { getByText, getByDisplayValue } = render(<ShanghaiRules game={game} onConfirm={onConfirm} />);

    fireEvent.click(getByText('random'));
    expect((getByDisplayValue(TURN_ORDER.RANDOM) as HTMLInputElement).checked).toBe(true);

    fireEvent.click(getByText('entry'));
    expect((getByDisplayValue(TURN_ORDER.ENTRY) as HTMLInputElement).checked).toBe(true);

    fireEvent.click(getByText('splash'));
    expect((getByDisplayValue(TURN_ORDER.BY_SHOT) as HTMLInputElement).checked).toBe(true);

    fireEvent.click(getByText('confirm rules'));

    expect(game.rules.turnOrder).toBe(TURN_ORDER.BY_SHOT);
    expect(onConfirm).toHaveBeenCalled();
  });
});
