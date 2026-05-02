import { describe, it, expect, afterEach, vi } from 'vitest';
import { cleanup, render, fireEvent } from '@testing-library/react';

import RadioGroup from '~/components/shared/radio-group';

describe('RadioGroup component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(
      <RadioGroup
        legend="Test"
        name="test"
        value="option1"
        options={[{ label: 'Option 1', value: 'option1' }]}
        onChange={vi.fn()}
      />,
    );
    expect(container).toBeDefined();
  });

  it('renders legend', () => {
    const { getByText } = render(
      <RadioGroup
        legend="Test Legend"
        name="test"
        value="option1"
        options={[{ label: 'Option 1', value: 'option1' }]}
        onChange={vi.fn()}
      />,
    );

    expect(getByText('Test Legend')).toBeDefined();
  });

  it('renders all options as labels', () => {
    const { getByText } = render(
      <RadioGroup
        legend="Test"
        name="test"
        value="option1"
        options={[
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
          { label: 'Option 3', value: 'option3' },
        ]}
        onChange={vi.fn()}
      />,
    );

    expect(getByText('Option 1')).toBeDefined();
    expect(getByText('Option 2')).toBeDefined();
    expect(getByText('Option 3')).toBeDefined();
  });

  it('hides radio inputs', () => {
    const { container } = render(
      <RadioGroup
        legend="Test"
        name="test"
        value="option1"
        options={[{ label: 'Option 1', value: 'option1' }]}
        onChange={vi.fn()}
      />,
    );

    const inputs = container.querySelectorAll('input[type="radio"]');
    expect(inputs.length).toBe(1);

    inputs.forEach((input) => {
      expect(input.classList.contains('hidden')).toBe(true);
    });
  });

  it('checks the selected radio button', () => {
    const { getByDisplayValue } = render(
      <RadioGroup
        legend="Test"
        name="test"
        value="option1"
        options={[
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
        ]}
        onChange={vi.fn()}
      />,
    );

    const selectedRadio = getByDisplayValue('option1') as HTMLInputElement;
    expect(selectedRadio.checked).toBe(true);

    const unselectedRadio = getByDisplayValue('option2') as HTMLInputElement;
    expect(unselectedRadio.checked).toBe(false);
  });

  it('calls onChange when option is clicked', () => {
    const handleChange = vi.fn();
    const { getByText } = render(
      <RadioGroup
        legend="Test"
        name="test"
        value="option1"
        options={[
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
        ]}
        onChange={handleChange}
      />,
    );

    fireEvent.click(getByText('Option 2'));

    expect(handleChange).toHaveBeenCalledWith('option2');
  });

  it('applies info styling to selected option', () => {
    const { getByText } = render(
      <RadioGroup
        legend="Test"
        name="test"
        value="option1"
        options={[
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
        ]}
        onChange={vi.fn()}
      />,
    );

    const selectedLabel = getByText('Option 1').closest('label');
    expect(selectedLabel?.classList.contains('btn-info')).toBe(true);
  });

  it('applies default styling to unselected option', () => {
    const { getByText } = render(
      <RadioGroup
        legend="Test"
        name="test"
        value="option1"
        options={[
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
        ]}
        onChange={vi.fn()}
      />,
    );

    const unselectedLabel = getByText('Option 2').closest('label');
    expect(unselectedLabel?.classList.contains('btn')).toBe(true);
    expect(unselectedLabel?.classList.contains('btn-info')).not.toBe(true);
  });

  it('toggles between options', () => {
    const handleChange = vi.fn();
    const { getByText, getByDisplayValue, rerender } = render(
      <RadioGroup
        legend="Test"
        name="test"
        value="option1"
        options={[
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
        ]}
        onChange={handleChange}
      />,
    );

    fireEvent.click(getByText('Option 2'));
    expect(handleChange).toHaveBeenCalledWith('option2');

    rerender(
      <RadioGroup
        legend="Test"
        name="test"
        value="option2"
        options={[
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
        ]}
        onChange={handleChange}
      />,
    );

    const option2Radio = getByDisplayValue('option2') as HTMLInputElement;
    expect(option2Radio.checked).toBe(true);
  });

  it('uses correct name attribute for all radio buttons', () => {
    const { container } = render(
      <RadioGroup
        legend="Test"
        name="test-name"
        value="option1"
        options={[
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
        ]}
        onChange={vi.fn()}
      />,
    );

    const inputs = container.querySelectorAll('input[type="radio"]');
    inputs.forEach((input) => {
      expect(input.getAttribute('name')).toBe('test-name');
    });
  });

  it('handles single option correctly', () => {
    const { getByText, getByDisplayValue } = render(
      <RadioGroup
        legend="Test"
        name="test"
        value="option1"
        options={[{ label: 'Only Option', value: 'option1' }]}
        onChange={vi.fn()}
      />,
    );

    expect(getByText('Only Option')).toBeDefined();
    const radio = getByDisplayValue('option1') as HTMLInputElement;
    expect(radio.checked).toBe(true);
  });

  it('handles many options correctly', () => {
    const options = Array.from({ length: 10 }, (_, i) => ({
      label: `Option ${i + 1}`,
      value: `option${i + 1}`,
    }));

    const { getByText } = render(
      <RadioGroup legend="Test" name="test" value="option1" options={options} onChange={vi.fn()} />,
    );

    options.forEach((option) => {
      expect(getByText(option.label)).toBeDefined();
    });
  });

  it('calls onChange with correct string value', () => {
    const handleChange = vi.fn();
    const { getByText } = render(
      <RadioGroup
        legend="Test"
        name="test"
        value="option1"
        options={[
          { label: 'Option 1', value: 'option1' },
          { label: 'Option 2', value: 'option2' },
        ]}
        onChange={handleChange}
      />,
    );

    fireEvent.click(getByText('Option 2'));

    expect(handleChange).toHaveBeenCalledWith('option2');
  });
});
