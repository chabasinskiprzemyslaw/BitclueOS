import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Notification from './Notification';

const NotificationCenter = () => {
  const notifications = useSelector(state => state.notifications || []);
  const dispatch = useDispatch();

  const dismissNotification = (id) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  return (
    <div className="notification-center">
      {notifications.map(notification => (
        <Notification 
          key={notification.id}
          id={notification.id}
          title={notification.title}
          message={notification.message}
          icon={notification.icon}
          buttons={notification.buttons}
          time={notification.time}
          onDismiss={dismissNotification}
        />
      ))}
    </div>
  );
};

export default NotificationCenter; 