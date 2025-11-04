import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

import { Game } from '~/components/legs';

describe('LegsGame', () => {
  it('renders without crashing', () => {
    const { container } = render(<Game />);
    expect(container).to.exist;
  });
});
