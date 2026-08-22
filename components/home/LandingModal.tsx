import React, { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { RiCloseLine } from 'react-icons/ri';

interface LandingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  eyebrow?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  bodyClassName?: string;
}

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const LandingModal: React.FC<LandingModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  eyebrow,
  icon,
  children,
  size = 'md',
  className = '',
  bodyClassName = '',
}) => {
  const titleId = useId();
  const descriptionId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(focusableSelector));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [isOpen, onClose]);

  if (typeof document === 'undefined' || !isOpen) return null;

  return createPortal(
    <div
      className="landing-modal-layer"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="landing-modal-frame">
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={description ? descriptionId : undefined}
          className={`landing-modal-shell landing-modal-${size} ${className}`}
        >
          <header className="landing-modal-header">
            <div className="landing-modal-heading">
              {icon && <div className="landing-modal-icon" aria-hidden="true">{icon}</div>}
              <div>
                {eyebrow && <p className="landing-modal-eyebrow">{eyebrow}</p>}
                <h2 id={titleId}>{title}</h2>
                {description && <p id={descriptionId} className="landing-modal-description">{description}</p>}
              </div>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label={`Close ${title}`}
              className="landing-modal-close"
            >
              <RiCloseLine aria-hidden="true" />
            </button>
          </header>

          <div className={`landing-modal-body ${bodyClassName}`}>{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LandingModal;
