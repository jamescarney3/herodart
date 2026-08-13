import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

import MainMenu from '~/pages/main-menu';

vi.mock('react-router');

describe('MainMenu', () => {
  it('renders without crashing', () => {
    const container = render(<MainMenu />);
    expect(container).toBeDefined();
  });
});
