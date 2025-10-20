import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';

import Keypad from '~/components/legs/keypad';

// Mock utils
vi.mock('~/lib/utils', () => ({
  formatEvalString: (v: string) => `eval:${v}`,
  MULT: '×',
  PLUS: '+',
  MULT_MATH: '*',
  PLUS_MATH: '+',
}));

describe('Keypad', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders with default props', () => {
    const handleChange = vi.fn();
    const handleSubmit = vi.fn();
    const { getByText, getByDisplayValue } = render(<Keypad onChange={handleChange} onSubmit={handleSubmit} />);
    expect(getByText('1')).toBeTruthy();
    expect(getByText('clear')).toBeTruthy();
    expect(getByDisplayValue('eval:')).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = render(<Keypad onChange={() => {}} onSubmit={() => {}} className="custom-class" />);
    expect((container.firstChild as HTMLElement).className).toContain('custom-class');
  });

  it('shows formatted value in readOnly input', () => {
    const { getByDisplayValue } = render(<Keypad onChange={() => {}} onSubmit={() => {}} value="123" />);
    expect(getByDisplayValue('eval:123')).toBeTruthy();
  });

  it('calls onChange when numeric button is pressed', () => {
    const handleChange = vi.fn();
    const { getByText } = render(<Keypad onChange={handleChange} onSubmit={() => {}} value="" />);
    fireEvent.click(getByText('1'));
    expect(handleChange).toHaveBeenCalled();
  });

  it('appends operator when operator button is pressed', () => {
    const handleChange = vi.fn();
    const { getByText } = render(<Keypad onChange={handleChange} onSubmit={() => {}} value="2" />);
    fireEvent.click(getByText('×'));
    expect(handleChange).toHaveBeenCalled();
    fireEvent.click(getByText('+'));
    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  it('deletes last character on back', () => {
    const handleChange = vi.fn();
    const { getByText } = render(<Keypad onChange={handleChange} onSubmit={() => {}} value="123" />);
    fireEvent.click(getByText('back'));
    expect(handleChange).toHaveBeenCalled();
  });

  it('clears input on clear', () => {
    const handleChange = vi.fn();
    const { getByText } = render(<Keypad onChange={handleChange} onSubmit={() => {}} value="123" />);
    fireEvent.click(getByText('clear'));
    expect(handleChange).toHaveBeenCalled();
  });

  it('calls onSubmit when enter is pressed', () => {
    const handleSubmit = vi.fn();
    const { getByText } = render(<Keypad onChange={() => {}} onSubmit={handleSubmit} value="123" />);
    fireEvent.click(getByText('enter'));
    expect(handleSubmit).toHaveBeenCalled();
  });

  it('input value reflects prop changes', () => {
    const { getAllByDisplayValue, rerender } = render(<Keypad onChange={() => {}} onSubmit={() => {}} value="42" />);
    // The second input is the editable one
    expect(getAllByDisplayValue('42')[0]).toBeTruthy();
    rerender(<Keypad onChange={() => {}} onSubmit={() => {}} value="99" />);
    expect(getAllByDisplayValue('99')[0]).toBeTruthy();
  });
});
