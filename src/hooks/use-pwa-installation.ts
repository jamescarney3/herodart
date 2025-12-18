import { runningInStandalone, hasBeforeInstallPromptEvent, runningOnIOS } from '~/lib/utils';
import type { BeforeInstallPromptEvent } from '~/lib/utils';

let deferredPrompt: BeforeInstallPromptEvent;

const handleBeforeInstallPrompt = (e: unknown) => {
  (e as BeforeInstallPromptEvent).preventDefault();
  deferredPrompt = e as BeforeInstallPromptEvent;
};

window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

const usePwaInstallation = () => {
  const inStandaloneMode = runningInStandalone();
  const hasPrompt = hasBeforeInstallPromptEvent();
  const onIOS = runningOnIOS();

  const promptToInstall = (): Promise<unknown> => {
    return deferredPrompt?.prompt();
  };

  return { inStandaloneMode, hasPrompt, onIOS, promptToInstall };
};

export default usePwaInstallation;
