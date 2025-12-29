import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast]);
  const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast]);
  const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast]);
  const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, success, error, info, warning }}>
      {children}
      {/* Desktop: top-right, Mobile: bottom-center */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm md:block hidden">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 space-y-2 w-[calc(100%-2rem)] max-w-sm md:hidden">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} isMobile />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const Toast = ({ id, message, type, duration = 3000, onClose, isMobile = false }) => {
  const [progress, setProgress] = useState(100);
  const [touchStart, setTouchStart] = useState(null);
  const [touchOffset, setTouchOffset] = useState(0);

  useEffect(() => {
    if (duration > 0) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);
      }, 16); // ~60fps

      return () => clearInterval(interval);
    }
  }, [duration]);

  const handleTouchStart = (e) => {
    if (isMobile) {
      setTouchStart(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (isMobile && touchStart !== null) {
      const currentTouch = e.touches[0].clientY;
      const offset = currentTouch - touchStart;
      if (offset > 0) { // Only allow downward swipe
        setTouchOffset(offset);
      }
    }
  };

  const handleTouchEnd = () => {
    if (isMobile) {
      if (touchOffset > 50) { // Swipe threshold
        onClose();
      }
      setTouchStart(null);
      setTouchOffset(0);
    }
  };

  const icons = {
    success: <CheckCircle size={20} className="text-green-500 shrink-0" />,
    error: <AlertCircle size={20} className="text-red-500 shrink-0" />,
    info: <Info size={20} className="text-blue-500 shrink-0" />,
    warning: <AlertTriangle size={20} className="text-yellow-500 shrink-0" />,
  };

  const bgColors = {
    success: 'bg-white border-green-200',
    error: 'bg-white border-red-200',
    info: 'bg-white border-blue-200',
    warning: 'bg-white border-yellow-200',
  };

  const progressColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };

  const animationClass = isMobile ? 'animate-slide-in-up' : 'animate-slide-in-right';

  return (
    <div
      className={`${bgColors[type]} border-2 rounded-xl shadow-lg overflow-hidden ${animationClass} transition-transform`}
      style={{ transform: `translateY(${touchOffset}px)` }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="p-4 flex items-start gap-3 min-w-[280px]">
        {icons[type]}
        <p className="flex-1 text-sm text-gray-900 font-medium leading-relaxed">{message}</p>
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
          aria-label="Close notification"
        >
          <X size={18} />
        </button>
      </div>
      {/* Progress bar */}
      {duration > 0 && (
        <div className="h-1 bg-gray-100">
          <div
            className={`h-full ${progressColors[type]} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

export const useToast = () => useContext(ToastContext);
