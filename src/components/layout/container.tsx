import type { ReactNode } from 'react';

// NB: not sure if this is the best name for this thing, soemthing like <Main /> might be better?
const Container = ({ children }: { children: ReactNode }) => {
  return <main className="h-screen flex flex-col gap-2 p-2">{children}</main>;
};

export default Container;
