import { useCallback, useRef } from 'react';
import { API_URL, API_MESSAGES_URL, STORAGE_KEYS } from './constants';
import { debugLog, formatDateTime } from './utils';

/**
 * Custom hook for WhatsApp API calls
 * @param {Object} params - Parameters for the hook
 * @param {string} params.token - Authentication token
 * @param {Object} params.activeChat - The active chat
 * @param {Array} params.chats - The chats array
 * @param {Function} params.setChats - Function to set chats
 * @param {Function} params.setActiveChat - Function to set active chat
 * @param {Function} params.setPossibleResponses - Function to set possible responses
 * @param {Function} params.setError - Function to set error
 * @param {Function} params.setLoading - Function to set loading state
 * @param {Function} params.setMessagesLoading - Function to set messages loading state
 * @param {Function} params.setIsAuthenticated - Function to set authentication state
 * @param {Set} params.loadedMessageChats - Set of chat IDs that have loaded messages
 * @param {Function} params.setLoadedMessageChats - Function to set loaded message chats
 * @param {string} params.connectionStatus - The connection status
 * @returns {Object} API functions
 */
const useWhatsAppApi = ({
  token,
  activeChat,
  chats,
  setChats,
  setActiveChat,
  setPossibleResponses,
  setError,
  setLoading,
  setMessagesLoading,
  setIsAuthenticated,
  loadedMessageChats,
  setLoadedMessageChats,
  connectionStatus,
  hubConnectionRef,
  loading
}) => {
  // Use refs to track in-progress requests to prevent duplicates
  const fetchingMessagesRef = useRef(false);
  const fetchingChatsRef = useRef(false);

  /**
   * Fetch chat sessions
   */
  const fetchChatSessions = useCallback(async () => {
    // Prevent duplicate requests
    if (fetchingChatsRef.current || loading) {
      debugLog("Skipping fetchChatSessions - already in progress");
      return;
    }
    
    fetchingChatsRef.current = true;
    debugLog("Starting fetchChatSessions");
    
    setLoading(true);
    setError(null);
    
    try {
      // Get the latest token from localStorage - try both keys for compatibility
      const currentToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || localStorage.getItem('auth_token') || token;
      
      if (!currentToken) {
        debugLog("No token available for fetchChatSessions");
        throw new Error('No authentication token available');
      }

      debugLog("Making API request to fetch chat sessions...");
      const response = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      debugLog(`API response status: ${response.status}`);
      
      if (!response.ok) {
        // Handle unauthorized errors
        if (response.status === 401) {
          debugLog("Unauthorized: Token expired or invalid");
          setIsAuthenticated(false);
          throw new Error('Authentication token expired or invalid');
        }
        throw new Error(`Failed to fetch chats: ${response.status}`);
      }
      
      const chatData = await response.json();
      debugLog(`Received ${chatData.length} chats from API`);
      
      // Format chat data
      const formattedChats = chatData.map(chat => ({
        id: chat.id,
        name: `${chat.participants.map(p => p.displayName).join(", ")}`,
        avatar: chat.avatar || "/placeholder.svg",
        lastMessage: chat.lastMessage?.content || "No messages yet",
        timestamp: chat.lastMessage ? formatDateTime(chat.lastMessage.timestamp) : "New",
        unread: chat.unreadCount > 0,
        messages: [] // Messages will be loaded separately when chat is selected
      }));
      
      debugLog(`Formatted ${formattedChats.length} chats`);
      
      // If we have an active chat, make sure to preserve its messages
      if (activeChat && activeChat.id) {
        const updatedChats = formattedChats.map(chat => {
          if (chat.id === activeChat.id) {
            return {
              ...chat,
              messages: activeChat.messages,
              // Keep the loaded status
              loaded: true
            };
          }
          return chat;
        });
        
        setChats(updatedChats.length > 0 ? updatedChats : []);
      } else {
        setChats(formattedChats.length > 0 ? formattedChats : []);
      }
    } catch (err) {
      console.error("Error fetching chats:", err);
      debugLog(`Error in fetchChatSessions: ${err.message}`);
      setError(`Failed to load chats: ${err.message}`);
    } finally {
      setLoading(false);
      fetchingChatsRef.current = false;
      debugLog("Completed fetchChatSessions");
    }
  }, [token, activeChat, setChats, setError, setIsAuthenticated, setLoading, loading]);

  /**
   * Fetch messages for a specific chat session
   */
  const fetchChatMessages = useCallback(async (chatId) => {
    debugLog(`fetchChatMessages called for chat ${chatId}`);
    
    // Prevent duplicate requests
    if (fetchingMessagesRef.current) {
      debugLog(`Skipping fetchChatMessages for chat ${chatId} - already in progress`);
      return;
    }
    
    fetchingMessagesRef.current = true;
    debugLog(`Fetching messages for chat ${chatId} from API`);
    
    // Set loading state
    setMessagesLoading(true);
    
    try {
      // Get the latest token from localStorage - try both keys for compatibility
      const currentToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || localStorage.getItem('auth_token') || token;
      
      // Make API request to fetch messages
      const response = await fetch(`${API_MESSAGES_URL}/${chatId}/messages`, {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        // Handle unauthorized errors
        if (response.status === 401) {
          setIsAuthenticated(false);
          throw new Error('Authentication token expired or invalid');
        }
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }
      
      const messagesData = await response.json();
      
      // Find the chat in our local data
      const chatIndex = chats.findIndex(chat => chat.id === chatId);
      
      if (chatIndex !== -1) {
        // Format messages data
        const formattedMessages = messagesData.map(msg => ({
          id: msg.id,
          content: msg.content,
          isCurrentUser: msg.isCurrentUser,
          sentAt: msg.timestamp || msg.sentAt,
          senderDisplayName: msg.senderDisplayName,
          attachments: msg.attachments || [],
          possibleResponses: msg.possibleResponses || []
        }));
        
        // Update the chat with messages
        const updatedChat = {
          ...chats[chatIndex],
          messages: formattedMessages,
          unread: false
        };
        
        // Update chats state
        const updatedChats = [...chats];
        updatedChats[chatIndex] = updatedChat;
        
        setChats(updatedChats);
        
        // Create a new object reference to ensure React detects the change
        const newActiveChat = {...updatedChat};
        setActiveChat(newActiveChat);
        
        // Check for possible responses in the last message
        if (formattedMessages.length > 0) {
          const lastMessage = formattedMessages[formattedMessages.length - 1];
          if (lastMessage.possibleResponses && lastMessage.possibleResponses.length > 0) {
            setPossibleResponses(lastMessage.possibleResponses);
          } else {
            setPossibleResponses([]);
          }
        }
        
        // Mark this chat as having loaded messages
        setLoadedMessageChats(prev => new Set(prev).add(chatId));
        
        // We no longer need to join the SignalR group here
        // This is now handled in the useSignalRConnection hook
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError(`Failed to load messages: ${err.message}`);
      
      // Fallback to local data if available
      const selectedChat = chats.find(chat => chat.id === chatId);
      if (selectedChat) {
        setActiveChat({...selectedChat}); // Create a new reference to force a re-render
      }
    } finally {
      setMessagesLoading(false);
      fetchingMessagesRef.current = false;
    }
  }, [
    chats, 
    token, 
    loadedMessageChats, 
    activeChat, 
    connectionStatus, 
    hubConnectionRef,
    setActiveChat,
    setChats,
    setError,
    setIsAuthenticated,
    setLoadedMessageChats,
    setMessagesLoading,
    setPossibleResponses
  ]);

  /**
   * Send a message to the API
   */
  const sendMessageToApi = useCallback(async (chatId, content, nextMessageId = null) => {
    try {
      debugLog("Sending message to API:", { chatId, content, nextMessageId });
      
      // Get the latest token from localStorage - try both keys for compatibility
      const currentToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || localStorage.getItem('auth_token') || token;
      
      // Prepare the request payload according to the required format
      const payload = {
        chatSessionId: chatId,
        content: content,
        hasAttachment: false // Set to false by default since we're not handling attachments yet
      };
      
      // Add metadata for nextMessageId if provided
      if (nextMessageId) {
        payload.metadata = {
          nextMessageId: nextMessageId,
          responseType: 'predefined'
        };
      }
      
      debugLog("Message payload:", payload);
      
      // Make the API request to the correct endpoint
      const response = await fetch(`${API_MESSAGES_URL}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        // Handle unauthorized errors
        if (response.status === 401) {
          setIsAuthenticated(false);
          console.error('Authentication token expired or invalid');
        } else {
          console.error(`Failed to send message: ${response.status}`);
        }
        
        // Mark the message as failed in the UI
        if (activeChat && activeChat.id === chatId) {
          setActiveChat(prevChat => {
            const updatedMessages = prevChat.messages.map(msg => {
              // If this is a sending message with matching content, mark it as failed
              if (msg.isSending && msg.content === content) {
                return {
                  ...msg,
                  isSending: false,
                  isTemporary: true,
                  isFailed: true // Add a failed flag
                };
              }
              return msg;
            });
            
            return {
              ...prevChat,
              messages: updatedMessages
            };
          });
        }
        
        return;
      }
      
      // Try to get the response data
      try {
        const responseData = await response.json();
        
        // If we got a valid response with a message ID, update the temporary message
        if (responseData && responseData.id) {
          // Update the chat with the confirmed message
          if (activeChat && activeChat.id === chatId) {
            setActiveChat(prevChat => {
              // Replace the temporary message with the confirmed one
              const updatedMessages = prevChat.messages.map(msg => {
                // If this is a sending message with matching content, replace it with the confirmed message
                if ((msg.isSending || msg.isTemporary) && msg.content === content) {
                  return {
                    id: responseData.id,
                    content: responseData.content || content,
                    isCurrentUser: true,
                    sentAt: responseData.timestamp || responseData.sentAt || new Date(),
                    senderDisplayName: responseData.senderDisplayName,
                    attachments: responseData.attachments || [],
                    possibleResponses: responseData.possibleResponses || [],
                    isTemporary: false,
                    isSending: false
                  };
                }
                return msg;
              });
              
              return {
                ...prevChat,
                messages: updatedMessages
              };
            });
          }
        } else {
          // If we didn't get a valid response, update the message to show it's no longer sending
          // but still temporary (waiting for SignalR update)
          if (activeChat && activeChat.id === chatId) {
            setActiveChat(prevChat => {
              const updatedMessages = prevChat.messages.map(msg => {
                if (msg.isSending && msg.content === content) {
                  return {
                    ...msg,
                    isSending: false,
                    isTemporary: true
                  };
                }
                return msg;
              });
              
              return {
                ...prevChat,
                messages: updatedMessages
              };
            });
          }
        }
      } catch (parseErr) {
        console.error("Error parsing response:", parseErr);
        
        // If we couldn't parse the response, update the message to show it's no longer sending
        if (activeChat && activeChat.id === chatId) {
          setActiveChat(prevChat => {
            const updatedMessages = prevChat.messages.map(msg => {
              if (msg.isSending && msg.content === content) {
                return {
                  ...msg,
                  isSending: false,
                  isTemporary: true
                };
              }
              return msg;
            });
            
            return {
              ...prevChat,
              messages: updatedMessages
            };
          });
        }
      }
      
      // With SignalR, we don't need to manually update the UI here
      // as we'll receive the message back through the SignalR connection
      // We'll just log the success
      debugLog("Message sent successfully");
      
      // If we have a nextMessageId but didn't get a valid response, fetch all messages
      if (nextMessageId) {
        // Small delay to ensure the server has processed the message
        setTimeout(() => {
          debugLog("Fetching messages after sending predefined response");
          fetchChatMessages(chatId);
        }, 500);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      
      // Mark the message as failed in the UI
      if (activeChat && activeChat.id === chatId) {
        setActiveChat(prevChat => {
          const updatedMessages = prevChat.messages.map(msg => {
            // If this is a sending message with matching content, mark it as failed
            if (msg.isSending && msg.content === content) {
              return {
                ...msg,
                isSending: false,
                isTemporary: true,
                isFailed: true // Add a failed flag
              };
            }
            return msg;
          });
          
          return {
            ...prevChat,
            messages: updatedMessages
          };
        });
      }
    }
  }, [token, fetchChatMessages, setIsAuthenticated, activeChat, setActiveChat]);

  return {
    fetchChatSessions,
    fetchChatMessages,
    sendMessageToApi
  };
};

export default useWhatsAppApi; 