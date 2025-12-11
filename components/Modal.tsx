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
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-luxury-900 md:border border-gold-500/20 md:rounded-xl w-full max-w-2xl h-[90dvh] md:h-auto md:max-h-[90vh] flex flex-col shadow-2xl shadow-black animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-300 rounded-t-2xl overflow-hidden ring-1 ring-white/5">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-luxury-border shrink-0 bg-luxury-950/50">
          <h2 className="text-xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 truncate pr-4 tracking-wide">{title}</h2>
          <button 
            onClick={onClose} 
            className="p-2 bg-luxury-800 md:bg-transparent rounded-full text-gray-500 hover:text-gold-400 transition-colors hover:bg-luxury-800"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 md:p-6 overflow-y-auto custom-scrollbar flex-1 bg-luxury-900">
          {children}
        </div>

        {footer && (
          <div className="p-4 md:p-6 border-t border-luxury-border bg-luxury-950/50 md:rounded-b-xl shrink-0 safe-area-bottom">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};