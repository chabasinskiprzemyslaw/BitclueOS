/**
 * API configuration service
 * Centralizes API URL management for different environments
 */

// Get the API base URL from environment variables
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:5001';

// Define hub URLs
export const HUB_URLS = {
  NOTIFICATION: `${API_BASE_URL}/hubs/notification`,
  CHAT: `${API_BASE_URL}/hubs/chat`,
  EMAIL: `${API_BASE_URL}/hubs/email`,
  NOTES: `${API_BASE_URL}/hubs/notes`,
  OBJECTIVE: `${API_BASE_URL}/hubs/objective`
};

// Define API endpoints
export const API_ENDPOINTS = {
  // Story Engine
  STORY_ENGINE: {
    SCENARIOS: `${API_BASE_URL}/story-engine/scenarios`,
    NOTIFICATIONS: `${API_BASE_URL}/story-engine/notifications`,
    UNRESPONDED_NOTIFICATIONS: (userId) => `${API_BASE_URL}/story-engine/notifications/unresponded?userId=${userId}`,
    RESPOND_NOTIFICATION: (notificationId) => `${API_BASE_URL}/story-engine/notifications/${notificationId}/respond`,
    CURRENT_STEP_OBJECTIVES: (scenarioId, userIdentityId) => 
      `${API_BASE_URL}/story-engine/scenarios/${scenarioId}/current-step-objectives?userIdentityId=${userIdentityId}`,
    NOTES: (scenarioId, userIdentityId) => 
      `${API_BASE_URL}/story-engine/scenarios/${scenarioId}/notes?userId=${userIdentityId}`,
    MARK_NOTE_READ: (scenarioId, noteId, userIdentityId) => 
      `${API_BASE_URL}/story-engine/scenarios/${scenarioId}/notes/${noteId}/mark-read?userIdentityId=${userIdentityId}`,
    TRIGGER_FILE_ACTION: `${API_BASE_URL}/storyengine/fileexplorer/files/trigger-action`,
    TRIGGER_APP: `${API_BASE_URL}/storyengine/fileexplorer/files/trigger-app`,
    TRIGGER_BROWSER_EVENT: `${API_BASE_URL}/storyengine/browser/trigger-event`,
    TRIGGER_CHAT_EVENT: `${API_BASE_URL}/storyengine/chat/trigger-event`
  },
  
  // Chat Services
  CHAT: {
    PRIVATE_SESSIONS: `${API_BASE_URL}/chats/sessions/priv`,
    MESSAGES: `${API_BASE_URL}/chats`,
    SESSIONS: `${API_BASE_URL}/chats/sessions`
  },
  
  // Email Services
  EMAIL: {
    LOGIN: `${API_BASE_URL}/emails/accounts/login`,
    ACCOUNT_PROFILE: (accountId) => `${API_BASE_URL}/emails/accounts/${accountId}/profile`,
    FOLDER_MESSAGES: (accountId, folderName) => `${API_BASE_URL}/emails/${accountId}/messages/folder/${folderName}`,
    MESSAGE: (messageId) => `${API_BASE_URL}/emails/messages/${messageId}`,
    MARK_READ: (messageId) => `${API_BASE_URL}/emails/messages/${messageId}/read`
  },
  
  // Auth
  AUTH: `${API_BASE_URL}/auth`,
  
  // Social Media
  SOCIAL_MEDIA: {
    LOGIN: `${API_BASE_URL}/social-media/users/login`,
    USER: (userId) => `${API_BASE_URL}/social-media/users/${userId}`,
    DIRECT_MESSAGES: (userInfoId, scenarioId) => 
      `${API_BASE_URL}/social-media/users/${userInfoId}/direct-messages?scenarioId=${scenarioId}`,
    FEED: (authorUserId, scenarioId, userIdentityId) => 
      `${API_BASE_URL}/api/social-media/feed?authorUserId=${encodeURIComponent(authorUserId)}&scenarioId=${encodeURIComponent(scenarioId)}&userIdentityId=${encodeURIComponent(userIdentityId)}`
  }
};

export default {
  API_BASE_URL,
  HUB_URLS,
  API_ENDPOINTS
}; 