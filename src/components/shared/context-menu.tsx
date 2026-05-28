import { Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import { useToggle } from '~/hooks';

interface ContextMenuOption {
  label: string;
  onClick: () => void;
}

interface ContextMenuProps {
  options?: ContextMenuOption[];
}

const ContextMenu = ({ options = [] }: ContextMenuProps) => {
  const [open, toggleOpen] = useToggle(false);

  const renderMenuOption = (option: ContextMenuOption, idx: number) => (
    <button key={`context-menu-option-${idx}`} className="w-full" onClick={option.onClick}>
      {option.label}
    </button>
  );

  return (
    <>
      <button onClick={toggleOpen} className="absolute right-2 top-2 p-0 h-[2.5em] w-[2.5em] text-base">
        <Icon icon={faBars} />
      </button>
      <Dialog open={open} onClose={toggleOpen}>
        <DialogBackdrop className="fixed inset-0 bg-black/50" />
        {/* container div relative to which to position content */}
        <div className="fixed inset-0">
          <DialogPanel className="bg-neutral-800 m-2 p-2">
            <DialogTitle as="h1" className="text-xl">
              Game Menu
            </DialogTitle>
            <Description as="div" className="mt-4">
              {options.map(renderMenuOption)}
              <button className="w-full" onClick={toggleOpen}>
                Cancel
              </button>
            </Description>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default ContextMenu;
