"use client"

import { useState, useEffect, useRef } from "react"
import {
  Search,
  MoreVertical,
  Mic,
  Smile,
  Paperclip,
  Settings,
  Users,
  Star,
  Check,
  LogOut,
  Download,
  Lock,
  ArrowRight,
  RefreshCw,
} from "lucide-react"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { ScrollArea } from "../../../components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import { useSelector } from "react-redux";
import { ToolBar } from "../../../utils/general";
// Import SignalR
import * as signalR from "@microsoft/signalr";

// Import custom hooks
import useSignalRConnection from "./whatsapp-components/useSignalRConnection";
import useWhatsAppApi from "./whatsapp-components/useWhatsAppApi";
import useTypingIndicator from "./whatsapp-components/useTypingIndicator";
import useNpcTypingSimulation from "./whatsapp-components/useNpcTypingSimulation";

// Import components
import ChatSidebar from "./whatsapp-components/ChatSidebar";
import ChatArea from "./whatsapp-components/ChatArea";
import LoginScreen from "./whatsapp-components/LoginScreen";
import Message from "./whatsapp-components/Message";
import TypingIndicator from "./whatsapp-components/TypingIndicator";

// Import constants and utilities
import { INITIAL_CHATS, STORAGE_KEYS, CONNECTION_STATUS } from "./whatsapp-components/constants";
import { debugLog } from "./whatsapp-components/utils";

// API endpoint for chat sessions
const API_URL = "https://localhost:5001/chats/sessions";
const API_MESSAGES_URL = "https://localhost:5001/chats";
const HUB_URL = "https://localhost:5001/hubs/chat";

// Create a special heartbeat group ID that won't conflict with real chat IDs
const HEARTBEAT_GROUP = "heartbeat-ping";

export const WhatsApp = () => {
  const wnapp = useSelector((state) => state.apps.whatsapp);
  const userName = useSelector((state) => state.setting.person.name);

  // State management
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [possibleResponses, setPossibleResponses] = useState([]);
  
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(null);
  const [token, setToken] = useState("");
  
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
      // This will be handled by the typing indicator hook
      if (typingIndicatorHookReady) {
        // Forward to the typing indicator hook if it's ready
      }
    },
    fetchChatSessions: () => {
      if (apiInitializedRef.current) {
        fetchChatSessions();
      }
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

  // Check authentication on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Scroll to bottom of messages when they change
  useEffect(() => {
    scrollToBottom();
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
    if (activeChat && hubConnectionRef.current && connectionStatus === CONNECTION_STATUS.CONNECTED) {
      const chatId = activeChat.id.toString();
      debugLog(`Joining SignalR group for active chat ${chatId}`);
      
      hubConnectionRef.current.invoke("JoinChatSession", chatId)
        .catch(err => {
          console.error(`Error joining chat session ${chatId}:`, err);
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

  // Check if user is authenticated
  const checkAuth = () => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      setAuthLoading(false);
      
      // Fetch chat sessions after authentication
      setTimeout(() => {
        fetchChatSessions();
      }, 500);
    } else {
      setIsAuthenticated(false);
      setAuthLoading(false);
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    
    setAuthLoading(true);
    setAuthError(null);
    
    try {
      // Simulate successful login for demo purposes
      // In a real app, you would make an API call here
      const mockToken = "mock_token_" + Math.random().toString(36).substring(2);
      
      // Store token in localStorage
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockToken);
      
      // Update state
      setToken(mockToken);
      setIsAuthenticated(true);
      
      // Fetch chat sessions after login
      setTimeout(() => {
        fetchChatSessions();
      }, 500);
    } catch (err) {
      console.error("Login error:", err);
      setAuthError("Invalid username or password");
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    
    // Update state
    setToken("");
    setIsAuthenticated(false);
    setActiveChat(null);
    setChats(INITIAL_CHATS);
    
    // Close SignalR connection
    if (hubConnectionRef.current) {
      debugLog("Closing SignalR connection on logout");
      hubConnectionRef.current.stop()
        .catch(err => console.error("Error stopping SignalR connection:", err));
      // The connection reference will be cleared in the onclose handler
    }
    
    setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
  };

  // Handle chat selection
  const handleChatSelect = (chat) => {
    debugLog(`Selecting chat ${chat.id} handleChatSelect`);
    
    // First set the active chat to trigger UI update immediately
    if (activeChat?.id !== chat.id) {
      setActiveChat([]);
      setPossibleResponses([]);
      
      fetchChatMessages(chat.id);
    }
  };

  // Handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    
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
            text: selectedResponse.text,
            sent: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
        text: messageInput,
        sent: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
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
              name="WhatsApp"
            />
      
      {/* Connection status indicator */}
      {connectionStatusMessage && (
        <div className={`text-white text-xs p-1 text-center ${
          connectionStatus === CONNECTION_STATUS.ERROR 
            ? 'bg-red-900/70'
            : connectionStatus === CONNECTION_STATUS.RECONNECTING
              ? 'bg-yellow-900/70'
              : 'bg-blue-900/70'
        }`}>
          {connectionStatusMessage}
        </div>
      )}
      
      {!isAuthenticated ? (
        <LoginScreen
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
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
            />
          </div>
        </div>
      )}
    </div>
  );
};