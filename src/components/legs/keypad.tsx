import { useEffect, useRef } from 'react';
import type { ChangeEvent, SyntheticEvent, ChangeEventHandler, MouseEventHandler } from 'react';
import { formatEvalString, MULT, PLUS, MATH_MULT, MATH_PLUS } from '~/lib/utils';

interface KeypadProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
  onSubmit: MouseEventHandler<HTMLButtonElement>;
  value?: string;
  className?: string;
}

/**
 * react likes synthetic events, but I like consistent interfaces, so we're gonna treat the value
 * input here as the load bearing element here and thus the target of any change handler passed in.
 * to implement this patter, any button events will mutate the input and dispatch a corresponding
 * change event, and the component will handle invoking its onChange prop by listening for input
 * changes and calling it in response
 */
const Keypad = ({ onSubmit, onChange, value, className }: KeypadProps) => {
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

  const onNumericKeyPress = (e: SyntheticEvent) => {
    const target = e.target as typeof e.target & { value: string };
    // validate input here
    inputRef.current!.value += target.value;
    dispatchChange();
  };

  const onDelete = () => {
    inputRef.current!.value = inputRef.current!.value.slice(0, -1);
    dispatchChange();
  };

  const onClear = () => {
    inputRef.current!.value = '';
    dispatchChange();
  };

  return (
    <div className={className}>
      <input readOnly value={formatEvalString(value || '')} />
      <input ref={inputRef} onChange={onChange} value={value} />
      <div>
        <button onClick={onNumericKeyPress} value={1} type="button">1</button>
        <button onClick={onNumericKeyPress} value={2} type="button">2</button>
        <button onClick={onNumericKeyPress} value={3} type="button">3</button>
      </div>
      <div>
        <button onClick={onNumericKeyPress} value={4} type="button">4</button>
        <button onClick={onNumericKeyPress} value={5} type="button">5</button>
        <button onClick={onNumericKeyPress} value={6} type="button">6</button>
      </div>
      <div>
        <button onClick={onNumericKeyPress} value={7} type="button">7</button>
        <button onClick={onNumericKeyPress} value={8} type="button">8</button>
        <button onClick={onNumericKeyPress} value={9} type="button">9</button>
      </div>
      <div>
        <button onClick={onNumericKeyPress} value={MATH_MULT} type="button">{MULT}</button>
        <button onClick={onNumericKeyPress} value={0} type="button">0</button>
        <button onClick={onNumericKeyPress} value={MATH_PLUS} type="button">{PLUS}</button>
      </div>
      <div>
        <button onClick={onDelete} type="button">back</button>
        <button onClick={onClear} type="button">clear</button>
        <button onClick={onSubmit} type="button">enter</button>
      </div>
    </div>
  );
};

export default Keypad;
