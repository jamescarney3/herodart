import { useState } from 'react';
import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faCompass, faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';

import { usePwaInstallation } from '~/hooks';

const InstallButton = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { inStandaloneMode, hasPrompt, onIOS, promptToInstall } = usePwaInstallation();

  const handleClose = () => {
    setIsOpen(false);
  };

  const getInstructions = () => {
    if (onIOS) {
      return (
        <div className="mt-4 flex flex-col gap-2">
          <hr />
          <div><Icon icon={faCompass} /> Open your main browser</div>
          <div><Icon icon={faArrowUpFromBracket} /> Press "Share" in navigation bar</div>
          <div><Icon icon={faSquarePlus} /> Press "Add to Home Screen"</div>
          <button onClick={handleClose}>Not now</button>
        </div>
      );
    } else if (hasPrompt) {
      return (
        <div className="flex gap-2 mt-4">
          <button onClick={promptToInstall} className="btn-success w-1/2">Install</button>
          <button onClick={handleClose} className="w-1/2">Not now</button>
        </div>
      );
    } else {
      return (
        <div>
          Open in your main browser (Safari on iOS or Chrome) and follow instructions to install
        </div>
      );
    }
  };

  // return early if app is already running in standalone mode
  if (inStandaloneMode) return null;

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/50" />
      {/* container div relative to which to position content */}
      <div className="fixed inset-0">
        {/* dialog content */}
        <DialogPanel className="bg-neutral-800 m-2 p-2">
          <DialogTitle as="h1" className="text-xl">Download Herodart</DialogTitle>
          <Description as="div" className="mt-4">
            <p>
              Herodart can be installed on your device for standalone app functionality and offline
              availability
            </p>
            {getInstructions()}
          </Description>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default InstallButton;
