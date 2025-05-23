import { useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { 
  SIGNALR_HUB_URL, 
  HEARTBEAT_INTERVAL, 
  HEARTBEAT_GROUP,
  CONNECTION_STATUS,
  MAX_RECONNECTION_ATTEMPTS,
  RECONNECTION_DELAY,
  MAX_RECONNECTION_DELAY
} from './constants';
import { debugLog } from './utils';

/**
 * Custom hook for managing a SignalR connection
 * 
 * @param {Object} params - Parameters for the hook
 * @param {boolean} params.isAuthenticated - Whether the user is authenticated
 * @param {string} params.token - Authentication token
 * @param {Object} params.activeChat - The active chat
 * @param {Object} params.activeChatRef - Reference to the active chat
 * @param {Function} params.setConnectionStatus - Function to set connection status
 * @param {Function} params.setActiveChat - Function to set active chat
 * @param {Function} params.setChats - Function to set chats
 * @param {Function} params.setPossibleResponses - Function to set possible responses
 * @param {Function} params.setTypingUsers - Function to set typing users
 * @param {Function} params.fetchChatSessions - Function to fetch chat sessions
 * @param {Function} params.handleUnreadMessage - Function to handle unread message notifications
 * @returns {Object} SignalR connection reference
 */
const useSignalRConnection = ({
  isAuthenticated,
  token,
  activeChat,
  activeChatRef,
  setConnectionStatus,
  setActiveChat,
  setChats,
  setPossibleResponses,
  setTypingUsers,
  fetchChatSessions,
  handleUnreadMessage
}) => {
  // Connection reference
  const hubConnectionRef = useRef(null);
  
  // Heartbeat interval reference
  const heartbeatIntervalRef = useRef(null);
  
  // Static connection flag to prevent multiple connections across re-renders
  // This is crucial to prevent connection loops
  const hasInitializedRef = useRef(false);

  // Initialize SignalR connection
  useEffect(() => {
    // Only create a connection if authenticated and no connection exists
    // and we haven't already tried to initialize
    if (isAuthenticated && !hubConnectionRef.current && !hasInitializedRef.current) {
      debugLog("Starting SignalR connection initialization");
      hasInitializedRef.current = true;
      
      const createHubConnection = async () => {
        try {
          debugLog("Initializing SignalR connection");
          setConnectionStatus(CONNECTION_STATUS.CONNECTING);
          
          // Check if we already have a connection (race condition check)
          if (hubConnectionRef.current) {
            debugLog("Connection already exists, skipping initialization");
            return;
          }
          
          const currentToken = localStorage.getItem('auth_token') || token;
          
          // Create the connection
          const connection = new signalR.HubConnectionBuilder()
            .withUrl(SIGNALR_HUB_URL, {
              accessTokenFactory: () => currentToken
            })
            .withAutomaticReconnect([
              0, 
              RECONNECTION_DELAY, 
              RECONNECTION_DELAY * 2, 
              RECONNECTION_DELAY * 3
            ])
            .configureLogging(signalR.LogLevel.Information)
            .build();
          
          // Store the connection in the ref immediately to prevent race conditions
          hubConnectionRef.current = connection;
          
          // Set up connection event handlers
          connection.onreconnecting(() => {
            debugLog("Attempting to reconnect to SignalR hub...");
            setConnectionStatus(CONNECTION_STATUS.RECONNECTING);
          });
          
          connection.onreconnected(() => {
            debugLog("Reconnected to SignalR hub");
            setConnectionStatus(CONNECTION_STATUS.CONNECTED);
            
            // Only rejoin the active chat session after reconnection
            const currentActiveChat = activeChatRef.current;
            if (currentActiveChat) {
              debugLog(`Rejoining chat session ${currentActiveChat.id} after reconnection`);
              connection.invoke("JoinChatSession", currentActiveChat.id.toString())
                .catch(err => console.error(`Error rejoining chat session ${currentActiveChat.id}:`, err));
            }
            
            // Get user ID from localStorage to rejoin notification group
            try {
              const userInfoStr = localStorage.getItem('user_info');
              if (userInfoStr) {
                const userInfo = JSON.parse(userInfoStr);
                if (userInfo && userInfo.id) {
                  debugLog(`Rejoining user notification group ${userInfo.id} after reconnection`);
                  connection.invoke("JoinUserNotificationGroup", userInfo.id)
                    .catch(err => console.error(`Error rejoining user notification group ${userInfo.id}:`, err));
                }
              }
            } catch (err) {
              console.error("Error parsing user info for notification group rejoin:", err);
            }
          });
          
          connection.onclose(() => {
            debugLog("Disconnected from SignalR hub");
            setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
            hubConnectionRef.current = null;
          });
          
          // Set up message handler
          connection.on("ReceiveMessage", (message) => {
            if (!message) {
              debugLog("Received empty message, ignoring");
              return;
            }
            
            debugLog("Received real-time message:", message);
            
            // Format the received message
            const formattedMessage = formatMsg(message);
            
            
            // Get the current activeChat from the ref
            // This ensures we're always using the latest value
            const currentActiveChat = activeChatRef.current;
            debugLog("activeChat in ReceiveMessage:", currentActiveChat);
            
            // Check if we have an active chat
            if (!currentActiveChat) {
              return updateChatsList(setChats, message, fetchChatSessions, formattedMessage);
            }
            
            // Update the active chat with the new message
            if (message.chatSessionId.toString() === currentActiveChat.id.toString()) {
              // Check if this message is already in the chat (prevent duplicates)
              const messageExists = currentActiveChat.messages && 
                currentActiveChat.messages.some(msg => msg.id === message.id);

              debugLog("messageExists:", messageExists);
              
              if (!messageExists) {
                debugLog("Adding new message to active chat");
                
                // If the message is from another user (not the current user), simulate typing
                if (!message.isCurrentUser) {
                  // First, trigger typing indicator
                  const typingUser = {
                    id: message.senderId || 'other-user',
                    displayName: message.senderDisplayName || 'Someone'
                  };
                  
                  // Simulate typing indicator
                  setTypingUsers(typingUser, message.chatSessionId.toString(), true);
                  
                  // Calculate a realistic typing delay based on message length
                  const messageLength = message.content.length;
                  const typingSpeed = 30; // characters per second
                  const minDelay = 1000; // minimum delay in milliseconds
                  const maxDelay = 3000; // maximum delay in milliseconds
                  
                  // Calculate delay: longer messages take longer to type, but with limits
                  let typingDelay = Math.min(
                    maxDelay, 
                    Math.max(minDelay, messageLength * (1000 / typingSpeed))
                  );
                  
                  // Add some randomness to make it feel more natural
                  typingDelay += Math.random() * 500;
                  
                  debugLog(`Simulating typing for ${typingDelay}ms before showing message`);
                  
                  // After the delay, remove typing indicator and show the message
                  setTimeout(() => {
                    // Remove typing indicator
                    setTypingUsers(typingUser, message.chatSessionId.toString(), false);
                    
                    // Now add the message
                    addMessageAfterTyping();
                    updateChatsList(setChats, message, fetchChatSessions, formattedMessage);
                    addResponses(message, setPossibleResponses);
                  }, typingDelay);
                } else {
                  // If it's the current user's message, add it immediately
                  addMessageAfterTyping();
                }
                
                // Function to add the message (used both after typing delay and immediately)
                function addMessageAfterTyping() {
                  // First, replace any temporary messages with the same content
                  setActiveChat(prevActiveChat => {
                    if (!prevActiveChat) return prevActiveChat;
                    
                    // Check if we have a temporary message with the same content
                    const updatedMessages = prevActiveChat.messages.filter(msg => {
                      // Keep all messages that are not temporary or have different content
                      return !(msg.isTemporary && msg.content === message.content);
                    });
                    
                    // Add the new message
                    const newMessages = [...updatedMessages, formattedMessage];
                    
                    // Create updated chat with new message
                    const updatedChat = {
                      ...prevActiveChat,
                      messages: newMessages,
                      lastMessage: formattedMessage.content,
                      timestamp: formattedMessage.sentAt,
                      _isSignalRUpdate: true // Add a flag to indicate this is a SignalR update
                    };

                    debugLog("updatedChat:", updatedChat);
                    
                    return updatedChat;
                  });
                  
                  // Also update the chat in the chat list
                  setChats(prevChats => {
                    return prevChats.map(chat => {
                      if (chat.id.toString() === message.chatSessionId.toString()) {
                        return {
                          ...chat,
                          lastMessage: message.content,
                          timestamp: formattedMessage.sentAt
                        };
                      }
                      return chat;
                    });
                  });
                }
              } else {
                debugLog("Message already exists in chat, skipping update");
              }
            } else {
              // If the message is for a different chat, update that chat in the list
              setChats(prevChats => {
                // Find the chat this message belongs to
                const chatIndex = prevChats.findIndex(chat => 
                  chat.id.toString() === message.chatSessionId.toString()
                );
                
                if (chatIndex === -1) {
                  // If we don't have this chat in our list yet, fetch chats again
                  debugLog("Chat not found in list, fetching chat sessions");
                  setTimeout(() => fetchChatSessions(), 500);
                  return prevChats;
                }
                
                // Create a new array to avoid mutation
                const updatedChats = [...prevChats];
                
                // Update the specific chat
                updatedChats[chatIndex] = {
                  ...updatedChats[chatIndex],
                  lastMessage: message.content,
                  timestamp: formattedMessage.sentAt,
                  unread: true
                };
                
                return updatedChats;
              });
            }

            function formatMsg(message) {
              return {
                id: message.id,
                content: message.content,
                isCurrentUser: message.isCurrentUser,
                sentAt: message.timestamp || message.sentAt,
                senderDisplayName: message.senderDisplayName,
                // Extract response data if available
                responseData: message.response ? {
                  id: message.response.id,
                  messageId: message.response.messageId,
                  nextMessageId: message.response.nextMessageId,
                  options: message.response.options || [],
                  scenarioId: message.response.scenarioId
                } : null,
                attachments: message.attachments || []
              };
            }
          });
          
          // Set up typing indicator handler
          connection.on("UserTyping", (username, chatSessionId, isTyping) => {
            debugLog(`User ${username} is ${isTyping ? 'typing' : 'not typing'} in chat ${chatSessionId}`);
            
            // Only update typing indicators for the active chat
            const currentActiveChat = activeChatRef.current;
            if (currentActiveChat && currentActiveChat.id && 
                currentActiveChat.id.toString() === chatSessionId.toString()) {
              setTypingUsers(username, chatSessionId, isTyping);
            }
          });
          
          // Set up unread message notification handler
          connection.on("UnreadMessage", (message) => {
            debugLog("Received unread message notification:", message);
            
            // Only process if we have a handler
            if (handleUnreadMessage) {
              handleUnreadMessage(message);
            }
          });
          
          // Start the connection
          await connection.start();
          debugLog("SignalR connection established");
          setConnectionStatus(CONNECTION_STATUS.CONNECTED);
          
          // Start heartbeat to keep connection alive
          if (heartbeatIntervalRef.current) {
            clearInterval(heartbeatIntervalRef.current);
          }
          
          heartbeatIntervalRef.current = setInterval(() => {
            if (connection.state === signalR.HubConnectionState.Connected) {
              debugLog("Sending heartbeat ping");
              connection.invoke("JoinChatSession", HEARTBEAT_GROUP)
                .then(() => {
                  // Immediately leave the heartbeat group
                  return connection.invoke("LeaveChatSession", HEARTBEAT_GROUP);
                })
                .catch(err => {
                  console.error("Error sending heartbeat:", err);
                });
            }
          }, HEARTBEAT_INTERVAL);
          
        } catch (err) {
          console.error("Error establishing SignalR connection:", err);
          setConnectionStatus(CONNECTION_STATUS.ERROR);
          
          // Reset the initialization flag to allow retrying
          setTimeout(() => {
            hasInitializedRef.current = false;
          }, 5000);
        }
      };
      
      createHubConnection();
    }
    
    // Clean up function
    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
    };
  }, [isAuthenticated, token]);
  
  return hubConnectionRef;
};

