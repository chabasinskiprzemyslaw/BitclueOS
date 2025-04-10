"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useSelector } from "react-redux";
import { ToolBar } from "../../../utils/general";

// Import custom hooks
import useSignalRConnection from "./whatsapp-components/useSignalRConnection";
import useWhatsAppApi from "./whatsapp-components/useWhatsAppApi";
import useTypingIndicator from "./whatsapp-components/useTypingIndicator";
import useNpcTypingSimulation from "./whatsapp-components/useNpcTypingSimulation";

// Import components
import ChatSidebar from "./whatsapp-components/ChatSidebar";
import ChatArea from "./whatsapp-components/ChatArea";
import LoginScreen from "./whatsapp-components/LoginScreen";

// Import constants and utilities
import { STORAGE_KEYS, CONNECTION_STATUS } from "./whatsapp-components/constants";
import { debugLog } from "./whatsapp-components/utils";

// Add these constants after other constants
const MAX_FILE_SIZE = 16 * 1024 * 1024; // 16MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];

// Add this function before the ChatApp component
const getFileType = (file) => {
  if (ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'image';
  } else if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return 'video';
  }
  return null;
};

// Add this function before the ChatApp component
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const WhatsApp = () => {
  const wnapp = useSelector((state) => state.apps.whatsapp);
  const userName = useSelector((state) => state.setting.person.name);

  // Add state to track Keycloak initialization
  const [keycloakInitialized, setKeycloakInitialized] = useState(false);
  
  // State management
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [possibleResponses, setPossibleResponses] = useState([]);
  const [appLoading, setAppLoading] = useState(true);
  
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  
  // ChatApp-specific login states
  const [whatsappLoggedIn, setWhatsappLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // Track if messages have been loaded for a chat to prevent repeated requests
  const [loadedMessageChats, setLoadedMessageChats] = useState(new Set());
  
  // Connection status
  const [connectionStatus, setConnectionStatus] = useState(CONNECTION_STATUS.DISCONNECTED);
  
  // Refs
  const messagesEndRef = useRef(null);
  const apiInitializedRef = useRef(false);
  const activeChatRef = useRef(null);
  
  // Update activeChatRef whenever activeChat changes
  useEffect(() => {
    activeChatRef.current = activeChat;
    debugLog("Updated activeChatRef with new activeChat:", activeChat?.id);
  }, [activeChat]);

  // Initialize SignalR connection using our custom hook
  const hubConnectionRef = useSignalRConnection({
    isAuthenticated,
    token,
    activeChat,
    activeChatRef,
    setConnectionStatus,
    setActiveChat,
    setChats,
    setPossibleResponses,
    setTypingUsers: (user, chatId, isTyping = true) => {
      // Forward to the typing indicator hook if it's ready
      if (typingIndicatorHookReady) {
        if (isTyping) {
          // Add user to typing users
          debugLog(`Adding typing indicator for user ${user.displayName || user.id} in chat ${chatId}`);
          
          // Call the handleUserTyping function from the typing indicator hook
          if (window.typingIndicatorHandlers && window.typingIndicatorHandlers.handleUserTyping) {
            window.typingIndicatorHandlers.handleUserTyping(user, chatId);
          }
        } else {
          // Remove user from typing users
          debugLog(`Removing typing indicator for user ${user.displayName || user.id} in chat ${chatId}`);
          
          // Call the handleUserStoppedTyping function from the typing indicator hook
          if (window.typingIndicatorHandlers && window.typingIndicatorHandlers.handleUserStoppedTyping) {
            window.typingIndicatorHandlers.handleUserStoppedTyping(user, chatId);
          }
        }
      }
    },
    fetchChatSessions: () => {
      if (apiInitializedRef.current) {
        fetchChatSessions();
      }
    },
    // Add handler for unread message notifications
    handleUnreadMessage: (message) => {
      if (!message) return;
      
      debugLog("Received unread message notification:", message);
      
      // Update the chat list to show unread indicator
      setChats(prevChats => {
        const chatIndex = prevChats.findIndex(chat => 
          chat.id.toString() === message.chatSessionId.toString()
        );
        
        if (chatIndex === -1) {
          // If we don't have this chat in our list yet, fetch chats again
          debugLog("Chat not found in list, fetching chat sessions");
          setTimeout(() => fetchChatSessions(), 500);
          return prevChats;
        }
        
        // Only mark as unread if it's not the active chat
        // Safely check if activeChat exists and has an id before calling toString()
        const isActiveChat = activeChat && activeChat.id && 
          activeChat.id.toString() === message.chatSessionId.toString();
        
        // Create a new array to avoid mutation
        const updatedChats = [...prevChats];
        
        // Update the specific chat
        updatedChats[chatIndex] = {
          ...updatedChats[chatIndex],
          lastMessage: message.content,
          timestamp: new Date(message.timestamp || message.sentAt).toLocaleTimeString([], { 
            hour: "2-digit", 
            minute: "2-digit" 
          }),
          unread: !isActiveChat, // Only mark as unread if it's not the active chat
          unreadCount: !isActiveChat 
            ? (updatedChats[chatIndex].unreadCount || 0) + 1 
            : 0 // Reset count if it's the active chat
        };
        
        return updatedChats;
      });
    }
  });

  // Track if the typing indicator hook is ready
  const [typingIndicatorHookReady, setTypingIndicatorHookReady] = useState(false);

  // Initialize API hook
  const { 
    fetchChatSessions, 
    fetchChatMessages, 
    sendMessageToApi 
  } = useWhatsAppApi({
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
  });

  // Mark API as initialized
  useEffect(() => {
    if (!apiInitializedRef.current) {
      apiInitializedRef.current = true;
      debugLog("API initialized");
    }
    
    return () => {
      // Reset initialization flags on unmount
      apiInitializedRef.current = false;
      
      // Close SignalR connection if it exists
      if (hubConnectionRef.current) {
        hubConnectionRef.current.stop()
          .catch(err => console.error("Error stopping SignalR connection on unmount:", err));
      }
      
      // Clear any timeouts or intervals
      clearAllTypingSimulations();
    };
  }, []);

  // Initialize typing indicator hook
  const { typingUsers, sendTypingIndicator } = useTypingIndicator({
    hubConnectionRef,
    activeChat
  });

  // Mark typing indicator hook as ready
  useEffect(() => {
    setTypingIndicatorHookReady(true);
    debugLog("Typing indicator hook ready");
    return () => {
      setTypingIndicatorHookReady(false);
    };
  }, []);

  // Initialize NPC typing simulation hook
  const { 
    simulateNpcTyping, 
    simulateSequentialNpcTyping, 
    clearAllTypingSimulations 
  } = useNpcTypingSimulation({
    setTypingUsers: (users) => {
      // This would be implemented if we want to simulate typing indicators
    },
    addMessage: (message) => {
      if (activeChat) {
        setActiveChat(prevChat => ({
          ...prevChat,
          messages: [...prevChat.messages, message]
        }));
      }
    }
  });

  // Scroll to bottom of messages
  const scrollToBottom = (force = false) => {
    if (messagesEndRef.current) {
      // If not forcing the scroll, check if user is already near the bottom
      if (!force) {
        const scrollArea = document.getElementById('chat-messages-scroll-area');
        
        if (scrollArea) {
          const container = scrollArea.querySelector('[data-radix-scroll-area-viewport]');
          
          if (container) {
            // Check if the user is already near the bottom
            const isNearBottom = 
              container.scrollHeight - container.scrollTop - container.clientHeight < 100;
            
            // Only smooth scroll if near bottom
            if (isNearBottom) {
              messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
              return;
            }
          }
        }
      }
      
      // For new messages from current user or forcing, always scroll
      messagesEndRef.current.scrollIntoView({ behavior: force ? "auto" : "smooth" });
    }
  };

  // Function to simulate typing and then show a message
  // This can be used for testing or when we don't have a real backend connection
  const simulateTypingAndMessage = useCallback((text, senderName = "Bot", avatarUrl = "/placeholder.svg") => {
    if (!activeChat) return;
    
    // Create a user object for the typing indicator
    const user = {
      id: `sim-${Date.now()}`,
      displayName: senderName,
      avatar: avatarUrl
    };
    
    // Calculate a realistic typing delay based on message length
    const messageLength = text.length;
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
    
    debugLog(`Simulating typing for ${typingDelay}ms before showing message: "${text}"`);
    
    // Show typing indicator
    if (window.typingIndicatorHandlers && window.typingIndicatorHandlers.handleUserTyping) {
      window.typingIndicatorHandlers.handleUserTyping(user, activeChat.id.toString());
    }
    
    // After the delay, remove typing indicator and show the message
    setTimeout(() => {
      // Remove typing indicator
      if (window.typingIndicatorHandlers && window.typingIndicatorHandlers.handleUserStoppedTyping) {
        window.typingIndicatorHandlers.handleUserStoppedTyping(user, activeChat.id.toString());
      }
      
      // Add the message
      const newMessage = {
        id: `sim-msg-${Date.now()}`,
        text: text,
        sent: false,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        senderName: senderName
      };
      
      setActiveChat(prevChat => {
        if (!prevChat) return prevChat;
        
        return {
          ...prevChat,
          messages: [...prevChat.messages, newMessage],
          lastMessage: text,
          timestamp: newMessage.time
        };
      });
      
      // Also update the chat in the chat list
      setChats(prevChats => {
        return prevChats.map(chat => {
          if (chat.id === activeChat.id) {
            return {
              ...chat,
              lastMessage: text,
              timestamp: newMessage.time
            };
          }
          return chat;
        });
      });
      
      // Scroll to bottom
      scrollToBottom();
    }, typingDelay);
  }, [activeChat]);

  // Add effect to wait for Keycloak initialization
  useEffect(() => {
    const checkKeycloakInit = () => {
      // Check if we can find any indication that Keycloak is done
      if (document.body.classList.contains('keycloak-initialized') || localStorage.getItem('auth_token')) {
        debugLog("Keycloak initialization detected");
        setKeycloakInitialized(true);
        return true;
      }
      return false;
    };

    // If not initialized, set up a polling mechanism
    if (!checkKeycloakInit()) {
      debugLog("Waiting for Keycloak initialization...");
      const pollInterval = setInterval(() => {
        if (checkKeycloakInit()) {
          clearInterval(pollInterval);
        }
      }, 100); // Check every 100ms

      // Clean up interval if component unmounts
      return () => clearInterval(pollInterval);
    }
  }, []);

  // Modify the initialization effect to wait for Keycloak
  useEffect(() => {
    const initializeApp = async () => {
      setAppLoading(true);
      debugLog("Initializing ChatApp application...");
      
      // Wait for Keycloak to be initialized
      if (!keycloakInitialized) {
        debugLog("Waiting for Keycloak initialization before proceeding...");
        return;
      }

      await checkAuth();
      
      // If authenticated after checkAuth, fetch chat sessions
      const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (storedToken) {
        debugLog("Auth token found, fetching initial chat sessions...");
        await fetchChatSessions();
      } else {
        debugLog("No auth token found, skipping chat session fetch");
      }
      
      setAppLoading(false);
    };
    
    initializeApp();
  }, [keycloakInitialized]); // Add keycloakInitialized as a dependency

  // Add a new effect to handle initial data loading when authentication changes
  useEffect(() => {
    if (isAuthenticated && !appLoading) {
      debugLog("Authentication state changed to authenticated, fetching chats...");
      fetchChatSessions();
    }
  }, [isAuthenticated]);

  // Scroll to bottom of messages when they change
  useEffect(() => {
    // Only auto-scroll when:
    // 1. It's a user-initiated message (no _isSignalRUpdate flag)
    // 2. It's the user's own message from SignalR
    // 3. The user is already near the bottom
    
    if (activeChat) {
      // Check if we're near the bottom before deciding to scroll
      const isUserNearBottom = messagesEndRef.current && 
        messagesEndRef.current.getBoundingClientRect().top < window.innerHeight + 100;
      
      // Check if this was a SignalR update
      const isSignalRUpdate = activeChat._isSignalRUpdate;
      
      // If it was our own message or we're near the bottom, scroll
      const shouldScroll = 
        !isSignalRUpdate || // User-initiated action
        isUserNearBottom;   // User is already near the bottom
      
      if (shouldScroll) {
        scrollToBottom();
      }
      
      // Clear the SignalR update flag after processing
      if (isSignalRUpdate) {
        setTimeout(() => {
          setActiveChat(prev => ({ ...prev, _isSignalRUpdate: undefined }));
        }, 100);
      }
    }
  }, [activeChat?.messages, typingUsers]);

  // Force refresh of messages when active chat changes
  useEffect(() => {
    if (activeChat) {
      // This ensures the UI updates even if React doesn't detect changes
      const refreshTimer = setTimeout(() => {
        setActiveChat({...activeChat});
      }, 50);
      
      return () => clearTimeout(refreshTimer);
    }
  }, [activeChat?.id]);

  // Handle active chat changes for SignalR
  useEffect(() => {
    // If we have an active chat and a SignalR connection, join the chat group
    if (activeChat && activeChat.id && hubConnectionRef.current && connectionStatus === CONNECTION_STATUS.CONNECTED) {
      const chatId = activeChat.id.toString();
      debugLog(`Joining SignalR group for active chat ${chatId}`);
      
      hubConnectionRef.current.invoke("JoinChatSession", chatId)
        .catch(err => {
          console.error(`Error joining chat session ${chatId}:`, err);
        });
      
      // Mark messages as read when chat is opened
      setChats(prevChats => {
        return prevChats.map(chat => {
          if (chat.id.toString() === chatId) {
            return {
              ...chat,
              unread: false,
              unreadCount: 0 // Reset unread count
            };
          }
          return chat;
        });
      });
      
      // Clean up function to leave the chat group when the active chat changes
      return () => {
        if (hubConnectionRef.current && connectionStatus === CONNECTION_STATUS.CONNECTED) {
          debugLog(`Leaving SignalR group for chat ${chatId}`);
          
          hubConnectionRef.current.invoke("LeaveChatSession", chatId)
            .catch(err => {
              console.error(`Error leaving chat session ${chatId}:`, err);
            });
        }
      };
    }
  }, [activeChat?.id, connectionStatus]);

  // Join user notification group when authenticated
  useEffect(() => {
    if (isAuthenticated && userId && hubConnectionRef.current && 
        connectionStatus === CONNECTION_STATUS.CONNECTED) {
      debugLog(`Joining user notification group for user ${userId}`);
      
      hubConnectionRef.current.invoke("JoinUserNotificationGroup", userId)
        .catch(err => {
          console.error(`Error joining user notification group for user ${userId}:`, err);
        });
      
      // Clean up function to leave the notification group when component unmounts or user logs out
      return () => {
        if (hubConnectionRef.current && connectionStatus === CONNECTION_STATUS.CONNECTED) {
          debugLog(`Leaving user notification group for user ${userId}`);
          
          hubConnectionRef.current.invoke("LeaveUserNotificationGroup", userId)
            .catch(err => {
              console.error(`Error leaving user notification group for user ${userId}:`, err);
            });
        }
      };
    }
  }, [isAuthenticated, userId, connectionStatus]);

  // Modify checkAuth to be async
  const checkAuth = async () => {
    debugLog("Checking authentication status...");
    const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const storedUserInfo = localStorage.getItem(STORAGE_KEYS.USER_INFO);
    
    if (storedToken) {
      debugLog("Found stored token, validating...");
      setToken(storedToken);
      setIsAuthenticated(true);
      
      // Get user ID from stored user info if available
      if (storedUserInfo) {
        try {
          const userInfo = JSON.parse(storedUserInfo);
          if (userInfo.id) {
            setUserId(userInfo.id);
            debugLog("User info loaded successfully");
          }
        } catch (err) {
          console.error("Error parsing stored user info:", err);
        }
      } else {
        // If we have a token but no user info, try to extract user info from the token
        try {
          // JWT tokens are in the format: header.payload.signature
          // We need to decode the payload (second part)
          const tokenParts = storedToken.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            
            // Extract user info from token claims
            const userInfo = {
              id: payload.sub || payload.preferred_username,
              name: payload.name || payload.preferred_username || userName,
              email: payload.email
            };
            
            // Store user info
            localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
            
            if (userInfo.id) {
              setUserId(userInfo.id);
            }
          }
        } catch (err) {
          console.error("Error extracting user info from token:", err);
        }
      }
      
      setAuthLoading(false);
    } else {
      debugLog("No stored token found, setting as unauthenticated");
      setIsAuthenticated(false);
      setAuthLoading(false);
    }
  };

  // Handle ChatApp-specific login
  const handleWhatsAppLogin = (e) => {

    console.log('handleWhatsAppLogin', e)
    e.preventDefault();
    
    const correctUsername = "AF_INSIDER";
    const correctPassword = "AlexTheGreat01!";
    
    if (username === correctUsername && password === correctPassword) {
      setWhatsappLoggedIn(true);
      localStorage.setItem(STORAGE_KEYS.WHATSAPP_LOGIN, "true");
      
      // Trigger backend event for successful login
      const triggerLoginEvent = async () => {
        try {
          // Get the stored authentication token
          const authToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || localStorage.getItem('auth_token');
          const scenarioId = localStorage.getItem(STORAGE_KEYS.SCENARIO_ID);
          
          if (!authToken) {
            console.warn("No auth token available for triggering login event");
            return;
          }
          
          // Get user identity ID
          let userIdentityId = userId;
          if (!userIdentityId) {
            const userInfo = localStorage.getItem(STORAGE_KEYS.USER_INFO);
            if (userInfo) {
              try {
                const parsedUserInfo = JSON.parse(userInfo);
                userIdentityId = parsedUserInfo.id;
              } catch (error) {
                console.error("Error parsing user info:", error);
              }
            }
          }
          
          if (!userIdentityId) {
            console.warn("No user identity ID available for triggering login event");
            return;
          }
          
          // Prepare the request body
          const requestBody = {
            userIdentityId: userIdentityId.toString(),
            scenarioId: scenarioId,
            triggerData: {
              "action:": "LOGIN",
              "login": "AF_INSIDER",
              "password": "AlexTheGreat01!"
            }
          };
          
          debugLog("Triggering login event:", requestBody);
          
          // Make the API call
          const response = await fetch('https://localhost:5001/storyengine/chat/trigger-event', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(requestBody)
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error triggering login event: ${JSON.stringify(errorData)}`);
          }
          
          const responseData = await response.json();
          debugLog("Login event triggered successfully:", responseData);
        } catch (error) {
          console.error("Failed to trigger login event:", error);
        }
      };
      
      // Call the function to trigger the login event
      triggerLoginEvent();
    } else {
      setAuthError("Invalid username or password. Try again.");
    }
  };

  // Handle login (original Keycloak auth function)
  const handleLogin = async (e) => {
    e.preventDefault();
    
    setAuthLoading(true);
    setAuthError(null);
    
    try {
      // Get the auth token from localStorage (set by Keycloak in the LockScreen component)
      const authToken = localStorage.getItem('auth_token');
      
      if (!authToken) {
        throw new Error("No authentication token found. Please log in from the lock screen first.");
      }
      
      // Decode the JWT token to get user information
      const tokenParts = authToken.split('.');
      if (tokenParts.length !== 3) {
        throw new Error("Invalid token format");
      }
      
      const payload = JSON.parse(atob(tokenParts[1]));
      
      // Extract user info from token claims
      const userInfo = {
        id: payload.sub || payload.preferred_username,
        name: payload.name || payload.preferred_username || userName,
        email: payload.email
      };
      
      // Store token and user info in localStorage using the app's storage keys
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
      localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
      
      // Update state
      setToken(authToken);
      setUserId(userInfo.id);
      setIsAuthenticated(true);
      
      // Fetch chat sessions after login
      setTimeout(() => {
        fetchChatSessions();
      }, 500);
    } catch (err) {
      console.error("Login error:", err);
      setAuthError(err.message || "Authentication failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Check if user is already logged in to WhatsApp
  useEffect(() => {
    const whatsappLoginStatus = localStorage.getItem(STORAGE_KEYS.WHATSAPP_LOGIN);
    if (whatsappLoginStatus === "true") {
      setWhatsappLoggedIn(true);
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_INFO);
    localStorage.removeItem(STORAGE_KEYS.WHATSAPP_LOGIN);
    
    // Also clear Keycloak tokens
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expiry");
    
    // Update state
    setToken(null);
    setUserId(null);
    setIsAuthenticated(false);
    setWhatsappLoggedIn(false);
    setChats([]);
    setActiveChat(null);
    
    // Disconnect from SignalR hub
    if (hubConnectionRef.current) {
      hubConnectionRef.current.stop().catch(err => {
        console.error("Error stopping SignalR connection:", err);
      });
    }
  };

  // Handle chat selection
  const handleChatSelect = (chat) => {
    debugLog(`Selecting chat ${chat.id} handleChatSelect`);
    
    // First set the active chat to trigger UI update immediately
    if (activeChat?.id !== chat.id) {
      // Set to null instead of empty array to avoid toString() error
      setActiveChat(null);
      setPossibleResponses([]);
      
      // Mark chat as read when selected
      setChats(prevChats => {
        return prevChats.map(c => {
          if (c.id === chat.id) {
            return {
              ...c,
              unread: false,
              unreadCount: 0 // Reset unread count
            };
          }
          return c;
        });
      });
      
      fetchChatMessages(chat.id);
    }
  };

  // Modify the handleSendMessage function to handle attachments
  const handleSendMessage = (e) => {
    console.log('handleSendMessage', e)

    e.preventDefault();
    
    if (!activeChat || !activeChat.id) {
      console.error("Cannot send message: No active chat");
      return;
    }
    
    // If there are possible responses, check if a response button was clicked
    if (possibleResponses.length > 0) {
      const responseId = e.target.dataset.responseId;
      
      if (responseId) {
        const selectedResponse = possibleResponses.find(
          (r) => r.optionIndex.toString() === responseId
        );
        
        if (selectedResponse) {
          // Add the selected response to the chat immediately for instant feedback
          // but mark it as "sending" rather than sent
          const newMessage = {
            id: `temp-${Date.now()}`,
            content: selectedResponse.text,
            isCurrentUser: true,
            sentAt: new Date().toISOString(),
            isTemporary: true, // Mark as temporary until confirmed by server
            isSending: true // Mark as currently sending
          };
          
          // Update activeChat with the new message
          setActiveChat(prevChat => ({
            ...prevChat,
            messages: [...prevChat.messages, newMessage]
          }));
          
          // Send the selected response
          sendMessageToApi(
            activeChat.id,
            selectedResponse.text,
            selectedResponse.optionIndex
          );
          
          // Clear possible responses
          setPossibleResponses([]);
          
          // Force scroll to bottom when user sends a message
          setTimeout(() => scrollToBottom(true), 50);
          return;
        }
      }
    }
    
    // If we have message input, send it
    if (messageInput.trim()) {
      // Add the message to the chat immediately for instant feedback
      // but mark it as "sending" rather than sent
      const newMessage = {
        id: `temp-${Date.now()}`,
        content: messageInput,
        isCurrentUser: true,
        sentAt: new Date().toISOString(),
        isTemporary: true, // Mark as temporary until confirmed by server
        isSending: true // Mark as currently sending
      };
      
      // Update activeChat with the new message
      setActiveChat(prevChat => ({
        ...prevChat,
        messages: [...prevChat.messages, newMessage]
      }));
      
      // Send the message to the API
      sendMessageToApi(activeChat.id, messageInput);
      setMessageInput("");
      
      // Force scroll to bottom when user sends a message
      setTimeout(() => scrollToBottom(true), 50);
    }
  };

  // Show connection status message
  const getConnectionStatusMessage = () => {
    switch (connectionStatus) {
      case CONNECTION_STATUS.ERROR:
        return "Connection error. Please check your network.";
      case CONNECTION_STATUS.RECONNECTING:
        return "Reconnecting to server...";
      case CONNECTION_STATUS.CONNECTING:
        return "Connecting to server...";
      default:
        return null;
    }
  };

  const connectionStatusMessage = getConnectionStatusMessage();

  return (
    <div
      className="whatsapp floatTab dpShad dark"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size == "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
    >
      <ToolBar app={wnapp.action}
              icon={wnapp.icon}
              size={wnapp.size}
              name="ChatApp"
            />
      
      {/* App Loading Screen */}
      {(!keycloakInitialized || appLoading) ? (
        <div className="flex-1 flex flex-col items-center justify-center h-full bg-[#111B21] text-gray-300">
          <div className="w-16 h-16 mb-4">
            <img src="/icons/whatsapp.png" alt="ChatApp" className="w-full h-full" />
          </div>
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg">Loading ChatApp</p>
          <p className="text-sm text-gray-500">
            {!keycloakInitialized ? "Waiting for authentication..." : "End-to-end encrypted"}
          </p>
        </div>
      ) : !whatsappLoggedIn ? (
        <LoginScreen 
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          handleLogin={handleWhatsAppLogin}
          authLoading={authLoading}
          authError={authError}
        />
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Chat Sidebar */}
          <div className="w-[350px] flex-shrink-0">
            <ChatSidebar
              chats={chats}
              activeChat={activeChat}
              handleChatSelect={handleChatSelect}
              fetchChatSessions={fetchChatSessions}
              loading={loading}
              userName={userName}
              handleLogout={handleLogout}
            />
          </div>
          
          {/* Chat Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <ChatArea
              activeChat={activeChat}
              connectionStatus={connectionStatus}
              messagesLoading={messagesLoading}
              fetchChatMessages={fetchChatMessages}
              typingUsers={typingUsers}
              messageInput={messageInput}
              setMessageInput={setMessageInput}
              handleSendMessage={handleSendMessage}
              possibleResponses={possibleResponses}
              messagesEndRef={messagesEndRef}
              setActiveChat={setActiveChat}
              sendMessageToApi={sendMessageToApi}
            />
          </div>
        </div>
      )}
    </div>
  );
};