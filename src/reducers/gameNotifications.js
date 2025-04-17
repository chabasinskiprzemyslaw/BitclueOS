// Reducer for game notifications banner (objectives, notes, etc.)
// This is different from the general notification system

const initialState = {
  isVisible: false,
  message: '',
  details: '',
  type: null,
  queue: [] // Queue to store pending notifications
};

const gameNotificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SHOW_GAME_NOTIFICATION':
      // If nothing is visible, show this notification immediately
      if (!state.isVisible) {
        console.log('Showing notification:', action.payload);

        return {
          ...state,
          isVisible: true,
          message: action.payload.message || '',
          details: action.payload.details || '',
          type: action.payload.type || null,
          queue: [...state.queue] // Keep the existing queue
        };
      } 
      // Otherwise add to queue
      else {
        console.log('Adding to queue:', action.payload);
        return {
          ...state,
          queue: [...state.queue, action.payload]
        };
      }
      
    case 'HIDE_GAME_NOTIFICATION':
      // If queue is empty, hide the notification
      if (state.queue.length === 0) {
        console.log('Hiding notification');
        return initialState;
      } 
      // Otherwise, show the next notification from the queue
      else {
        console.log('Showing next notification from queue');
        const [nextNotification, ...remainingQueue] = state.queue;
        return {
          ...state,
          isVisible: true,
          message: nextNotification.message || '',
          details: nextNotification.details || '',
          type: nextNotification.type || null,
          queue: remainingQueue
        };
      }
      
    default:
      return state;
  }
};

export default gameNotificationsReducer; 