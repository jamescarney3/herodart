import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';

import FlightIcon from '~/components/shanghai/flight-icon';

describe('FlightIcon', () => {
  it('renders without crashing', () => {
    const { container } = render(<FlightIcon />);
    expect(container).toBeDefined();
  });

  describe('with editing and complete props', () => {
    it('renders with true complete prop', () => {
      const { container } = render(<FlightIcon complete={true} />);
      expect(container).toBeDefined();
    });

    it('renders with true editing prop', () => {
      const { container } = render(<FlightIcon editing={true} />);
      expect(container).toBeDefined();
    });
  });
});
