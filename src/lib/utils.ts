export const MULT_MATH = '*';
export const PLUS_MATH = '+';
export const MULT = '×';
export const PLUS = '+';

export const hasOwnOrInherits = (target: object, prop: string): boolean => {
  if (target === null) return false;
  if (Object.hasOwn(target, prop)) return true;

  const proto = Object.getPrototypeOf(target);
  return hasOwnOrInherits(proto, prop);
};

export const formatEvalString = (evalString: string) => {
  const tokens = evalString.match(/\d+|\+|\*/g) || [];
  const result = [];
  let i = 0;

  while (i < tokens.length) {
    // look ahead for multiplication operator
    if (tokens[i + 1] === MULT_MATH) {
      // look for multiplicand and parenthesize
      if ((tokens[i + 2] ?? null)) {
        result.push('(' + tokens[i] + MULT + tokens[i + 2] + ')');
        i += 3;
      // otherwise push friendly operator
      } else {
        result.push(tokens[i] + MULT);
        i += 2;
      }
    // addition is easy - just push the operator
    } else if (tokens[i] === PLUS_MATH) {
      result.push (` ${PLUS} `);
      i++;
    // otherwise just push the number
    } else {
      result.push(tokens[i]);
      i++;
    }
  }
  return result.join('');
};
