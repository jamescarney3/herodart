import { useState } from 'react';

/**
 * not much to see here, just a wrapper for one of the more common state hook uses; better
 * than having to inline and test anonymous functions that look like:
 *
 * () => setSomeBoolean(!someBoolean)
 *
 * TODO: could possibly benefit from returning functions to always set state true or false
 */
const useToggle = (initialState: boolean): [boolean, () => void] => {
  const [state, setToggleState] = useState(initialState);

  const toggle = () => setToggleState(!state);

  return [state, toggle];
};

export default useToggle;
