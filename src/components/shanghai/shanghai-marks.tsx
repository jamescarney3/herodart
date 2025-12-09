import { FlightIcon } from '~/components/shanghai';
import type { Nullable } from '~/lib/utils';

interface ShanghaiMarksProps {
  darts: number[];
  editing: Nullable<number>;
  onSelect: (dartIdx: number) => void;
}

const formatDartValue = (value?: number) => {
  if (value === 0) return 'Ø';
  return value;
};

const ShanghaiMarks = ({ editing, onSelect, darts = [] }: ShanghaiMarksProps) => {
  const handleSelect = (idx: number) => {
    if (darts.length > idx) onSelect(idx);
  };

  return (
    <>
      <button className="btn-unstyled" onClick={() => handleSelect(0)}>
        <FlightIcon
          editing={editing === 0}
          complete={darts.length >= 1}
          className="h-[30vw] w-[30vw] max-h-40 max-w-40"
        >
          <div className="text-6xl">{formatDartValue(darts.at(0))}</div>
        </FlightIcon>
      </button>
      <button className="btn-unstyled" onClick={() => handleSelect(1)}>
        <FlightIcon
          editing={editing === 1}
          complete={darts.length >= 2}
          className="h-[30vw] w-[30vw] max-h-40 max-w-40"
        >
          <div className="text-6xl">{formatDartValue(darts.at(1))}</div>
        </FlightIcon>
      </button>
      <button className="btn-unstyled" onClick={() => handleSelect(2)}>
        <FlightIcon
          editing={editing === 2}
          complete={darts.length >= 3}
          className="h-[30vw] w-[30vw] max-h-40 max-w-40"
        >
          <div className="text-6xl">{formatDartValue(darts.at(2))}</div>
        </FlightIcon>
      </button>
    </>
  );
};

export default ShanghaiMarks;
