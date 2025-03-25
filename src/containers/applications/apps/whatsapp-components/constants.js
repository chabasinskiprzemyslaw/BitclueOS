/**
 * API URLs
 */
// Use the original URLs that were working
export const API_URL = "https://localhost:5001/chats/sessions";
export const API_MESSAGES_URL = "https://localhost:5001/chats";
export const API_AUTH_URL = "https://localhost:5001/auth";

/**
 * SignalR Hub URL
 */
export const SIGNALR_HUB_URL = "https://localhost:5001/hubs/chat";

/**
 * Debug mode flag
 */
export const DEBUG_MODE = true;

/**
 * Connection status constants
 */
export const CONNECTION_STATUS = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  RECONNECTING: 'reconnecting',
  DISCONNECTED: 'disconnected',
  ERROR: 'error'
};

/**
 * Heartbeat interval in milliseconds
 * 45 seconds is a good balance between keeping the connection alive
 * and not overwhelming the server with requests
 */
export const HEARTBEAT_INTERVAL = 45000;

/**
 * Maximum reconnection attempts
 */
export const MAX_RECONNECTION_ATTEMPTS = 5;

/**
 * Reconnection delay in milliseconds
 * This is the base delay, which will be multiplied by the attempt number
 */
export const RECONNECTION_DELAY = 2000;

/**
 * Maximum reconnection delay in milliseconds
 */
export const MAX_RECONNECTION_DELAY = 30000;

/**
 * Typing indicator timeout in milliseconds
 * This is how long the typing indicator will be shown after a user stops typing
 */
export const TYPING_INDICATOR_TIMEOUT = 3000;

/**
 * Typing debounce delay in milliseconds
 * This is how long to wait after a user stops typing before sending a "stopped typing" event
 */
export const TYPING_DEBOUNCE_DELAY = 1000;

/**
 * Message fetch limit
 * This is the maximum number of messages to fetch at once
 */
export const MESSAGE_FETCH_LIMIT = 50;

/**
 * NPC typing simulation constants
 */
export const NPC_TYPING = {
  MIN_DELAY: 800,
  MAX_DELAY: 3000,
  BASE_SPEED: 10 // characters per second
};

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_INFO: 'user_info',
  THEME: 'whatsapp_theme'
};

/**
 * Default avatar URL
 */
export const DEFAULT_AVATAR = '/placeholder.svg';

/**
 * Default theme
 */
export const DEFAULT_THEME = 'light';

/**
 * Message types
 */
export const MESSAGE_TYPES = {
  TEXT: 'text',
  IMAGE: 'image',
  FILE: 'file',
  SYSTEM: 'system'
};

/**
 * Maximum message length
 */
export const MAX_MESSAGE_LENGTH = 2000;

/**
 * Initial chats for development/testing
 */
export const INITIAL_CHATS = [
  {
    id: 1,
    name: "John Doe",
    avatar: "/placeholder.svg",
    lastMessage: "Hey, how are you?",
    timestamp: "12:30 PM",
    unread: true,
    messages: [
      { id: 1, text: "Hey, how are you?", sent: false, time: "12:25 PM" },
      { id: 2, text: "I'm good, thanks! How about you?", sent: true, time: "12:27 PM" },
      { id: 3, text: "Pretty good! Want to grab lunch?", sent: false, time: "12:30 PM" },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    avatar: "/placeholder.svg",
    lastMessage: "Meeting at 3 PM",
    timestamp: "10:45 AM",
    unread: false,
    messages: [
      { id: 1, text: "Hi, are we still meeting today?", sent: false, time: "10:30 AM" },
      { id: 2, text: "Yes, let's meet at 3 PM", sent: true, time: "10:35 AM" },
      { id: 3, text: "Meeting at 3 PM", sent: false, time: "10:45 AM" },
    ],
  },
  {
    id: 3,
    name: "Team Chat",
    avatar: "/placeholder.svg",
    lastMessage: "Alice: I've pushed the changes",
    timestamp: "Yesterday",
    unread: false,
    messages: [
      { id: 1, text: "Bob: Has everyone reviewed the PR?", sent: false, time: "Yesterday, 4:30 PM" },
      { id: 2, text: "I'll take a look now", sent: true, time: "Yesterday, 4:45 PM" },
      { id: 3, text: "Alice: I've pushed the changes", sent: false, time: "Yesterday, 5:15 PM" },
    ],
  }
];

/**
 * Create a special heartbeat group ID that won't conflict with real chat IDs
 */
export const HEARTBEAT_GROUP = "heartbeat-ping"; 