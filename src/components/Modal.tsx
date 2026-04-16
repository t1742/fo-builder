import { useEffect, useRef, type ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="modal-overlay"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="modal-content pip-panel animate-fade-in">
        <div className="flex items-center justify-between px-5 py-3 border-b border-pip-border">
          <span className="text-xs tracking-[0.2em] text-pip-green text-glow"
            style={{ fontFamily: 'VT323, monospace', fontSize: '20px' }}>
            {title}
          </span>
          <button onClick={onClose} className="pip-btn pip-btn-sm text-pip-amber border-pip-amber/30 hover:border-pip-amber">
            ✕
          </button>
        </div>
        <div className="px-5 py-4 overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </div>
    </div>
  );
}
