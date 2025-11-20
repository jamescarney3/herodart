import type { SyntheticEvent } from 'react';

interface ShanghaiKeypadProps {
  onClickNumber: (value: number) => void;
}

const ShanghaiKeypad = ({ onClickNumber }: ShanghaiKeypadProps) => {
  const buttonClass = 'basis-[40%] grow py-5 text-3xl';

  const handleNumberClick = (e: SyntheticEvent) => {
    const { value } = e.target as typeof e.target & { value: string };
    onClickNumber(parseInt(value));
  };

  return (
    <div className="flex flex-wrap items-stretch justify-between gap-2">
      <button className={buttonClass} onClick={handleNumberClick} value={1} type="button">
        1
      </button>
      <button className={buttonClass} onClick={handleNumberClick} value={2} type="button">
        2
      </button>
      <button className={buttonClass} onClick={handleNumberClick} value={3} type="button">
        3
      </button>
      <button className={buttonClass} onClick={handleNumberClick} value={0} type="button">
        miss
      </button>
    </div>
  );
};

export default ShanghaiKeypad;
