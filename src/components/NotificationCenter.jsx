import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Notification from './Notification';
import * as signalR from '@microsoft/signalr';

const NotificationCenter = () => {
  const notifications = useSelector(state => state.notifications || []);
  const dispatch = useDispatch();
  const hubConnectionRef = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  const dismissNotification = (id) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  // Fetch initial notifications on component mount
  useEffect(() => {
    fetchInitialNotifications();
    setupSignalRConnection();

    return () => {
      // Clean up the SignalR connection when the component unmounts
      if (hubConnectionRef.current) {
        leaveNotificationGroup();
        hubConnectionRef.current.stop();
      }
    };
  }, []);

  const fetchInitialNotifications = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('user_info'));
      const userIdentityId = userInfo?.id;
      const scenarioId = localStorage.getItem('selected_scenario');
      const authToken = localStorage.getItem('auth_token');

      if (!userIdentityId || !scenarioId || !authToken) {
        console.error('Missing required authentication data');
        return;
      }

      const response = await fetch(`https://localhost:5001/story-engine/notifications`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const notifications = await response.json();
      
      // Add fetched notifications to Redux store
      notifications.forEach(notification => {
        dispatch({ 
          type: 'ADD_NOTIFICATION', 
          payload: notification 
        });
      });
    } catch (error) {
      console.error('Error fetching initial notifications:', error);
    }
  };

  const setupSignalRConnection = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('user_info'));
      const userIdentityId = userInfo?.id;
      const authToken = localStorage.getItem('auth_token');

      if (!userIdentityId || !authToken) {
        console.error('Missing required authentication data for SignalR connection');
        return;
      }

      // Create the connection
      const connection = new signalR.HubConnectionBuilder()
        .withUrl(`https://localhost:5001/hubs/notification`, {
          accessTokenFactory: () => authToken
        })
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      // Handle connection events
      connection.onreconnecting(() => {
        setConnectionStatus('reconnecting');
        console.log('Attempting to reconnect to notification hub...');
      });

      connection.onreconnected(() => {
        setConnectionStatus('connected');
        console.log('Reconnected to notification hub');
        joinNotificationGroup(userIdentityId);
      });

      connection.onclose(() => {
        setConnectionStatus('disconnected');
        console.log('Disconnected from notification hub');
      });

      // Set up notification handler
      connection.on('NotificationReceived', (notification) => {
        console.log('Real-time notification received:', notification);
        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: notification
        });
      });

      // Start the connection
      await connection.start();
      setConnectionStatus('connected');
      console.log('Connected to notification hub');

      // Store the connection in the ref
      hubConnectionRef.current = connection;

      // Join the user's notification group
      joinNotificationGroup(userIdentityId);
    } catch (error) {
      setConnectionStatus('error');
      console.error('Error establishing SignalR connection:', error);
    }
  };

  const joinNotificationGroup = async (userIdentityId) => {
    try {
      if (hubConnectionRef.current && hubConnectionRef.current.state === signalR.HubConnectionState.Connected) {
        await hubConnectionRef.current.invoke('JoinUserNotificationGroup', userIdentityId);
        console.log('Joined notification group for user:', userIdentityId);
      }
    } catch (error) {
      console.error('Error joining notification group:', error);
    }
  };

  const leaveNotificationGroup = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('user_info'));
      const userIdentityId = userInfo?.id;
      
      if (hubConnectionRef.current && 
          hubConnectionRef.current.state === signalR.HubConnectionState.Connected && 
          userIdentityId) {
        await hubConnectionRef.current.invoke('LeaveUserNotificationGroup', userIdentityId);
        console.log('Left notification group for user:', userIdentityId);
      }
    } catch (error) {
      console.error('Error leaving notification group:', error);
    }
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