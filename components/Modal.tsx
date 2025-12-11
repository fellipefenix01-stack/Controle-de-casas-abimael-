import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center md:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-slate-900 md:bg-slate-800 md:border border-slate-700 md:rounded-2xl w-full max-w-2xl h-[90dvh] md:h-auto md:max-h-[90vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-200 rounded-t-2xl">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-700 shrink-0">
          <h2 className="text-lg md:text-xl font-bold text-white truncate pr-4">{title}</h2>
          <button 
            onClick={onClose} 
            className="p-2 bg-slate-800 md:bg-transparent rounded-full text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex-1">
          {children}
        </div>

        {footer && (
          <div className="p-4 md:p-6 border-t border-slate-700 bg-slate-800/50 md:rounded-b-2xl shrink-0 safe-area-bottom">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};