import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Icon } from '../utils/general';

const Notification = ({ id, title, message, icon, buttons, time, onDismiss }) => {
  const dispatch = useDispatch();
  const [isExiting, setIsExiting] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [remainingTime, setRemainingTime] = useState(time || 5000);
  const [timerPaused, setTimerPaused] = useState(false);

  useEffect(() => {
    if (!hovered && !timerPaused && remainingTime > 0) {
      const timer = setTimeout(() => {
        setRemainingTime(prev => Math.max(0, prev - 100));
      }, 100);

      if (remainingTime === 0) {
        handleDismiss();
      }

      return () => clearTimeout(timer);
    }
  }, [remainingTime, hovered, timerPaused]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(id);
    }, 300);
  };

  const handleButtonClick = (action) => {

    if (typeof action === 'string') {
    
      dispatch({ type: action });
    } else if (typeof action === 'object') {
      dispatch(action);
    } else if (typeof action === 'function') {
      action();
    }
    handleDismiss();
  };

  return (
    <div 
      className={`notification-container ${isExiting ? 'notification-exit' : 'notification-enter'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="notification-progress">
        <div 
          className="notification-progress-bar" 
          style={{ width: `${(remainingTime / (time || 5000)) * 100}%` }}
        />
      </div>
      
      <div className="notification-content">
        <div className="notification-icon">
          {icon && (
            typeof icon === 'string' 
              ? <Icon src={icon} />
              : <Icon fafa={icon} />
          )}
        </div>
        <div className="notification-text">
          <div className="notification-title">{title}</div>
          <div className="notification-message">{message}</div>
        </div>
        <div 
          className="notification-close"
          onClick={handleDismiss}
        >
          <Icon fafa="faTimes" />
        </div>
      </div>
      
      {buttons && buttons.length > 0 && (
        <div className="notification-buttons">
          {buttons.map((button, index) => (
            <button 
              key={index} 
              className="notification-button"
              onClick={() => handleButtonClick(button.action)}
            >
              {button.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notification; 