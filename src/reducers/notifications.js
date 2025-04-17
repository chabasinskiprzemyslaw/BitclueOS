
const debugLogger = (componentName, action, data) => {
    // Set to true to enable logging, false to disable
    const enableLogging = false;
    
    if (enableLogging) {
      console.log(`[${componentName}] ${action}`, data || '');
    }
  };

const initialState = [];

let nextNotificationId = 1;


const notificationsReducer = (state = initialState, action) => {

    debugLogger('[Notifications reducer][reducers/notifications.js] START', action.type, action.payload);
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return [
        ...state,
        {
          id: action.payload.id || nextNotificationId++,
          title: action.payload.title || 'Notification',
          message: action.payload.message || '',
          icon: action.payload.icon || 'notification',
          buttons: action.payload.buttons || [],
          time: action.payload.time || 5000, // Default 5 seconds
          timestamp: Date.now()
        }
      ];
      
    case 'REMOVE_NOTIFICATION':
      return state.filter(notification => notification.id !== action.payload);
      
    case 'CLEAR_ALL_NOTIFICATIONS':
      return [];
      
    default:
      return state;
  }
};

export default notificationsReducer; 