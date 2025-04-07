import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Icon } from '../utils/general';

const Notification = ({ id, title, message, icon, buttons, time, onDismiss }) => {
  const dispatch = useDispatch();
  const [isExiting, setIsExiting] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [remainingTime, setRemainingTime] = useState(time || 5000);
  const [timerPaused, setTimerPaused] = useState(false);

  // Update remaining time if the time prop changes (for real-time notifications)
  useEffect(() => {
    setRemainingTime(time || 5000);
  }, [time]);

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

  const respondToNotification = async (notificationId) => {
    console.log('respondToNotification', notificationId);
    try {
      const userInfo = JSON.parse(localStorage.getItem('user_info'));
      const userIdentityId = userInfo?.id;
      const scenarioId = localStorage.getItem('selected_scenario');
      const authToken = localStorage.getItem('auth_token');

      if (!userIdentityId || !scenarioId) {
        console.error('Missing userIdentityId or scenarioId in localStorage');
        return;
      }

      if (!authToken) {
        console.error('Missing auth_token in localStorage');
        return;
      }

      const response = await fetch(`https://localhost:5001/story-engine/notifications/${notificationId}/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          userIdentityId,
          scenarioId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to respond to notification:', errorData);
      } else {
        console.log('Successfully responded to notification:', notificationId);
      }
    } catch (error) {
      console.error('Error responding to notification:', error);
    }
  };

  const handleButtonClick = (action) => {
    // Safe check for action.payload?.info?.isTriggerBackend
    if (action && 
        typeof action === 'object' && 
        action.payload && 
        action.payload.info && 
        action.payload.info.isTriggerBackend) {
      
      // If notificationId exists in action, respond to it
      if (action.id) {
        respondToNotification(action.id);
      }
    }

    if (typeof action === 'string') {
      dispatch({ type: action });
    } else if (typeof action === 'object') {
      dispatch(action);
    } else if (typeof action === 'function') {
      action();
    }
    handleDismiss();
  };

  // Determine animation class - use different class for real-time notifications
  const animationClass = id.toString().includes('realtime') 
    ? 'notification-realtime' 
    : (isExiting ? 'notification-exit' : 'notification-enter');

  return (
    <div 
      className={`notification-container ${animationClass}`}
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