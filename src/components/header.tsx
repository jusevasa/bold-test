import { CircleHelp } from 'lucide-react';

import { BoldIcon } from './icons/bold-icon';

export const Header = () => {
  return (
    <header className='bg-gradient-to-r from-primary to-secondary w-full'>
      <div className='mx-auto max-w-5xl flex justify-between items-center p-6'>
        <BoldIcon className='fill-white' />
        <nav>
          <ul className='flex flex-row justify-center items-center gap-x-12 text-white text-sm'>
            <li>Mi negocio</li>
            <li className='flex gap-1 justify-center items-center'>
              Ayuda
              <CircleHelp className='w-4 h-4' />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
