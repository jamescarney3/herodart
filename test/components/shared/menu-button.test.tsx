import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

import MenuButton from '~/components/shared/menu-button';

describe('MenuButton', () => {
  it('renders without crashing', () => {
    const container = render(<MenuButton />);
    expect(container).toBeTruthy();
  });
});
