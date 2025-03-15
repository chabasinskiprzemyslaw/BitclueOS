import { DEBUG_MODE } from './constants';

/**
 * Helper function for debug logging
 * @param {string} message - The message to log
 * @param {any} data - Optional data to log
 */
export const debugLog = (message, data) => {
  if (DEBUG_MODE) {
    if (data) {
      console.log(`[WhatsApp Debug] ${message}`, data);
    } else {
      console.log(`[WhatsApp Debug] ${message}`);
    }
  }
};

/**
 * Helper function to format date/time
 * @param {string} dateString - The date/time string to format
 * @returns {string} Formatted time string
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    
    // Check if the date is today
    const today = new Date();
    const isToday = date.getDate() === today.getDate() &&
                    date.getMonth() === today.getMonth() &&
                    date.getFullYear() === today.getFullYear();
    
    if (isToday) {
      // Format as time only for today
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      // Format as date and time for other days
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Get the display name for a chat
 * @param {Object} chat - The chat object
 * @returns {string} The display name for the chat
 */
export const getChatDisplayName = (chat) => {
  return chat ? chat.name : "";
};

/**
 * Generate a random delay between min and max
 * @param {number} min - Minimum delay in ms
 * @param {number} max - Maximum delay in ms
 * @returns {number} Random delay in ms
 */
export const getRandomDelay = (min = 500, max = 3000) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Simulate typing delay based on message length
 * @param {string} message - The message to calculate typing time for
 * @param {number} baseSpeed - Base typing speed in characters per second
 * @returns {number} Typing delay in ms
 */
export const calculateTypingDelay = (message, baseSpeed = 10) => {
  if (!message) return 1000;
  
  // Calculate a realistic typing time based on message length
  // Average typing speed is around 40 WPM, which is about 200 CPM or 3.33 CPS
  // We'll use a slightly faster speed for NPCs
  const characterCount = message.length;
  const minDelay = 800; // Minimum delay to show typing indicator
  
  // Calculate delay with some randomness
  const typingTime = (characterCount / baseSpeed) * 1000;
  
  // Add some randomness (±20%)
  const randomFactor = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2
  
  return Math.max(minDelay, typingTime * randomFactor);
};

/**
 * Truncate text to a specific length with ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 30) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
};

/**
 * Check if a string is a valid URL
 * @param {string} str - The string to check
 * @returns {boolean} Whether the string is a valid URL
 */
export const isValidUrl = (str) => {
  try {
    new URL(str);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Generate a unique ID
 * @returns {string} A unique ID
 */
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

/**
 * Debounce a function
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce wait time in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle a function
 * @param {Function} func - The function to throttle
 * @param {number} limit - The throttle limit in ms
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}; 