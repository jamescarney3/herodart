import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, cleanup, fireEvent } from '@testing-library/react';

import usePwaInstallation from '~/hooks/use-pwa-installation';
import { runningInStandalone, hasBeforeInstallPromptEvent, runningOnIOS } from '~/lib/utils';

vi.mock('~/lib/utils');

const DummyComponent = () => {
  const { inStandaloneMode, hasPrompt, onIOS, promptToInstall } = usePwaInstallation();

  return (
    <>
      {inStandaloneMode && <div data-testid="inStandaloneMode" />}
      {hasPrompt && <div data-testid="hasPrompt" />}
      {onIOS && <div data-testid="onIOS" />}
      <button onClick={promptToInstall}>prompt</button>
    </>
  );
};

describe('usePwaInstallation custom hook', () => {
  const mockRunningInStandalone = vi.mocked(runningInStandalone);
  const mockHasBeforeInstallPromptEvent = vi.mocked(hasBeforeInstallPromptEvent);
  const mockRunningOnIOS = vi.mocked(runningOnIOS);

  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  it('passes through platform information', () => {
    const { rerender, queryByTestId } = render(<DummyComponent />);

    expect(queryByTestId('inStandaloneMode')).not.to.exist;
    expect(queryByTestId('hasPrompt')).not.to.exist;
    expect(queryByTestId('onIOS')).not.to.exist;

    mockRunningInStandalone.mockReturnValue(true);
    mockHasBeforeInstallPromptEvent.mockReturnValue(true);
    mockRunningOnIOS.mockReturnValue(true);

    rerender(<DummyComponent />);

    expect(queryByTestId('inStandaloneMode')).to.exist;
    expect(queryByTestId('hasPrompt')).to.exist;
    expect(queryByTestId('onIOS')).to.exist;
  });

  it('passes through callback to call BeforeInstallPromptEvent method', () => {
    const beforeInstallPromptEvent = new Event('beforeinstallprompt');
    beforeInstallPromptEvent.prompt = vi.fn();
    window.dispatchEvent(beforeInstallPromptEvent);

    const { getByText } = render(<DummyComponent />);
    fireEvent.click(getByText('prompt'));

    expect(beforeInstallPromptEvent.prompt).toHaveBeenCalled();
  });
});
