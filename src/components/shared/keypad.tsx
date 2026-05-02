import { useEffect, useRef } from 'react';
import { evaluate } from 'mathjs';
import type { ChangeEvent, SyntheticEvent, ChangeEventHandler } from 'react';
import { formatEvalString, MULT, PLUS, MULT_MATH, PLUS_MATH } from '~/lib/utils';

const operators: Array<string | undefined> = [MULT_MATH, PLUS_MATH];

interface KeypadProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
  onSubmit: () => void;
  onUndo?: () => void;
  value?: string;
  disabled?: boolean;
  validate?: (score: number) => boolean;
  className?: string;
}

/**
 * react likes synthetic events, but I like consistent interfaces, so we're gonna treat the value
 * input here as the load bearing element here and thus the target of any change handler passed in.
 * to implement this patter, any button events will mutate the input and dispatch a corresponding
 * change event, and the component will handle invoking its onChange prop by listening for input
 * changes and calling it in response
 */
const Keypad = ({ onSubmit, onChange, onUndo, value, disabled, validate, className }: KeypadProps) => {
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

  const scoreValid = (evalString: string) => {
    if (operators.includes(evalString.at(-1))) return false;
    const result = validate?.(evaluate(evalString) ?? 0);
    return result ?? true;
    // return validate?.(evaluate(evalString) ?? 0) ?? true;
  };

  const partialScoreValid = (evalString: string) => {
    if (operators.includes(evalString.at(-1))) return true;
    const result = validate?.(evaluate(evalString));
    return result ?? true;
    // return validate?.(evaluate(evalString) ?? 0) ?? true;
  };

  const onNumericKeyPress = (e: SyntheticEvent) => {
    const { value: token } = e.target as typeof e.target & { value: string };
    const currentValue = inputRef.current!.value;
    const newValue = currentValue + token;

    if (nextTokenValid(token) && partialScoreValid(newValue)) {
      inputRef.current!.value = newValue;
      dispatchChange();
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
      <input readOnly className="hidden" ref={inputRef} onChange={onChange} value={value} />
      <div className="flex items-stretch justify-between gap-2 [&>button]:w-full [&>button:focus]:outline-none">
        <button onClick={onNumericKeyPress} disabled={disabled} value={1} type="button">
          1
        </button>
        <button onClick={onNumericKeyPress} disabled={disabled} value={2} type="button">
          2
        </button>
        <button onClick={onNumericKeyPress} disabled={disabled} value={3} type="button">
          3
        </button>
      </div>
      <div className="flex items-stretch justify-between gap-2 [&>button]:w-full [&>button:focus]:outline-none">
        <button onClick={onNumericKeyPress} disabled={disabled} value={4} type="button">
          4
        </button>
        <button onClick={onNumericKeyPress} disabled={disabled} value={5} type="button">
          5
        </button>
        <button onClick={onNumericKeyPress} disabled={disabled} value={6} type="button">
          6
        </button>
      </div>
      <div className="flex items-stretch justify-between gap-2 [&>button]:w-full [&>button:focus]:outline-none">
        <button onClick={onNumericKeyPress} disabled={disabled} value={7} type="button">
          7
        </button>
        <button onClick={onNumericKeyPress} disabled={disabled} value={8} type="button">
          8
        </button>
        <button onClick={onNumericKeyPress} disabled={disabled} value={9} type="button">
          9
        </button>
      </div>
      <div className="flex items-stretch justify-between gap-2 [&>button]:w-full [&>button:focus]:outline-none">
        <button onClick={onNumericKeyPress} disabled={disabled} value={MULT_MATH} type="button">
          {MULT}
        </button>
        <button onClick={onNumericKeyPress} disabled={disabled} value={0} type="button">
          0
        </button>
        <button onClick={onNumericKeyPress} disabled={disabled} value={PLUS_MATH} type="button">
          {PLUS}
        </button>
      </div>
      <div className="flex items-stretch justify-between gap-2 [&>button]:w-full [&>button:focus]:outline-none">
        <button onClick={handleUndo} disabled={disabled} type="button">
          back
        </button>
        <button onClick={onClear} disabled={disabled} type="button">
          clear
        </button>
        <button onClick={handleSubmit} disabled={disabled} type="button">
          enter
        </button>
      </div>
    </div>
  );
};

export default Keypad;
