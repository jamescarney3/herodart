import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, render, fireEvent, waitFor } from '@testing-library/react';
import { useState } from 'react';

import LegsMenu from '~/components/shared/context-menu';

describe('LegsMenu component', () => {
  it('renders without crashing', () => {
    const container = render(<LegsMenu />);

    expect(container).to.exist;
  });

  it('opens on menu button click', async () => {
    const { getByRole, findByText } = render(<LegsMenu />);

    const menuButton = getByRole('button');
    act(() => fireEvent.click(menuButton));
    // find* query (async) ensures updates happened so flow continues with resolved value
    const cancelButton = await findByText('Cancel');
    expect(cancelButton).to.exist;
  });

  it('closes on cancel button click', async () => {
    const { getByRole, findByText, queryByText } = render(<LegsMenu />);

    const menuButton = getByRole('button');
    act(() => fireEvent.click(menuButton));
    // find* query (async) ensures updates happened so flow continues with resolved value
    const cancelButton = await findByText('Cancel');
    act(() => fireEvent.click(cancelButton));
    // waitFor ensures updates happened so query* query can check vDOM after update
    waitFor(() => expect(queryByText('Cancel')).to.not.exist);
  });

  it('renders option buttons', async () => {
    const testOption = { label: 'test label', onClick: vi.fn() };
    const { getByRole, findByText } = render(<LegsMenu options={[testOption]} />);

    const menuButton = getByRole('button');
    act(() => fireEvent.click(menuButton));
    // find* query (async) ensures updates happened so flow continues with resolved value
    const optionButton = await findByText(testOption.label);
    expect(optionButton).to.exist;
    act(() => fireEvent.click(optionButton));
    expect(testOption.onClick).toHaveBeenCalled();
  });
});
