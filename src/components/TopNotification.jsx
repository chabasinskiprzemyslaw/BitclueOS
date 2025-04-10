import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Duration for auto-dismiss in milliseconds
const NOTIFICATION_DURATION = 5000;

const TopNotification = () => {
  const { isVisible, message, details, type, queue } = useSelector(state => state.gameNotifications);
  const dispatch = useDispatch();
  const timerRef = useRef(null);
  const [isExiting, setIsExiting] = useState(false);

  // Handle auto-dismiss
  useEffect(() => {
    console.log('TopNotification useEffect', { isVisible, queue });
    if (isVisible) {
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      
      // Reset exit state if it was set
      setIsExiting(false);
      
      // Set new timer
      timerRef.current = setTimeout(() => {
        handleClose();
      }, NOTIFICATION_DURATION);
    }
    
    // Clean up on unmount or when isVisible changes
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isVisible, queue, dispatch]);

  const handleClose = () => {
    // Start exit animation
    setIsExiting(true);
    
    // Dispatch the hide action after animation completes
    // This will either clear the notification or show the next one from the queue
    setTimeout(() => {
      dispatch({ type: 'HIDE_GAME_NOTIFICATION' });
    }, 300); // Match animation duration
  };

  // Don't render anything if not visible
  if (!isVisible) return null;

  // Determine type-specific styles
  const typeStyles = {
    objective: 'border-l-4 border-blue-500 bg-blue-900/80',
    note: 'border-l-4 border-amber-500 bg-amber-900/80'
  };
  
  const bgStyle = typeStyles[type] || 'bg-gray-800/90';

  return (
    <div 
      className={`fixed top-0 left-1/2 transform -translate-x-1/2 w-[400px] max-w-[90%] z-[9999] 
        rounded-b-lg shadow-lg ${bgStyle} transition-all duration-300 
        ${isExiting ? 'animate-slide-up' : 'animate-slide-down'}`}
    >
      {/* Progress bar */}
      <div className="w-full bg-gray-700/30 h-0.5">
        <div 
          className="h-full bg-white/50 transition-all duration-300 ease-linear"
          style={{ width: `${isExiting ? '0%' : '100%'}` }}
        />
      </div>
      
      <div className="p-3 flex justify-between items-start">
        <div className="flex-1 pr-2">
          <div className="font-semibold text-white text-base">{message}</div>
          {details && (
            <div className="text-gray-200 text-sm mt-1 opacity-90">{details}</div>
          )}
        </div>
        <button 
          onClick={handleClose}
          className="text-white/70 hover:text-white focus:outline-none text-xl leading-none px-1"
          aria-label="Close notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default TopNotification; 