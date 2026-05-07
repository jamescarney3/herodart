import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';

import InstallModal from '~/components/shared/install-modal';
import usePwaInstallation from '~/hooks/use-pwa-installation';

vi.mock('@headlessui/react', () => ({
  Description: ({ children }) => <div>{children}</div>,
  Dialog: ({ children, open }) => (open ? <div>{children}</div> : null),
  DialogPanel: ({ children }) => <div>{children}</div>,
  DialogTitle: ({ children }) => <div>{children}</div>,
  DialogBackdrop: () => null,
}));
vi.mock('~/hooks/use-pwa-installation');

describe('InstallModal', () => {
  const mockUsePwaInstallation = vi.mocked(usePwaInstallation);

  beforeEach(() => {
    vi.mocked(usePwaInstallation).mockReturnValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', async () => {
    const container = render(<InstallModal />);

    expect(container).to.exist;
  });

  it('does not render in standalone mode', () => {
    mockUsePwaInstallation.mockReturnValue({ inStandaloneMode: true });
    const standaloneContainer = render(<InstallModal />);
    expect(standaloneContainer.baseElement.firstChild.innerHTML).toBeFalsy();
  });

  it('does not render when disabled', () => {
    const standaloneContainer = render(<InstallModal disabled />);
    expect(standaloneContainer.baseElement.firstChild.innerHTML).toBeFalsy();
  });

  it('renders instructions that correspond to platform', () => {
    mockUsePwaInstallation.mockReturnValue({ onIOS: true, hasPrompt: false });
    const iosContainer = render(<InstallModal />);
    expect(iosContainer).to.exist;

    mockUsePwaInstallation.mockReturnValue({ onIOS: false, hasPrompt: true });
    const promptableContainer = render(<InstallModal />);
    expect(promptableContainer).to.exist;

    mockUsePwaInstallation.mockReturnValue({ onIOS: false, hasPrompt: false });
    const fallbackContainer = render(<InstallModal />);
    expect(fallbackContainer).to.exist;
  });

  it('invokes install prompt on install button click', async () => {
    const promptToInstall = vi.fn();
    mockUsePwaInstallation.mockReturnValue({ onIOS: false, hasPrompt: true, promptToInstall });
    const { getByText } = render(<InstallModal />);

    await act(() => {
      fireEvent.click(getByText('Install'));
    });

    expect(promptToInstall).toHaveBeenCalled();
  });

  it('can be closed', async () => {
    mockUsePwaInstallation.mockReturnValue({ hasPrompt: true });
    const { getByText, queryByText } = render(<InstallModal />);

    await act(() => {
      fireEvent.click(getByText('Not now'));
    });

    expect(queryByText('Not now')).toBeNull();
  });
});
