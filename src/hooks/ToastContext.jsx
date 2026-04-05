import { createContext, useContext, useState, useCallback } from 'react';
import './Toast.css';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(currentToasts => [...currentToasts, { id, message, type }]);
    
    // Auto-remove after 3.5 seconds
    setTimeout(() => {
      setToasts(currentToasts => currentToasts.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(currentToasts => currentToasts.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type} glass-panel slide-in`}>
            <span>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="toast-close">&times;</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