export default useSignalRConnection; 

function updateChatsList(setChats, message, fetchChatSessions, formattedMessage) {
  debugLog("No active chat, updating chat list only");
  // If no active chat, just update the chat list
  setChats(prevChats => {
    // Find the chat this message belongs to
    const chatIndex = prevChats.findIndex(chat => chat.id.toString() === message.chatSessionId.toString()
    );

    if (chatIndex === -1) {
      // If we don't have this chat in our list yet, fetch chats again
      debugLog("Chat not found in list, fetching chat sessions");
      setTimeout(() => fetchChatSessions(), 500);
      return prevChats;
    }

    // Create a new array to avoid mutation
    const updatedChats = [...prevChats];

    // Update the specific chat
    updatedChats[chatIndex] = {
      ...updatedChats[chatIndex],
      lastMessage: message.content,
      timestamp: formattedMessage.sentAt,
      unread: true
    };

    return updatedChats;
  });
  return;
}

function addResponses(message, setPossibleResponses) {
  if (message.response && message.response.options && message.response.options.length > 0) {
    debugLog("Message contains response options, setting immediately:", message.response.options);

    // Format the response options for the UI - handle both string arrays and object arrays
    const formattedOptions = message.response.options.map((option, index) => {
      // If option is a string, create a simple option object
      if (typeof option === 'string') {
        return {
          optionIndex: index,
          text: option
        };
      }
      // If option is an object, extract relevant properties
      return {
        optionIndex: option.id || index,
        text: option.text || option.content || option.optionText || String(option)
      };
    });

    // Set the possible responses immediately
    setPossibleResponses(formattedOptions);
  }
}
