import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';

import useToggle from '~/hooks/use-toggle';

const DummyComponent = () => {
  const [someBooleanValue, toggleSomeBooleanValue] = useToggle(false);

  return (
    <>
      {someBooleanValue && <div>rendered when true</div>}
      {!someBooleanValue && <div>rendered when false</div>}
      <button onClick={toggleSomeBooleanValue}>toggle</button>
    </>
  );
};

describe('useToggle custom hook', () => {
  it('returns a boolean value and toggles it', () => {
    const { getByText, queryByText } = render(<DummyComponent />);

    expect(getByText('rendered when false')).to.exist;
    expect(queryByText('rendered when true')).not.to.exist;

    fireEvent.click(getByText('toggle'));

    expect(getByText('rendered when true')).to.exist;
    expect(queryByText('rendered when false')).not.to.exist;
  });
});
