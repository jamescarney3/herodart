import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

import KofiLink from '~/components/shared/kofi-link';

describe('KofiLink', () => {
  it('renders without crashing', () => {
    const container = render(<KofiLink />);
    expect(container).toBeTruthy();
  });
});
