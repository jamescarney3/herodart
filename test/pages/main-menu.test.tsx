import { describe, it, expect } from 'vitest';
import { renderWithRouter } from 'test/helpers';

import MainMenu from '~/pages/main-menu';

describe('MainMenu', () => {
  it('renders without crashing', () => {
    const container = renderWithRouter(<MainMenu />);
    expect(container).toBeDefined();
  });
});
