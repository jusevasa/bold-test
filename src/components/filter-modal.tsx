import React, { useState, useRef, useEffect } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';

import { useSales } from '../hooks/useSalesContext';

interface FilterModalProps {
  isLoading: boolean;
}

export const FilterModal: React.FC<FilterModalProps> = ({ isLoading }) => {
  const { state, dispatch } = useSales();
  const { filters } = state;

  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const toggleModal = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setTempFilters(filters);
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;

    setTempFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
      ...(name === 'all' ? { dataphone: false, paymentLink: false } : {}),
      ...(name === 'dataphone' ? { all: false, paymentLink: false } : {}),
      ...(name === 'paymentLink' ? { all: false, dataphone: false } : {}),
    }));
  };

  const isButtonDisabled =
    isLoading ||
    (tempFilters.dataphone === false &&
      tempFilters.paymentLink === false &&
      tempFilters.all === false);

  const handleApply = () => {
    if (isButtonDisabled) return;
    dispatch({ type: 'SET_FILTERS', payload: tempFilters });
    toggleModal();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className='flex justify-end'>
      <button
        className={`font-bold text-sm self-end 
              transition-colors bg-white shadow-md 
              pl-8 pr-4 py-2 rounded-md flex 
              justify-center items-center gap-x-1 
              ${
                isLoading
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  : 'hover:bg-slate-50 text-primary'
              }`}
        ref={buttonRef}
        onClick={toggleModal}
        aria-haspopup='true'
        aria-expanded={isOpen}
        disabled={isLoading}
      >
        Filtrar
        <SlidersHorizontal className='w-4 h-4' />
      </button>
      <div
        ref={modalRef}
        className={`fixed bg-white rounded-lg shadow-lg w-64 z-10
                transition-transform duration-300 ease-in-out
                ${
                  isOpen
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-[-20px] scale-50'
                }`}
        role='dialog'
        aria-modal='true'
      >
        <div className='p-4'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-xs mx-auto text-center text-primary'>
              Filtrar
            </h3>
            <button
              onClick={toggleModal}
              className='text-gray-600 hover:text-gray-800'
              aria-label='Cerrar'
            >
              <X size={20} />
            </button>
          </div>
          <div className='space-y-3'>
            <FilterCheckbox
              label='Cobro con datáfono'
              name='dataphone'
              checked={tempFilters.dataphone}
              onChange={handleCheckboxChange}
            />
            <FilterCheckbox
              label='Cobro con link de pago'
              name='paymentLink'
              checked={tempFilters.paymentLink}
              onChange={handleCheckboxChange}
            />
            <FilterCheckbox
              label='Ver todos'
              name='all'
              checked={tempFilters.all}
              onChange={handleCheckboxChange}
            />
          </div>
          <button
            onClick={handleApply}
            disabled={isButtonDisabled}
            className={`mt-4 w-full py-2 rounded-full transition duration-300 ${
              isButtonDisabled
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-secondary text-white hover:bg-red-600'
            }`}
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
};

interface FilterCheckboxProps {
  label: string;
  name: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FilterCheckbox: React.FC<FilterCheckboxProps> = ({
  label,
  name,
  checked,
  onChange,
}) => (
  <label className='flex items-center space-x-2'>
    <input
      type='checkbox'
      name={name}
      checked={checked}
      onChange={onChange}
      className='form-checkbox text-primary'
    />
    <span className='text-sm text-primary'>{label}</span>
  </label>
);
