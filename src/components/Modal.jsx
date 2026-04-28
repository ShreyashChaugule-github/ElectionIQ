import React from 'react';

function Modal({ isOpen, onClose, title, children, footer }) {
  if (!isOpen) return null;

  return (
    <div 
      className="modal-bg" 
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      <div 
        className="modal" 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title">{title}</h2>
          <button 
            className="modal-close" 
            onClick={onClose} 
            type="button" 
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export default Modal;
