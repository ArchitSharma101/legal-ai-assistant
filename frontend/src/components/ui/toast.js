import React, { createContext, useContext, useState, useCallback } from 'react';
import './toast.css';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now();
    const newToast = { id, ...toast };
    setToasts(prev => [...prev, newToast]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const toast = useCallback((props) => {
    return addToast(props);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const Toast = ({ toast, onClose }) => {
  const getToastIcon = (variant) => {
    switch (variant) {
      case 'success':
        return '✅';
      case 'error':
      case 'destructive':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  const getToastClass = (variant) => {
    switch (variant) {
      case 'success':
        return 'toast-success';
      case 'error':
      case 'destructive':
        return 'toast-error';
      case 'warning':
        return 'toast-warning';
      default:
        return 'toast-info';
    }
  };

  return (
    <div className={`toast ${getToastClass(toast.variant)}`}>
      <div className="toast-content">
        <span className="toast-icon">{getToastIcon(toast.variant)}</span>
        <div className="toast-text">
          {toast.title && <div className="toast-title">{toast.title}</div>}
          {toast.description && <div className="toast-description">{toast.description}</div>}
        </div>
        <button className="toast-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};
