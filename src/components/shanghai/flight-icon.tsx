import type { ReactNode } from 'react';

/*
  NB: half-ass placeholder component for now; this should really convey the shape of a dart flight
  instead of a circle, but best not to let what will be some annoying and effort-unpredictable SVG
  wrangling become a meaningful blocker
*/

interface FlightIconProps {
  className?: string;
  children?: ReactNode;
  editing?: boolean;
  complete?: boolean;
}

const FlightIcon = ({ editing, complete, children, className }: FlightIconProps) => {
  const iconClassName = [
    'rounded-full bg-opacity-50 flex flex-col justify-center transition-colors',
    !(complete || editing) && 'bg-neutral-500',
    complete && 'bg-green-500',
    editing && 'bg-opacity-75 bg-yellow-500',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={iconClassName}>
      <div className="text-center">{children}</div>
    </div>
  );
};

export default FlightIcon;
