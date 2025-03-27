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