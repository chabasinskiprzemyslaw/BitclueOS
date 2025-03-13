"use client"

import { useState, useEffect, useCallback, useRef } from "react"
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
]

// API endpoint for chat sessions
const API_URL = "https://localhost:5001/chats/sessions";
const API_MESSAGES_URL = "https://localhost:5001/chats";

export const WhatsApp = () => {
  const wnapp = useSelector((state) => state.apps.whatsapp);
  const userName = useSelector((state) => state.setting.person.name);

  // Helper function to format date/time
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const [chats, setChats] = useState(INITIAL_CHATS);
  const [activeChat, setActiveChat] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState(null);
  // Add state for possible responses
  const [possibleResponses, setPossibleResponses] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  
  // Authentication states - Get token from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState(null);
  const [token, setToken] = useState("");
  
  // Track if messages have been loaded for a chat to prevent repeated requests
  const [loadedMessageChats, setLoadedMessageChats] = useState(new Set());
  
  // Use refs to track in-progress requests to prevent duplicates
  const fetchingMessagesRef = useRef(false);
  const fetchingChatsRef = useRef(false);

  // Check if user is authenticated by looking for token in localStorage
  useEffect(() => {
    const checkAuth = () => {
      setAuthLoading(true);
      try {
        const storedToken = localStorage.getItem('auth_token');
        if (storedToken) {
          setToken(storedToken);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Error checking authentication:", err);
        setIsAuthenticated(false);
      } finally {
        setAuthLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Fetch messages for a specific chat session
  const fetchChatMessages = useCallback(async (chatId) => {
    // If we've already loaded messages for this chat, use local data
    if (loadedMessageChats.has(chatId)) {
      const selectedChat = chats.find(chat => chat.id === chatId);
      if (selectedChat) {
        setActiveChat(selectedChat);
        
        // Check for possible responses in the last message
        if (selectedChat.messages && selectedChat.messages.length > 0) {
          const lastMessage = selectedChat.messages[selectedChat.messages.length - 1];
          if (lastMessage.possibleResponses && lastMessage.possibleResponses.length > 0) {
            setPossibleResponses(lastMessage.possibleResponses);
            setInputDisabled(true);
          } else {
            setPossibleResponses([]);
            setInputDisabled(false);
          }
        }
        
        // Mark the chat as read
        setChats(prevChats => 
          prevChats.map(chat => 
            chat.id === chatId 
              ? { ...chat, unread: false } 
              : chat
          )
        );
      }
      return;
    }
    
    // Prevent duplicate requests
    if (fetchingMessagesRef.current) return;
    fetchingMessagesRef.current = true;
    
    // Set loading state
    setMessagesLoading(true);
    
    try {
      // Get the latest token from localStorage
      const currentToken = localStorage.getItem('auth_token') || token;
      
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
          text: msg.content,
          sent: msg.isCurrentUser,
          time: formatDateTime(msg.timestamp || msg.sentAt),
          senderName: msg.senderDisplayName,
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
        setActiveChat(updatedChat);
        
        // Check for possible responses in the last message
        if (formattedMessages.length > 0) {
          const lastMessage = formattedMessages[formattedMessages.length - 1];
          if (lastMessage.possibleResponses && lastMessage.possibleResponses.length > 0) {
            setPossibleResponses(lastMessage.possibleResponses);
            setInputDisabled(true);
          } else {
            setPossibleResponses([]);
            setInputDisabled(false);
          }
        }
        
        // Mark this chat as having loaded messages
        setLoadedMessageChats(prev => new Set(prev).add(chatId));
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError(`Failed to load messages: ${err.message}`);
      
      // Fallback to local data if available
      const selectedChat = chats.find(chat => chat.id === chatId);
      if (selectedChat) {
        setActiveChat(selectedChat);
      }
    } finally {
      setMessagesLoading(false);
      fetchingMessagesRef.current = false;
    }
  }, [chats, token, loadedMessageChats]);

  // Function to fetch chat sessions
  const fetchChatSessions = useCallback(async () => {
    // Prevent duplicate requests
    if (fetchingChatsRef.current || loading) return;
    fetchingChatsRef.current = true;
    
    setLoading(true);
    setError(null);
    
    try {
      // Get the latest token from localStorage
      const currentToken = localStorage.getItem('auth_token') || token;
      
      const response = await fetch(API_URL, {
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
        throw new Error(`Failed to fetch chats: ${response.status}`);
      }
      
      const chatData = await response.json();
      
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
      
      setChats(formattedChats.length > 0 ? formattedChats : INITIAL_CHATS);
      
      // Don't automatically set active chat here
    } catch (err) {
      console.error("Error fetching chats:", err);
      setError(`Failed to load chats: ${err.message}`);
      // Fallback to initial chats
      setChats(INITIAL_CHATS);
    } finally {
      setLoading(false);
      fetchingChatsRef.current = false;
    }
  }, [token]);

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    
    try {
      // In a real app, you would make an API call to authenticate
      // For demo purposes, we'll simulate a successful login
      const mockToken = "mock-auth-token-" + Date.now();
      
      // Store token in localStorage
      localStorage.setItem('auth_token', mockToken);
      
      // Update state
      setToken(mockToken);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Login error:", err);
      setAuthError("Failed to login. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('auth_token');
    
    // Reset state
    setToken("");
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    setActiveChat(null);
    setLoadedMessageChats(new Set());
  };

  // Fetch chat sessions when the app becomes visible
  useEffect(() => {
    let isMounted = true;
    
    if (wnapp.hide === false && isAuthenticated && isMounted) {
      fetchChatSessions();
    }
    
    return () => {
      isMounted = false;
    };
  }, [wnapp.hide, isAuthenticated, fetchChatSessions]);

  const handleChatSelect = (chat) => {
    // Fetch messages for the selected chat
    fetchChatMessages(chat.id);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if ((!messageInput.trim() && !e.currentTarget.dataset.responseId) || !activeChat) return;

    // Get the message content - either from input or from selected response
    const content = e.currentTarget.dataset.responseId 
      ? possibleResponses.find(r => r.optionIndex.toString() === e.currentTarget.dataset.responseId)?.text || messageInput
      : messageInput;
    
    // Get the nextMessageId if this is a predefined response
    const nextMessageId = e.currentTarget.dataset.responseId 
      ? possibleResponses.find(r => r.optionIndex.toString() === e.currentTarget.dataset.responseId)?.nextMessageId
      : null;

    const newMessage = {
      id: Date.now(),
      text: content,
      sent: true,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Update UI immediately for better UX
    const updatedChat = {
      ...activeChat,
      messages: [...(activeChat.messages || []), newMessage],
      lastMessage: content,
      timestamp: newMessage.time,
    };

    setChats((prevChats) => prevChats.map((chat) => (chat.id === activeChat.id ? updatedChat : chat)));
    setActiveChat(updatedChat);
    setMessageInput("");
    
    // Clear possible responses after selection
    setPossibleResponses([]);
    
    // Send message to API
    sendMessageToApi(activeChat.id, content, nextMessageId);
  };

  // Function to send message to API
  const sendMessageToApi = async (chatId, content, nextMessageId = null) => {
    try {
      // Get the latest token from localStorage
      const currentToken = localStorage.getItem('auth_token') || token;
      
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
      
      // Make the API request to the correct endpoint
      const response = await fetch(`https://localhost:5001/chats/messages`, {
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
        return;
      }
      
      // If we have a nextMessageId, we should receive a new message in response
      // Fetch the updated messages to get the next message in the conversation
      if (nextMessageId) {
        // Small delay to ensure the server has processed the message
        setTimeout(() => {
          fetchChatMessages(chatId);
        }, 500);
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Get the name to display for a chat (for group chats vs individual chats)
  const getChatDisplayName = (chat) => {
    return chat ? chat.name : "";
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
        <div className="h-full bg-[#111B21] text-gray-100 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-[#00A884] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Loading WhatsApp...</p>
          </div>
        </div>
      ) : !isAuthenticated ? (
        <LoginScreen />
      ) : (
        <div className="h-full bg-[#0B141A] text-gray-100 flex flex-col">
          <div className="grid flex-grow overflow-hidden" style={{ gridTemplateColumns: "30% 1fr" }}>
            {/* Left Sidebar */}
            <div className="border-r border-gray-800 flex flex-col h-full overflow-hidden">
              {/* Header */}
              <div className="p-4 flex items-center justify-between bg-[#202C33]">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{userName ? userName[0] : "U"}</AvatarFallback>
                </Avatar>
                <div className="flex gap-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-gray-400"
                    onClick={fetchChatSessions}
                    disabled={loading}
                  >
                    <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                  </Button>
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
              <ScrollArea className="h-[calc(100%-130px)]">
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
            <div className="flex flex-col h-full">
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
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-gray-400"
                        onClick={() => fetchChatMessages(activeChat.id)}
                        disabled={messagesLoading}
                      >
                        <RefreshCw className={`h-5 w-5 ${messagesLoading ? 'animate-spin' : ''}`} />
                      </Button>
                    </div>
                  </div>

                  {/* Messages Area */}
                  <ScrollArea className="flex-1 p-4 overflow-y-auto">
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
                            <div className={`max-w-[60%] rounded-lg p-3 ${message.sent ? "bg-[#005C4B]" : "bg-[#202C33]"}`}>
                              {message.senderName && !message.sent && (
                                <p className="text-xs text-teal-400 mb-1">{message.senderName}</p>
                              )}
                              <p className="text-sm">{message.text}</p>
                              <div className="flex items-center justify-end mt-1 space-x-1">
                                <p className="text-xs text-gray-400">{message.time}</p>
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

                  {/* Possible Responses */}
                  {possibleResponses.length > 0 && (
                    <div className="p-3 bg-[#1A2C35] border-t border-gray-800">
                      <p className="text-xs text-gray-400 mb-2">Choose a response:</p>
                      <div className="space-y-2">
                        {possibleResponses.map((response) => (
                          <button
                            key={response.optionIndex}
                            data-response-id={response.optionIndex}
                            onClick={handleSendMessage}
                            className="w-full text-left p-2 rounded bg-[#2A3942] hover:bg-[#34444E] text-gray-100 text-sm transition-colors"
                          >
                            {response.text}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

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
                      placeholder={inputDisabled ? "Please select a response above" : "Type a message"}
                      className={`bg-[#2A3942] border-0 text-gray-100 placeholder:text-gray-500 focus-visible:ring-0 ${inputDisabled ? 'opacity-50' : ''}`}
                      disabled={inputDisabled}
                    />
                    <Button type="submit" variant="ghost" size="icon" className="text-gray-400" disabled={inputDisabled}>
                      <Mic className="h-6 w-6" />
                    </Button>
                  </form>
                </>
              ) : (
                <div className="flex-grow flex items-center justify-center">
                  <p className="text-gray-400">Select a chat to start messaging</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};