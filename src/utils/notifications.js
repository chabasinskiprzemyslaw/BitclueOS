import store from '../reducers';
import * as signalR from '@microsoft/signalr';

/**
 * Create and show a new notification
 * @param {Object} options Notification options
 * @param {string} options.title Title of the notification
 * @param {string} options.message Message/content of the notification
 * @param {string|Object} options.icon Icon for the notification (icon name or fontawesome icon)
 * @param {Array} options.buttons Array of buttons with text and action
 * @param {number} options.time Time in milliseconds to show notification (default: 5000)
 * @returns {number} ID of the created notification
 */
export const showNotification = (options) => {
  const id = Date.now();
  
  store.dispatch({
    type: 'ADD_NOTIFICATION',
    payload: {
      id,
      title: options.title,
      message: options.message,
      icon: options.icon,
      buttons: options.buttons,
      time: options.time
    }
  });
  
  return id;
};

/**
 * Remove a notification by its ID
 * @param {number} id Notification ID
 */
export const removeNotification = (id) => {
  store.dispatch({
    type: 'REMOVE_NOTIFICATION',
    payload: id
  });
};

/**
 * Clear all notifications
 */
export const clearAllNotifications = () => {
  store.dispatch({
    type: 'CLEAR_ALL_NOTIFICATIONS'
  });
};

/**
 * Fetch unresponded notifications from the backend
 * @param {string} userId The user ID to fetch notifications for
 * @returns {Promise} Promise that resolves when notifications are fetched and displayed
 */
export const fetchUnrespondedNotifications = async (userId) => {
  try {
    const authToken = localStorage.getItem('auth_token');
    const response = await fetch(`https://localhost:5001/story-engine/notifications/unresponded?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 204) {
      // No notifications found
      return [];
    }
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to fetch notifications:', errorData);
      throw new Error(errorData.message || 'Failed to fetch notifications');
    }
    
    const notifications = await response.json();
    
    // Process and display each notification
    notifications.forEach(notification => {
      // Map API notification format to the format expected by showNotification
      const formattedButtons = notification.buttons.map(button => ({
        text: button.text,
        action: {
          type: button.actionType,
          payload: JSON.parse(button.actionPayload),
          id: notification.id
        }
      }));
      
      showNotification({
        title: notification.title,
        message: notification.message,
        icon: notification.icon,
        buttons: formattedButtons,
        // Default time if not specified
        time: 10000
      });
    });
    
    return notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// SignalR connection for real-time notifications
let hubConnection = null;

/**
 * Initialize the SignalR notification service
 * @returns {Promise} A promise that resolves when the connection is established
 */
export const initNotificationService = async () => {
  try {
    // Get authentication data
    const userInfo = JSON.parse(localStorage.getItem('user_info'));
    const userIdentityId = userInfo?.id;
    const authToken = localStorage.getItem('auth_token');

    if (!userIdentityId || !authToken) {
      console.error('Missing required authentication data for SignalR connection');
      return;
    }

    // Build the SignalR connection
    hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:5001/hubs/notification`, {
        accessTokenFactory: () => authToken
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000]) // Retry intervals in milliseconds
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Set up the notification handler
    hubConnection.on('NotificationReceived', (notification) => {
      console.log('Real-time notification received:', notification);
      
      // Format the buttons if present
      const buttons = notification.buttons ? notification.buttons.map(button => ({
        text: button.text,
        action: {
          type: button.actionType || 'NOTIFICATION_ACTION',
          payload: typeof button.actionPayload === 'string' 
            ? JSON.parse(button.actionPayload)
            : button.actionPayload,
          id: notification.id
        }
      })) : [];
      
      // Add a special ID prefix for real-time notifications to trigger the animation
      store.dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: `realtime-${notification.id || Date.now()}`,
          title: notification.title,
          message: notification.message,
          icon: notification.icon,
          buttons: buttons,
          time: notification.time || 10000
        }
      });
    });

    // Connection event handlers
    hubConnection.onreconnecting((error) => {
      console.log('Attempting to reconnect to notification hub...', error);
    });

    hubConnection.onreconnected((connectionId) => {
      console.log('Reconnected to notification hub with ID:', connectionId);
      joinUserNotificationGroup(userIdentityId);
    });

    hubConnection.onclose((error) => {
      console.log('Disconnected from notification hub', error);
    });

    // Start the connection
    await hubConnection.start();
    console.log('Connected to notification hub');

    // Join the user's notification group
    await joinUserNotificationGroup(userIdentityId);

    return hubConnection;
  } catch (error) {
    console.error('Error initializing SignalR connection:', error);
    throw error;
  }
};

/**
 * Join the user's notification group
 * @param {string} userIdentityId The user ID to join the group for
 * @returns {Promise} A promise that resolves when the user has joined the group
 */
export const joinUserNotificationGroup = async (userIdentityId) => {
  if (!hubConnection || hubConnection.state !== signalR.HubConnectionState.Connected) {
    console.error('Cannot join notification group: SignalR connection not established');
    return;
  }

  try {
    await hubConnection.invoke('JoinUserNotificationGroup', userIdentityId);
    console.log('Joined notification group for user:', userIdentityId);
  } catch (error) {
    console.error('Error joining notification group:', error);
    throw error;
  }
};

/**
 * Leave the user's notification group
 * @param {string} userIdentityId The user ID to leave the group for
 * @returns {Promise} A promise that resolves when the user has left the group
 */
export const leaveUserNotificationGroup = async (userIdentityId) => {
  if (!hubConnection || hubConnection.state !== signalR.HubConnectionState.Connected) {
    console.error('Cannot leave notification group: SignalR connection not established');
    return;
  }

  try {
    await hubConnection.invoke('LeaveUserNotificationGroup', userIdentityId);
    console.log('Left notification group for user:', userIdentityId);
  } catch (error) {
    console.error('Error leaving notification group:', error);
    throw error;
  }
};

/**
 * Stop the SignalR connection
 * @returns {Promise} A promise that resolves when the connection is stopped
 */
export const stopNotificationService = async () => {
  if (hubConnection) {
    try {
      const userInfo = JSON.parse(localStorage.getItem('user_info'));
      const userIdentityId = userInfo?.id;
      
      if (userIdentityId && hubConnection.state === signalR.HubConnectionState.Connected) {
        await leaveUserNotificationGroup(userIdentityId);
      }
      
      await hubConnection.stop();
      console.log('SignalR notification service stopped');
    } catch (error) {
      console.error('Error stopping SignalR connection:', error);
    }
  }
};

// Function to simulate backend trigger (for testing)
export const simulateBackendNotification = (options) => {
  const id = `realtime-${Date.now()}`;
  
  store.dispatch({
    type: 'ADD_NOTIFICATION',
    payload: {
      id,
      title: options.title || 'Test Notification',
      message: options.message || 'This is a test notification',
      icon: options.icon || 'notification',
      buttons: options.buttons || [],
      time: options.time || 5000
    }
  });
  
  return id;
}; 