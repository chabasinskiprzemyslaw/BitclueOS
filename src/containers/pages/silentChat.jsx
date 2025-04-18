import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import * as signalR from '@microsoft/signalr';
import { ScrollArea } from "../../components/ui/scroll-area";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Avatar } from "../../components/ui/avatar";
import { Send, RefreshCw } from "lucide-react";

// Constants for the app
const API_PRIVATE_SESSIONS_URL = `${import.meta.env.VITE_API_BASE_URL}/chats/sessions/priv`;
const API_MESSAGES_URL = `${import.meta.env.VITE_API_BASE_URL}/chats`;
const SIGNALR_HUB_URL = `${import.meta.env.VITE_API_BASE_URL}/hubs/chat`;
const DEFAULT_AVATAR = "/placeholder.svg";

// Connection status constants
const CONNECTION_STATUS = {
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  RECONNECTING: 'reconnecting',
  DISCONNECTED: 'disconnected',
  ERROR: 'error'
};

// Helper function to format message time
const formatMessageTime = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return '';
  
  try {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch (error) {
    return '';
  }
};

// Helper function to format date and time
const formatDateTime = (timestamp) => {
  if (!timestamp) return '';
  
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';
    
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  } catch (error) {
    return '';
  }
};

const SilentChat = () => {
  const userName = useSelector((state) => state.setting.person.name);
  
  // State for the chat
  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [possibleResponses, setPossibleResponses] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState(CONNECTION_STATUS.DISCONNECTED);
  const [typingUsers, setTypingUsers] = useState([]);
  
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  
  // Refs
  const messagesEndRef = useRef(null);
  const hubConnectionRef = useRef(null);
  const activeChatRef = useRef(null);
  
  // Update activeChatRef whenever activeChat changes
  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);
  
  // Initialize app and check auth
  useEffect(() => {
    const initializeApp = async () => {
      console.log("Initializing Silent Chat application...");
      
      await checkAuth();
      
      // If authenticated after checkAuth, fetch chat sessions
      const storedToken = localStorage.getItem('auth_token');
      if (storedToken) {
        console.log("Auth token found, fetching private chat session...");
        await fetchPrivateChatSession();
      } else {
        console.log("No auth token found, please log in");
        setError("Authentication required. Please log in.");
      }
      
      setLoading(false);
    };
    
    initializeApp();
  }, []);
  
  // Check authentication status
  const checkAuth = async () => {
    console.log("Checking authentication status...");
    const storedToken = localStorage.getItem('auth_token');
    
    if (storedToken) {
      console.log("Found stored token");
      setToken(storedToken);
      setIsAuthenticated(true);
      
      // Try to extract user info from the token
      try {
        // JWT tokens are in the format: header.payload.signature
        const tokenParts = storedToken.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          
          // Extract user info from token claims
          const userInfo = {
            id: payload.sub || payload.preferred_username,
            name: payload.name || payload.preferred_username || userName
          };
          
          if (userInfo.id) {
            setUserId(userInfo.id);
          }
        }
      } catch (err) {
        console.error("Error extracting user info from token:", err);
      }
    } else {
      console.log("No stored token found, setting as unauthenticated");
      setIsAuthenticated(false);
      setError("Authentication required. Please log in.");
    }
  };
  
  // Fetch private chat session
  const fetchPrivateChatSession = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching private chat session...");
      const currentToken = localStorage.getItem('auth_token') || token;
      
      if (!currentToken) {
        throw new Error('No authentication token available');
      }
      
      const response = await fetch(API_PRIVATE_SESSIONS_URL, {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          throw new Error('Authentication token expired or invalid');
        }
        throw new Error(`Failed to fetch chat: ${response.status}`);
      }
      
      const chatData = await response.json();
      console.log("Received private chat data:", chatData);
      
      if (chatData && chatData.length > 0) {
        // Get the first chat session (we expect only one private chat)
        const chat = chatData[0];
        
        // Format chat data
        const formattedChat = {
          id: chat.id,
          name: `${chat.participants.map(p => p.displayName).join(", ")}`,
          avatar: chat.avatar || DEFAULT_AVATAR,
          lastMessage: chat.lastMessage?.content || "No messages yet",
          timestamp: chat.lastMessage ? formatDateTime(chat.lastMessage.timestamp) : "New",
          messages: [] // Will be loaded separately
        };
        
        setActiveChat(formattedChat);
        
        // Fetch messages for this chat
        await fetchChatMessages(formattedChat.id);
        
        // Initialize SignalR connection
        initializeSignalR(currentToken, formattedChat.id);
      } else {
        setError("No private chat available");
      }
    } catch (err) {
      console.error("Error fetching private chat:", err);
      setError(`Failed to load private chat: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch messages for a specific chat session
  const fetchChatMessages = async (chatId) => {
    console.log(`Fetching messages for chat ${chatId}`);
    setMessagesLoading(true);
    
    try {
      const currentToken = localStorage.getItem('auth_token') || token;
      
      const response = await fetch(`${API_MESSAGES_URL}/${chatId}/messages`, {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          throw new Error('Authentication token expired or invalid');
        }
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }
      
      const messagesData = await response.json();
      console.log("Received messages data:", messagesData);
      
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
      
      // Update active chat with messages
      setActiveChat(prevChat => ({
        ...prevChat,
        messages: formattedMessages
      }));
      
      // Check for possible responses in the last message
      if (formattedMessages.length > 0) {
        const lastMessage = formattedMessages[formattedMessages.length - 1];
        if (lastMessage.possibleResponses && lastMessage.possibleResponses.length > 0) {
          setPossibleResponses(lastMessage.possibleResponses);
        } else {
          setPossibleResponses([]);
        }
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError(`Failed to load messages: ${err.message}`);
    } finally {
      setMessagesLoading(false);
    }
  };
  
  // Initialize SignalR connection
  const initializeSignalR = (token, chatId) => {
    if (hubConnectionRef.current) {
      console.log("Stopping existing SignalR connection");
      hubConnectionRef.current.stop();
    }
    
    console.log("Initializing SignalR connection");
    setConnectionStatus(CONNECTION_STATUS.CONNECTING);
    
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(SIGNALR_HUB_URL, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
    
    // Setup SignalR event handlers
    
    // Handle receiving a message
    connection.on("ReceiveMessage", (message) => {
      console.log("Received message via SignalR:", message);
      
      if (activeChatRef.current && activeChatRef.current.id === message.chatSessionId) {
        setActiveChat(prevChat => {
          // Check if this message is already in our list
          const messageExists = prevChat.messages.some(msg => msg.id === message.id);
          
          if (messageExists) {
            return prevChat;
          }
          
          // Add the new message
          const newMessage = {
            id: message.id,
            content: message.content,
            isCurrentUser: message.isCurrentUser,
            sentAt: message.timestamp || message.sentAt,
            senderDisplayName: message.senderDisplayName,
            attachments: message.attachments || [],
            possibleResponses: message.possibleResponses || []
          };
          
          // Check for possible responses
          if (message.possibleResponses && message.possibleResponses.length > 0) {
            setPossibleResponses(message.possibleResponses);
          }
          
          return {
            ...prevChat,
            messages: [...prevChat.messages, newMessage],
            _isSignalRUpdate: true
          };
        });
      }
    });
    
    // Handle user typing
    connection.on("UserTyping", (user, chatSessionId) => {
      console.log(`User ${user.displayName} is typing in chat ${chatSessionId}`);
      
      if (activeChatRef.current && activeChatRef.current.id === chatSessionId) {
        setTypingUsers(prevUsers => {
          // Check if user is already in the list
          if (prevUsers.some(u => u.id === user.id)) {
            return prevUsers;
          }
          return [...prevUsers, user];
        });
        
        // Remove typing indicator after a delay
        setTimeout(() => {
          setTypingUsers(prevUsers => 
            prevUsers.filter(u => u.id !== user.id)
          );
        }, 3000);
      }
    });
    
    // Handle connection status changes
    connection.onreconnecting(() => {
      console.log("SignalR reconnecting");
      setConnectionStatus(CONNECTION_STATUS.RECONNECTING);
    });
    
    connection.onreconnected(() => {
      console.log("SignalR reconnected");
      setConnectionStatus(CONNECTION_STATUS.CONNECTED);
      
      // Rejoin the chat session group
      if (chatId) {
        connection.invoke("JoinChatSession", chatId.toString())
          .catch(err => console.error(`Error rejoining chat session ${chatId}:`, err));
      }
    });
    
    connection.onclose(() => {
      console.log("SignalR connection closed");
      setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
    });
    
    // Start the connection
    connection.start()
      .then(() => {
        console.log("SignalR connected");
        setConnectionStatus(CONNECTION_STATUS.CONNECTED);
        hubConnectionRef.current = connection;
        
        // Join the chat session group
        if (chatId) {
          connection.invoke("JoinChatSession", chatId.toString())
            .catch(err => console.error(`Error joining chat session ${chatId}:`, err));
        }
        
        // Join user notification group
        if (userId) {
          connection.invoke("JoinUserNotificationGroup", userId)
            .catch(err => console.error(`Error joining user notification group:`, err));
        }
      })
      .catch(err => {
        console.error("Error starting SignalR connection:", err);
        setConnectionStatus(CONNECTION_STATUS.ERROR);
        setError(`Connection error: ${err.message}`);
      });
  };
  
  // Send a message
  const sendMessage = async (e) => {
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
          // Add the selected response to the chat immediately
          const newMessage = {
            id: `temp-${Date.now()}`,
            content: selectedResponse.text,
            isCurrentUser: true,
            sentAt: new Date().toISOString(),
            isTemporary: true,
            isSending: true
          };
          
          // Update activeChat with the new message
          setActiveChat(prevChat => ({
            ...prevChat,
            messages: [...prevChat.messages, newMessage]
          }));
          
          // Send the selected response
          await sendMessageToApi(
            activeChat.id,
            selectedResponse.text,
            selectedResponse.optionIndex
          );
          
          // Clear possible responses
          setPossibleResponses([]);
          
          // Scroll to bottom
          setTimeout(() => scrollToBottom(true), 50);
          return;
        }
      }
    }
    
    // If we have message input, send it
    if (messageInput.trim()) {
      // Add the message to the chat immediately
      const newMessage = {
        id: `temp-${Date.now()}`,
        content: messageInput,
        isCurrentUser: true,
        sentAt: new Date().toISOString(),
        isTemporary: true,
        isSending: true
      };
      
      // Update activeChat with the new message
      setActiveChat(prevChat => ({
        ...prevChat,
        messages: [...prevChat.messages, newMessage]
      }));
      
      // Send the message to the API
      await sendMessageToApi(activeChat.id, messageInput);
      setMessageInput("");
      
      // Scroll to bottom
      setTimeout(() => scrollToBottom(true), 50);
    }
  };
  
  // Send message to API
  const sendMessageToApi = async (chatId, content, nextMessageId = null) => {
    try {
      console.log("Sending message to API:", { chatId, content, nextMessageId });
      
      // Get the token
      const currentToken = localStorage.getItem('auth_token') || token;
      
      // Prepare the request payload
      const payload = {
        chatSessionId: chatId,
        content: content,
        hasAttachment: false
      };
      
      // Add metadata for nextMessageId if provided
      if (nextMessageId) {
        payload.metadata = {
          nextMessageId: nextMessageId,
          responseType: 'predefined'
        };
      }
      
      // Make the API request
      const response = await fetch(`${API_MESSAGES_URL}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          setIsAuthenticated(false);
          throw new Error('Authentication token expired or invalid');
        }
        throw new Error(`Failed to send message: ${response.status}`);
      }
      
      // Try to get the response data
      try {
        const responseData = await response.json();
        
        if (responseData && responseData.id) {
          // Update the chat with the confirmed message
          if (activeChat && activeChat.id === chatId) {
            setActiveChat(prevChat => {
              // Replace the temporary message with the confirmed one
              const updatedMessages = prevChat.messages.map(msg => {
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
          // Update message to show it's no longer sending
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
      }
      
      // If we have a nextMessageId, fetch all messages
      if (nextMessageId) {
        setTimeout(() => {
          fetchChatMessages(chatId);
        }, 500);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      
      // Mark the message as failed in the UI
      if (activeChat && activeChat.id === chatId) {
        setActiveChat(prevChat => {
          const updatedMessages = prevChat.messages.map(msg => {
            if (msg.isSending && msg.content === content) {
              return {
                ...msg,
                isSending: false,
                isTemporary: true,
                isFailed: true
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
  };
  
  // Scroll to bottom of messages
  const scrollToBottom = (force = false) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: force ? "auto" : "smooth" });
    }
  };
  
  // Effect to scroll to bottom when messages change
  useEffect(() => {
    if (activeChat?.messages?.length > 0) {
      scrollToBottom();
    }
  }, [activeChat?.messages]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hubConnectionRef.current) {
        hubConnectionRef.current.stop()
          .catch(err => console.error("Error stopping SignalR connection on unmount:", err));
      }
    };
  }, []);
  
  return (
    <div className="bg-black min-h-screen flex flex-col text-white p-4">
      <div className="container mx-auto max-w-4xl flex flex-col h-screen">
        {/* Header */}
        <div className="bg-zinc-900 p-4 rounded-t-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-red-500">SILENT</div>
            <div className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-sm">ENCRYPTED</div>
          </div>
          <div className="text-sm text-gray-400">
            {connectionStatus === CONNECTION_STATUS.CONNECTED ? (
              <span className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                Secure Connection
              </span>
            ) : (
              <span className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                {connectionStatus}
              </span>
            )}
          </div>
        </div>
        
        {/* Chat Area */}
        <div className="flex-grow bg-zinc-800 overflow-hidden flex flex-col">
          {loading ? (
            <div className="flex-grow flex items-center justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500"></div>
            </div>
          ) : error ? (
            <div className="flex-grow flex items-center justify-center">
              <div className="text-red-500">{error}</div>
            </div>
          ) : !activeChat ? (
            <div className="flex-grow flex items-center justify-center">
              <div className="text-gray-400">No secure chat available</div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-zinc-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 bg-zinc-700">
                    <img src={activeChat.avatar} alt={activeChat.name} />
                  </Avatar>
                  <div>
                    <h2 className="text-lg font-semibold">{activeChat.name}</h2>
                    <p className="text-xs text-gray-400">End-to-end encrypted</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => fetchChatMessages(activeChat.id)}
                  className="text-gray-400 hover:text-white hover:bg-zinc-700"
                >
                  <RefreshCw className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Messages */}
              <ScrollArea className="flex-grow p-4" id="silent-chat-messages">
                <div className="space-y-4">
                  {messagesLoading ? (
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                    </div>
                  ) : activeChat.messages.length === 0 ? (
                    <div className="flex justify-center text-gray-400">
                      <p>No messages yet</p>
                    </div>
                  ) : (
                    activeChat.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] rounded-lg p-3 ${
                          message.isCurrentUser 
                            ? message.isSending 
                              ? "bg-red-900" 
                              : "bg-red-800" 
                            : "bg-zinc-700"
                        }`}>
                          {message.senderDisplayName && !message.isCurrentUser && (
                            <p className="text-xs text-red-400 mb-1">{message.senderDisplayName}</p>
                          )}
                          <p>{message.content}</p>
                          <p className="text-xs text-gray-400 mt-1 text-right">
                            {formatMessageTime(message.sentAt)}
                            {message.isSending && " • Sending..."}
                            {message.isFailed && " • Failed"}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  
                  {/* Typing indicator */}
                  {typingUsers.length > 0 && (
                    <div className="flex justify-start">
                      <div className="bg-zinc-700 rounded-lg p-3">
                        <div className="flex items-center gap-1">
                          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Possible responses */}
                  {possibleResponses.length > 0 && (
                    <div className="flex flex-col gap-2 mt-4">
                      <p className="text-sm text-gray-400">Select a response:</p>
                      {possibleResponses.map((response) => (
                        <Button
                          key={response.optionIndex}
                          className="bg-zinc-700 hover:bg-zinc-600 text-left justify-start"
                          data-response-id={response.optionIndex}
                          onClick={sendMessage}
                        >
                          {response.text}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  {/* Reference for scrolling to the bottom */}
                  <div ref={messagesEndRef}></div>
                </div>
              </ScrollArea>
              
              {/* Input area */}
              <div className="p-4 border-t border-zinc-700">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Type a message..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    className="flex-grow bg-zinc-700 border-zinc-600 focus:border-red-500 text-white"
                  />
                  <Button 
                    type="submit" 
                    className="bg-red-600 hover:bg-red-700"
                    disabled={!messageInput.trim() && possibleResponses.length === 0}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
        
        {/* Footer with disclaimer */}
        <div className="bg-zinc-900 p-2 rounded-b-lg">
          <p className="text-xs text-center text-gray-400">
            All messages are end-to-end encrypted. No one outside of this chat can read them.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SilentChat; 