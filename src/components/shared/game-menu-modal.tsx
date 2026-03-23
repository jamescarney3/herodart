import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { Link } from 'react-router';

interface GameMenuDialogProps {
  open?: boolean;
  onClose: () => void;
}

/**
 * generic game menu dialog
 *
 */
const GameMenuDialog = ({ open, onClose }: GameMenuDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogBackdrop className="fixed inset-0 bg-black/50" />
      {/* container div relative to which to position content */}
      <div className="fixed inset-0">
        <DialogPanel className="bg-neutral-800 m-2 p-2">
          <DialogTitle as="h1" className="text-xl">
            Game Menu
          </DialogTitle>
          <Description as="div" className="mt-4">
            <Link className="btn block text-xl text-center w-full" to="/">
              Quit game
            </Link>
            <button className="w-full" onClick={onClose}>
              Cancel
            </button>
          </Description>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default GameMenuDialog;
