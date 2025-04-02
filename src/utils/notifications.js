import store from '../reducers';

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

/**
 * Setup WebSocket for backend-triggered notifications
 * This is a mock implementation - replace with actual backend connection
 */
let notificationSocket = null;

export const initNotificationService = () => {
  // In a real implementation, you would connect to your actual backend
  // This is just a simulation for demonstration purposes
  
  // Mock WebSocket events for demonstration
  setTimeout(() => {
    // Simulate receiving a notification from backend
    showNotification({
      title: 'Last record was not saved',
      message: 'Do you want to save it?',
      icon: 'settings',
      buttons: [
        {
          text: 'Open and save',
          action: {
            type: 'AUDIOPLAYER',
            payload: { 
                "info": {
                          "icon": "music",
                          "url": "https://samplelib.com/lib/preview/mp3/sample-15s.mp3",
                          "size": "2.1 MB",
                          "duration": "0:15",
                          "dateCreated": "2023-09-17",
                          "dateModified": "2023-09-17",
                          "type": "audio",
                          "isDirTrigger": true
                        } 
                    }
          }
        }
      ],
      time: 10000
    });
  }, 3000);
};

// Function to simulate backend trigger (for testing)
export const simulateBackendNotification = (options) => {
  return showNotification(options);
}; 