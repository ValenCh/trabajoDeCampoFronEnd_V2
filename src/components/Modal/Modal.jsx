import React, { useEffect } from 'react';
import './Modal.css';

/**
 * Modal - Componente de modal reutilizable
 * 
 * Props:
 * - isOpen: boolean → controla visibilidad
 * - onClose: function → callback al cerrar
 * - title: string → título del modal
 * - buttons: array → configuración de botones
 * - size: 'small' | 'medium' | 'large'
 * - children: React.Node → contenido del modal
 * 
 * Formato de buttons:
 * [
 *   { label: 'Cancelar', onClick: fn, variant: 'secondary' },
 *   { label: 'Guardar', type: 'submit', formId: 'mi-form', variant: 'primary' }
 * ]
 */
const Modal = ({ 
  isOpen = false,
  onClose, 
  title,
  buttons = [],
  size = "medium",
  children
}) => {
  // Cerrar modal con ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // No renderizar si no está abierto
  if (!isOpen) return null;

  // Handler para botones de tipo submit
  const handleButtonClick = (button) => {
    if (button.type === 'submit' && button.formId) {
      // Disparar submit del formulario
      const form = document.getElementById(button.formId);
      if (form) {
        form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      }
    } else if (button.onClick) {
      button.onClick();
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className={`modal-container modal-${size}`} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">{title}</h2>
          <button 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Cerrar modal"
            type="button"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {children}
        </div>

        {/* Footer con botones */}
        {buttons && buttons.length > 0 && (
          <div className="modal-footer">
            {buttons.map((button, index) => (
              <button
                key={index}
                type="button"
                className={`modal-btn modal-btn-${button.variant || 'primary'}`}
                onClick={() => handleButtonClick(button)}
                disabled={button.disabled}
              >
                {button.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;