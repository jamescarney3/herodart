import { useState } from 'react';

import { Container } from '~/components/layout';

import type ShanghaiGame from '~/lib/shanghai/shanghai-game';
import { SCORING, ELIMINATION, END_WEDGE, TURN_ORDER } from '~/lib/shanghai';
import { RadioGroup } from '~/components/shared';

interface ShanghaiRulesProps {
  game: ShanghaiGame;
  onConfirm: () => void;
}

const ShanghaiRules = ({ game, onConfirm }: ShanghaiRulesProps) => {
  const { rules } = game;

  const [scoring, setScoring] = useState<SCORING>(rules.scoring);
  const [elimination, setElimination] = useState<ELIMINATION>(rules.elimination);
  const [endWedge, setEndWedge] = useState<END_WEDGE>(rules.endWedge);
  const [turnOrder, setTurnOrder] = useState<TURN_ORDER>(rules.turnOrder);

  const confirm = () => {
    rules.scoring = scoring;
    rules.elimination = elimination;
    rules.endWedge = endWedge;
    rules.turnOrder = turnOrder;
    onConfirm();
  };

  return (
    <Container>
      <section className="flex flex-col gap-2">
        <h1 className="text-center text-6xl">Game Rules</h1>
      </section>

      <section className="flex flex-col gap-6 overflow-scroll grow-2 my-auto">
        <RadioGroup
          legend="Scoring"
          name="scoring"
          value={scoring}
          options={[
            { label: 'marks', value: SCORING.MARKS },
            { label: 'wedge', value: SCORING.WEDGE },
          ]}
          onChange={(value) => setScoring(value as SCORING)}
        />

        <RadioGroup
          legend="Elimination"
          name="elimination"
          value={elimination}
          options={[
            { label: 'none', value: ELIMINATION.NONE },
            { label: 'single', value: ELIMINATION.SINGLE },
            { label: 'double', value: ELIMINATION.DOUBLE },
          ]}
          onChange={(value) => setElimination(value as ELIMINATION)}
        />

        <RadioGroup
          legend="End Wedge"
          name="end-wedge"
          value={String(endWedge)}
          options={[
            { label: '7', value: String(END_WEDGE.SEVEN) },
            { label: '9', value: String(END_WEDGE.NINE) },
            { label: '20', value: String(END_WEDGE.TWENTY) },
          ]}
          onChange={(value) => setEndWedge(Number(value) as END_WEDGE)}
        />

        <RadioGroup
          legend="Turn Order"
          name="turn-order"
          value={turnOrder}
          options={[
            { label: 'splash', value: TURN_ORDER.BY_SHOT },
            { label: 'random', value: TURN_ORDER.RANDOM },
            { label: 'entry', value: TURN_ORDER.ENTRY },
          ]}
          onChange={(value) => setTurnOrder(value as TURN_ORDER)}
        />
      </section>

      <section className="mt-auto shrink-0 flex flex-col gap-2">
        <button onClick={confirm} type="button" className="block w-full">
          confirm rules
        </button>
      </section>
    </Container>
  );
};

export default ShanghaiRules;
