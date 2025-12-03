import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

import '/test/mocks/match-media';
import App from '~/app';

describe('main app container', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).to.exist;
  });
});
