import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import css from './Modal.module.css';

interface Props {
  children: React.ReactNode;
  onClose: () => void;
}

const modalRoot = document.getElementById('modal-root')!;

export default function Modal({
  children,
  onClose,
}: Props) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener(
        'keydown',
        handleEscape
      );
    };
  }, [onClose]);

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={css.modal}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    modalRoot
  );
}