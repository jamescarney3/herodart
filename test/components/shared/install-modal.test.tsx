import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/react';

import InstallModal from '~/components/shared/install-modal';
import usePwaInstallation from '~/hooks/use-pwa-installation';

vi.mock('~/hooks/use-pwa-installation');

describe('Keypad', () => {
  const mockUsePwaInstallation = vi.mocked(usePwaInstallation);

  beforeEach(() => {
    mockUsePwaInstallation.mockReturnValue({});
  });

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('renders without crashing', () => {
    const container = render(<InstallModal />);
    expect(container).to.exist;
  });

  it('does not render in standalone mode', () => {
    mockUsePwaInstallation.mockReturnValue({ inStandaloneMode: true });
    const standaloneContainer = render(<InstallModal />);
    expect(standaloneContainer).to.exist;
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

  it('invokes install prompt on install button click', () => {
    const promptToInstall = vi.fn();
    mockUsePwaInstallation.mockReturnValue({ onIOS: false, hasPrompt: true, promptToInstall });
    const { getByText } = render(<InstallModal />);

    fireEvent.click(getByText('Install'));
    expect(promptToInstall).toHaveBeenCalled();
  });

  it('can be closed', () => {
    mockUsePwaInstallation.mockReturnValue({ hasPrompt: true });
    const { getByText, queryByText } = render(<InstallModal />);

    fireEvent.click(getByText('Not now'));
    expect(queryByText('Not now')).toBeNull();
  });
});
