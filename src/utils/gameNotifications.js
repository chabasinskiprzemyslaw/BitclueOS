import store from '../reducers';

/**
 * Show a game notification banner
 * @param {Object} options Notification options
 * @param {string} options.message Main message to display
 * @param {string} options.details Optional details to display
 * @param {string} options.type Type of notification ('objective', 'note', etc.)
 */
export const showGameNotification = (options) => {
  store.dispatch({
    type: 'SHOW_GAME_NOTIFICATION',
    payload: {
      message: options.message || '',
      details: options.details || '',
      type: options.type || null
    }
  });
};

/**
 * Hide the current game notification banner
 */
export const hideGameNotification = () => {
  store.dispatch({
    type: 'HIDE_GAME_NOTIFICATION'
  });
}; 