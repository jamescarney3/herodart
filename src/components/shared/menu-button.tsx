import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

interface MenuButtonProps {
  onClick: () => void;
}

const MenuButton = ({ onClick }: MenuButtonProps) => (
  <button {...{ onClick }} className="absolute right-2 top-2 p-0 h-[2.5em] w-[2.5em] text-base">
    <Icon icon={faBars} />
  </button>
);

export default MenuButton;
