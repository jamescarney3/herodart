export const hasOwnOrInhertits = (target: T, prop: string): boolean => {
  if (target === null) return false;
  if (Object.hasOwn(target, prop)) return true;

  const proto = Object.getPrototypeOf(target);
  return hasOwnOrInhertits(proto, prop);
};
