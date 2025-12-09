import type { ShanghaiRound } from '~/lib/shanghai';
import type { Nullable } from '~/lib/utils';

/**
 * TODO: figure out what the top level element here is semantically - needs to be interactice like
 * a button, but display-wise is some kind of serial element like a list item, but the actual data
 * that needs to get display could arguably be tabular enough thtat that's thr right mode
*/

interface ShanghaiRoundItemProps {
  round: ShanghaiRound;
  editingRound: Nullable<ShanghaiRound>;
  onClick: (round: ShanghaiRound) => void;
}

const ShanghaiRoundItem = ({ round, editingRound, onClick }: ShanghaiRoundItemProps) => {
  const isEditing = round === editingRound;

  const buttonClass = [
    'btn-unstyled flex w-full',
    isEditing && 'text-yellow-500',
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClass}
      onClick={() => onClick(round)}
    >
      <div className="mr-2">{round.wedge}</div>
      <div>{round.player.name}</div>
      <div className="ml-auto">{round.marks} marks</div>
    </button>
  );
};

export default ShanghaiRoundItem;
