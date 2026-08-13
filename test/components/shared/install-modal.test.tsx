import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import type { ReactNode } from 'react';

import InstallModal from '~/components/shared/install-modal';
import usePwaInstallation from '~/hooks/use-pwa-installation';

vi.mock('@headlessui/react', () => ({
  Description: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  Dialog: ({ children, open }: { children?: ReactNode; open?: boolean }) => (open ? <div>{children}</div> : null),
  DialogPanel: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
  DialogBackdrop: () => null,
}));
vi.mock('~/hooks/use-pwa-installation');

describe('InstallModal', () => {
  const mockUsePwaInstallation = vi.mocked(usePwaInstallation);

  beforeEach(() => {
    vi.mocked(usePwaInstallation).mockReturnValue({} as ReturnType<typeof usePwaInstallation>);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', async () => {
    const container = render(<InstallModal />);

    expect(container).toBeDefined();
  });

  it('does not render in standalone mode', () => {
    mockUsePwaInstallation.mockReturnValue({ inStandaloneMode: true } as ReturnType<typeof usePwaInstallation>);
    const standaloneContainer = render(<InstallModal />);
    expect(standaloneContainer.baseElement.firstChild?.textContent).toBeFalsy();
  });

  it('does not render when disabled', () => {
    const standaloneContainer = render(<InstallModal disabled />);
    expect(standaloneContainer.baseElement.firstChild?.textContent).toBeFalsy();
  });

  it('renders instructions that correspond to platform', () => {
    mockUsePwaInstallation.mockReturnValue({ onIOS: true, hasPrompt: false } as ReturnType<typeof usePwaInstallation>);
    const iosContainer = render(<InstallModal />);
    expect(iosContainer).toBeDefined();

    mockUsePwaInstallation.mockReturnValue({ onIOS: false, hasPrompt: true } as ReturnType<typeof usePwaInstallation>);
    const promptableContainer = render(<InstallModal />);
    expect(promptableContainer).toBeDefined();

    mockUsePwaInstallation.mockReturnValue({ onIOS: false, hasPrompt: false } as ReturnType<typeof usePwaInstallation>);
    const fallbackContainer = render(<InstallModal />);
    expect(fallbackContainer).toBeDefined();
  });

  it('invokes install prompt on install button click', async () => {
    const promptToInstall = vi.fn() as () => Promise<unknown>;
    // TODO: find out why this has to get cast when the others don't
    mockUsePwaInstallation.mockReturnValue({ onIOS: false, hasPrompt: true, promptToInstall } as ReturnType<
      typeof usePwaInstallation
    >);
    const { getByText } = render(<InstallModal />);

    act(() => {
      fireEvent.click(getByText('Install'));
    });

    expect(promptToInstall).toHaveBeenCalled();
  });

  it('can be closed', async () => {
    mockUsePwaInstallation.mockReturnValue({ hasPrompt: true } as ReturnType<typeof usePwaInstallation>);
    const { getByText, queryByText } = render(<InstallModal />);

    act(() => {
      fireEvent.click(getByText('Not now'));
    });

    expect(queryByText('Not now')).toBeNull();
  });
});
