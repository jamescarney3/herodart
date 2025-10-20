import { useEffect, useRef } from 'react';
import type { ChangeEvent, SyntheticEvent, ChangeEventHandler, MouseEventHandler } from 'react';
import { formatEvalString, MULT, PLUS, MULT_MATH, PLUS_MATH } from '~/lib/utils';

interface KeypadProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
  onSubmit: MouseEventHandler<HTMLButtonElement>;
  onUndo?: () => void;
  value?: string;
  disabled?: boolean;
  className?: string;
  // name: bring back for a11y
  // onUndo?: override clear action if the parent component says so
  // undoText?: override undo text if parent says so
  // maybe accept a custom child component composed with both of these
  // onClear?: override clear action if the parent component says so
}

/**
 * react likes synthetic events, but I like consistent interfaces, so we're gonna treat the value
 * input here as the load bearing element here and thus the target of any change handler passed in.
 * to implement this patter, any button events will mutate the input and dispatch a corresponding
 * change event, and the component will handle invoking its onChange prop by listening for input
 * changes and calling it in response
 */
const Keypad = ({ onSubmit, onChange, onUndo, value, className }: KeypadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // set up change handler internals
  useEffect(() => {
    const changeHandler = (e: Event) => onChange(e as unknown as ChangeEvent<HTMLInputElement>);
    const input = inputRef.current;
    input?.addEventListener('change', changeHandler);
    return () => input?.removeEventListener('change', changeHandler);
  }, [inputRef, onChange]);

  const dispatchChange = () => {
    const changeEvent = new Event('change', { bubbles: true });
    inputRef.current!.dispatchEvent(changeEvent);
  };

  const nextTokenValid = (token: string) => {
    const currentValue = inputRef.current!.value;
    const lastToken = currentValue.at(-1);

    if (operators.includes(token)) {
      if (!currentValue) return false;
      return !operators.includes(lastToken);
    } else {
      return true;
    }
  };

  const handleUndo = () => {
    if (onUndo) {
      onUndo();
    } else {
      inputRef.current!.value = inputRef.current!.value.slice(0, -1);
      dispatchChange();
    }
  };

  const onClear = () => {
    // invoke custom clear if passed?
    inputRef.current!.value = '';
    dispatchChange();
  };

  const handleSubmit = () => {
    const submitValue = inputRef.current!.value;
    if (scoreValid(submitValue)) onSubmit();
  };

  return (
    <div className={`flex flex-col text-xl gap-2 ${className}`}>
      <input readOnly value={formatEvalString(value || '')} className="text-center py-4 text-2xl" />
      <input className="hidden" ref={inputRef} onChange={onChange} value={value} />
      <div className="flex items-stretch justify-between gap-2 [&>button]:w-full [&>button:focus]:outline-none">
        <button onClick={onNumericKeyPress} value={1} type="button">
          1
        </button>
        <button onClick={onNumericKeyPress} value={2} type="button">
          2
        </button>
        <button onClick={onNumericKeyPress} value={3} type="button">
          3
        </button>
      </div>
      <div className="flex items-stretch justify-between gap-2 [&>button]:w-full [&>button:focus]:outline-none">
        <button onClick={onNumericKeyPress} value={4} type="button">
          4
        </button>
        <button onClick={onNumericKeyPress} value={5} type="button">
          5
        </button>
        <button onClick={onNumericKeyPress} value={6} type="button">
          6
        </button>
      </div>
      <div className="flex items-stretch justify-between gap-2 [&>button]:w-full [&>button:focus]:outline-none">
        <button onClick={onNumericKeyPress} value={7} type="button">
          7
        </button>
        <button onClick={onNumericKeyPress} value={8} type="button">
          8
        </button>
        <button onClick={onNumericKeyPress} value={9} type="button">
          9
        </button>
      </div>
      <div className="flex items-stretch justify-between gap-2 [&>button]:w-full [&>button:focus]:outline-none">
        <button onClick={onNumericKeyPress} value={MULT_MATH} type="button">
          {MULT}
        </button>
        <button onClick={onNumericKeyPress} value={0} type="button">
          0
        </button>
        <button onClick={onNumericKeyPress} value={PLUS_MATH} type="button">
          {PLUS}
        </button>
      </div>
      <div className="flex items-stretch justify-between gap-2 [&>button]:w-full [&>button:focus]:outline-none">
        <button onClick={handleUndo} type="button">
          back
        </button>
        <button onClick={onClear} type="button">
          clear
        </button>
        <button onClick={onSubmit} type="button">
          enter
        </button>
      </div>
    </div>
  );
};

export default Keypad;
