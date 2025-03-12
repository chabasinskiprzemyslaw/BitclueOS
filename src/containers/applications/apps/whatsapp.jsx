"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { ScrollArea } from "../../../components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import { useSelector } from "react-redux";
import { ToolBar } from "../../../utils/general";
import axios from "axios";

// Sample chat data as fallback
const INITIAL_CHATS = [
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
  // ... other sample chats
]

// API endpoint for chat sessions
const API_URL = "https://localhost:5001/chats/sessions";
const API_MESSAGES_URL = "https://localhost:5001/chats";

export const WhatsApp = () => {
  const wnapp = useSelector((state) => state.apps.whatsapp);
  const userName = useSelector((state) => state.setting.person.name);

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("auth_token") || "");

  // Check if user is authenticated
  useEffect(() => {
    const checkAuthentication = async () => {
      setAuthLoading(true);
      const storedToken = localStorage.getItem("auth_token");
      
      if (storedToken) {
        // Check if token is still valid (not expired)
        const tokenExpiry = localStorage.getItem("token_expiry");
        const isValid = tokenExpiry && new Date().getTime() < parseInt(tokenExpiry);
        
        if (isValid) {
          console.log("Valid token found, setting authenticated state");
          setToken(storedToken);
          setIsAuthenticated(true);
        } else {
          // Token expired, clear it
          console.log("Token expired, clearing authentication data");
          localStorage.removeItem("auth_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("token_expiry");
          setToken("");
        }
      } else {
        console.log("No auth token found in localStorage");
        setToken("");
      }
      
      setAuthLoading(false);
    };
    
    checkAuthentication();
  }, []);

  // Fetch messages for a specific chat session
  const fetchChatMessages = async (chatId) => {
    if (!chatId || !token) return;
    
    try {
      setMessagesLoading(true);
      
      // Make request to get messages for the selected chat
      const response = await axios.get(`${API_MESSAGES_URL}/${chatId}/messages`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const messagesData = response.data;
      
      // Transform API response to match our component's data structure
      const transformedMessages = messagesData.map(message => {
        return {
          id: message.id,
          text: message.content,
          sent: message.senderUserId !== activeChat.sessionData.participants[0].id, // Assuming the first participant is the other user
          time: formatDateTime(message.sentAt),
          isRead: message.isRead,
          hasAttachment: message.hasAttachment,
          senderName: message.senderDisplayName
        };
      });
      
      // Update the active chat with the fetched messages
      setActiveChat(prevChat => ({
        ...prevChat,
        messages: transformedMessages
      }));
      
      // Also update the chat in the chats list
      setChats(prevChats => 
        prevChats.map(chat => 
          chat.id === chatId 
            ? { ...chat, messages: transformedMessages, unread: false } 
            : chat
        )
      );
      
    } catch (err) {
      console.error("Error fetching chat messages:", err);
      
      // Handle 401 Unauthorized error
      if (err.response && err.response.status === 401) {
        setIsAuthenticated(false);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("token_expiry");
        setError("Your session has expired. Please log in again.");
      }
    } finally {
      setMessagesLoading(false);
    }
  };

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      setAuthError("Username and password are required");
      return;
    }
    
    try {
      setAuthLoading(true);
      setAuthError(null);
      
      // Prepare form data for Keycloak token request
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('client_id', 'evently-public-client');
      formData.append('scope', 'email openid');
      formData.append('username', username);
      formData.append('password', password);
      
      // Make the request to Keycloak token endpoint
      const response = await fetch('http://localhost:18080/realms/evently/protocol/openid-connect/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Authentication successful
        const { access_token, refresh_token, expires_in } = data;
        
        // Store tokens in localStorage
        localStorage.setItem("auth_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("token_expiry", new Date().getTime() + (expires_in * 1000));
        
        setToken(access_token);
        setIsAuthenticated(true);
      } else {
        // Authentication failed
        setAuthError(data.error_description || "Invalid username or password");
      }
    } catch (err) {
      console.error("Login error:", err);
      setAuthError("Authentication failed. Please check your connection and try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expiry");
    setToken("");
    setIsAuthenticated(false);
    setChats([]);
    setActiveChat(null);
  };

  // Fetch chat sessions from API
  useEffect(() => {
    // Only fetch chats if authenticated
    if (!isAuthenticated || !token) return;
    
    console.log("Fetching chat sessions with token:", token.substring(0, 10) + "...");
    
    const fetchChatSessions = async () => {
      try {
        setLoading(true);
        
        // Include the auth token in the request
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const chatSessions = response.data;
        console.log("Fetched chat sessions:", chatSessions.length);
        
        // Transform API response to match our component's data structure
        const transformedChats = chatSessions.map(session => {
          // Find the other participant (assuming 2-person chat)
          const otherParticipant = session.participants.find(p => true); // Replace with actual logic to find the other user
          
          return {
            id: session.id,
            name: otherParticipant ? otherParticipant.displayName : "Chat",
            avatar: "/placeholder.svg", // Default avatar
            lastMessage: session.lastMessage ? session.lastMessage.content : "No messages yet",
            timestamp: session.lastMessage ? formatDateTime(session.lastMessage.sentAt) : formatDateTime(session.createdAt),
            unread: session.hasUnreadMessages,
            isOnline: otherParticipant ? otherParticipant.isOnline : false,
            messages: [], // We'll fetch messages separately when a chat is selected
            sessionData: session // Keep the original data for reference
          };
        });
        
        setChats(transformedChats);
        
        // Set active chat if we have chats and none is selected yet
        if (transformedChats.length > 0 && !activeChat) {
          setActiveChat(transformedChats[0]);
          // Fetch messages for the first chat
          fetchChatMessages(transformedChats[0].id);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching chat sessions:", err);
        
        // Handle 401 Unauthorized error
        if (err.response && err.response.status === 401) {
          console.error("Unauthorized: Token may be invalid");
          setIsAuthenticated(false);
          localStorage.removeItem("auth_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("token_expiry");
          setError("Your session has expired. Please log in again.");
        } else {
          setError("Failed to load chats. Please try again later.");
          // Fall back to sample data in case of error
          setChats(INITIAL_CHATS);
          if (!activeChat && INITIAL_CHATS.length > 0) {
            setActiveChat(INITIAL_CHATS[0]);
          }
        }
        
        setLoading(false);
      }
    };

    // Initial fetch
    fetchChatSessions();
    
    // Only set up polling if the app is visible (not hidden)
    let intervalId = null;
    if (!wnapp.hide) {
      console.log("Setting up chat polling interval");
      intervalId = setInterval(fetchChatSessions, 30000);
    }
    
    // Clean up interval on component unmount or when dependencies change
    return () => {
      if (intervalId) {
        console.log("Clearing chat polling interval");
        clearInterval(intervalId);
      }
    };
  }, [isAuthenticated, token, wnapp.hide, activeChat]);

  // Helper function to format date/time
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    // Mark the selected chat as read
    setChats((prevChats) => prevChats.map((c) => (c.id === chat.id ? { ...c, unread: false } : c)));
    
    // Fetch messages for the selected chat
    fetchChatMessages(chat.id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChat) return;

    const tempId = Date.now();
    const newMessage = {
      id: tempId,
      text: messageInput,
      sent: true,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      pending: true
    };

    // Update UI optimistically
    const updatedChat = {
      ...activeChat,
      messages: [...(activeChat.messages || []), newMessage],
      lastMessage: messageInput,
      timestamp: newMessage.time,
    };

    setChats((prevChats) => prevChats.map((chat) => (chat.id === activeChat.id ? updatedChat : chat)));
    setActiveChat(updatedChat);
    setMessageInput("");

    // Send the message to the API
    try {
      const response = await axios.post(`${API_MESSAGES_URL}/${activeChat.id}/messages`, {
        content: messageInput
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Update the message with the server response
      const sentMessage = response.data;
      
      // Replace the temporary message with the actual one from the server
      const updatedMessages = activeChat.messages.map(msg => 
        msg.id === tempId 
          ? {
              id: sentMessage.id,
              text: sentMessage.content,
              sent: true,
              time: formatDateTime(sentMessage.sentAt),
              isRead: sentMessage.isRead,
              pending: false
            }
          : msg
      );
      
      // Update the active chat with the updated messages
      const finalUpdatedChat = {
        ...activeChat,
        messages: updatedMessages
      };
      
      setActiveChat(finalUpdatedChat);
      setChats(prevChats => prevChats.map(chat => 
        chat.id === activeChat.id ? finalUpdatedChat : chat
      ));
      
    } catch (err) {
      console.error("Error sending message:", err);
      
      // Mark the message as failed
      const failedMessages = activeChat.messages.map(msg => 
        msg.id === tempId 
          ? { ...msg, failed: true, pending: false }
          : msg
      );
      
      const chatWithFailedMessage = {
        ...activeChat,
        messages: failedMessages
      };
      
      setActiveChat(chatWithFailedMessage);
      setChats(prevChats => prevChats.map(chat => 
        chat.id === activeChat.id ? chatWithFailedMessage : chat
      ));
    }
  };

  // Get the name to display for a chat (for group chats vs individual chats)
  const getChatDisplayName = (chat) => {
    if (!chat) return "";
    
    // If we have the original session data
    if (chat.sessionData && chat.sessionData.participants) {
      // For simplicity, just show the first participant's name
      // In a real app, you might want to show all participants for group chats
      const otherParticipant = chat.sessionData.participants[0];
      return otherParticipant ? otherParticipant.displayName : chat.name;
    }
    
    return chat.name;
  };

  // Login screen component
  const LoginScreen = () => (
    <div className="flex flex-col items-center justify-center h-full bg-[#111B21] text-gray-100">
      <div className="w-80 p-6 bg-[#202C33] rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <Lock className="h-12 w-12 text-[#00A884]" />
        </div>
        <h2 className="text-xl font-semibold text-center mb-6">Sign in to WhatsApp</h2>
        
        {authError && (
          <div className="mb-4 p-2 bg-red-900/30 border border-red-800 rounded text-red-200 text-sm">
            {authError}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-1 text-gray-300">
                Username
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-[#2A3942] border-0 text-gray-100 placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#00A884]"
                placeholder="Enter your username"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-300">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#2A3942] border-0 text-gray-100 placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#00A884]"
                placeholder="Enter your password"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#00A884] hover:bg-[#008f6e] text-white"
              disabled={authLoading}
            >
              {authLoading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

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
      <ToolBar
              app={wnapp.action}
              icon={wnapp.icon}
              size={wnapp.size}
              name="WhatsApp"
            />
      
      {authLoading ? (
        <div className="h-screen bg-[#111B21] text-gray-100 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-[#00A884] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Loading WhatsApp...</p>
          </div>
        </div>
      ) : !isAuthenticated ? (
        <LoginScreen />
      ) : (
        <div className="h-screen bg-[#0B141A] text-gray-100">
          <div className="grid h-full" style={{ gridTemplateColumns: "30% 1fr" }}>
            {/* Left Sidebar */}
            <div className="border-r border-gray-800">
              {/* Header */}
              <div className="p-4 flex items-center justify-between bg-[#202C33]">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex gap-4">
                  <Button variant="ghost" size="icon" className="text-gray-400">
                    <Settings className="h-5 w-5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-gray-400">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-[#233138] border-none text-gray-100">
                      <DropdownMenuItem className="focus:bg-[#202C33] cursor-pointer">
                        <Users className="mr-2 h-4 w-4" />
                        <span>New group</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="focus:bg-[#202C33] cursor-pointer">
                        <Star className="mr-2 h-4 w-4" />
                        <span>Starred messages</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="focus:bg-[#202C33] cursor-pointer">
                        <Check className="mr-2 h-4 w-4" />
                        <span>Select chats</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="focus:bg-[#202C33] cursor-pointer" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="focus:bg-[#202C33] cursor-pointer">
                        <Download className="mr-2 h-4 w-4" />
                        <span>Get WhatsApp for Windows</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Search */}
              <div className="p-2">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search"
                    className="pl-9 bg-[#202C33] border-0 text-gray-100 placeholder:text-gray-500 focus-visible:ring-0"
                  />
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="all" className="px-2">
                <TabsList className="bg-transparent gap-2">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-[#202C33] text-gray-400 data-[state=active]:text-gray-100"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="unread"
                    className="data-[state=active]:bg-[#202C33] text-gray-400 data-[state=active]:text-gray-100"
                  >
                    Unread
                  </TabsTrigger>
                  <TabsTrigger
                    value="favorites"
                    className="data-[state=active]:bg-[#202C33] text-gray-400 data-[state=active]:text-gray-100"
                  >
                    Favorites
                  </TabsTrigger>
                  <TabsTrigger
                    value="groups"
                    className="data-[state=active]:bg-[#202C33] text-gray-400 data-[state=active]:text-gray-100"
                  >
                    Groups
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Chat List */}
              <ScrollArea className="h-[calc(100vh-180px)]">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-gray-400">Loading chats...</p>
                  </div>
                ) : error ? (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-red-400">{error}</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {chats.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => handleChatSelect(chat)}
                        className={`flex items-center gap-3 p-3 cursor-pointer transition-colors
                          ${activeChat && activeChat.id === chat.id ? "bg-[#2A3942]" : "hover:bg-[#202C33]"}
                          ${chat.unread ? "bg-[#202C33]" : ""}`}
                      >
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={chat.avatar} />
                          <AvatarFallback>{getChatDisplayName(chat)[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline">
                            <p className={`text-sm font-medium truncate ${chat.unread ? "text-white" : "text-gray-300"}`}>
                              {getChatDisplayName(chat)}
                            </p>
                            <span className={`text-xs ${chat.unread ? "text-teal-400" : "text-gray-400"}`}>
                              {chat.timestamp}
                            </span>
                          </div>
                          <div className="flex items-center">
                            {chat.unread && <div className="w-2 h-2 bg-teal-400 rounded-full mr-2"></div>}
                            <p className={`text-sm truncate ${chat.unread ? "text-white" : "text-gray-400"}`}>
                              {chat.lastMessage}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Main Chat Area */}
            <div className="flex flex-col">
              {activeChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 flex items-center justify-between bg-[#202C33]">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={activeChat.avatar} />
                        <AvatarFallback>{getChatDisplayName(activeChat)[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{getChatDisplayName(activeChat)}</p>
                        <p className="text-sm text-gray-400">
                          {activeChat.isOnline ? "online" : "offline"}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-gray-400">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Messages Area */}
                  <ScrollArea className="flex-1 p-4">
                    {messagesLoading ? (
                      <div className="flex justify-center items-center h-full">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                          <p className="text-gray-400 text-sm">Loading messages...</p>
                        </div>
                      </div>
                    ) : activeChat.messages && activeChat.messages.length > 0 ? (
                      <div className="space-y-4">
                        {activeChat.messages.map((message) => (
                          <div key={message.id} className={`flex ${message.sent ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[60%] rounded-lg p-3 ${message.sent ? "bg-[#005C4B]" : "bg-[#202C33]"} ${message.failed ? "opacity-70" : ""}`}>
                              <p className="text-sm">{message.text}</p>
                              <div className="flex items-center justify-end mt-1 space-x-1">
                                {message.pending && (
                                  <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                )}
                                {message.failed && (
                                  <span className="text-red-400 text-xs">Failed</span>
                                )}
                                <p className="text-xs text-gray-400">{message.time}</p>
                                {message.sent && !message.pending && !message.failed && (
                                  <span className="text-xs text-gray-400 ml-1">
                                    {message.isRead ? "✓✓" : "✓"}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex justify-center items-center h-full">
                        <p className="text-gray-400">No messages yet. Start a conversation!</p>
                      </div>
                    )}
                  </ScrollArea>

                  {/* Message Input */}
                  <form onSubmit={handleSendMessage} className="p-4 bg-[#202C33] flex items-center gap-4">
                    <Button type="button" variant="ghost" size="icon" className="text-gray-400">
                      <Smile className="h-6 w-6" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="text-gray-400">
                      <Paperclip className="h-6 w-6" />
                    </Button>
                    <Input
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type a message"
                      className="bg-[#2A3942] border-0 text-gray-100 placeholder:text-gray-500 focus-visible:ring-0"
                    />
                    <Button type="submit" variant="ghost" size="icon" className="text-gray-400">
                      <Mic className="h-6 w-6" />
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <p>Select a chat to start messaging</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}