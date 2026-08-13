import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import type { ReactElement } from 'react';
import { createElement } from 'react';

export const renderWithRouter = (ui: ReactElement, { route = '/' } = {}): ReturnType<typeof render> => {
  window.history.pushState({}, 'Test page', route);

  const Wrapper = ({ children }: { children?: React.ReactNode }) => createElement(BrowserRouter, null, children);

  return render(ui, { wrapper: Wrapper });
};
