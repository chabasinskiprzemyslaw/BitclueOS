import React from 'react';
import { Search, MoreVertical, Settings, Users, Star, Check, LogOut, Download, RefreshCw } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "../../../../components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../components/ui/dropdown-menu";
import { getChatDisplayName } from './utils';

/**
 * Chat sidebar component for WhatsApp
 */
const ChatSidebar = ({ 
  chats, 
  activeChat, 
  handleChatSelect, 
  fetchChatSessions, 
  loading, 
  userName, 
  handleLogout 
}) => {
  // Filter chats for the "Unread" tab
  const unreadChats = chats.filter(chat => chat.unread);
  
  // State for active tab
  const [activeTab, setActiveTab] = React.useState("all");
  
  // Get chats to display based on active tab
  const getDisplayChats = () => {
    switch (activeTab) {
      case "unread":
        return unreadChats;
      case "favorites":
        return chats.filter(chat => chat.favorite);
      case "groups":
        return chats.filter(chat => chat.isGroup);
      case "all":
      default:
        return chats;
    }
  };
  
  const displayChats = getDisplayChats();
  
  return (
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
      <Tabs value={activeTab} onValueChange={setActiveTab} className="px-2">
        <TabsList className="bg-transparent gap-2">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-[#202C33] text-gray-400 data-[state=active]:text-gray-100"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="unread"
            className="data-[state=active]:bg-[#202C33] text-gray-400 data-[state=active]:text-gray-100 relative"
          >
            Unread
            {unreadChats.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {unreadChats.length}
              </span>
            )}
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
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Loading chats...</p>
            </div>
          </div>
        ) : displayChats.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-center px-4">
            <div className="w-16 h-16 mb-4 opacity-50">
              <img src="/icons/chat.png" alt="No Chats" className="w-full h-full" />
            </div>
            <h3 className="text-gray-300 text-lg mb-2">No Chats Available</h3>
            <p className="text-gray-400 text-sm">
              {activeTab === "all" 
                ? "Start a new conversation or wait for incoming messages"
                : activeTab === "unread"
                  ? "No unread messages"
                  : activeTab === "favorites"
                    ? "No favorite chats yet"
                    : "No group chats available"}
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {displayChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => handleChatSelect(chat)}
                className={`flex items-center gap-3 p-3 cursor-pointer transition-colors
                  ${activeChat && activeChat.id === chat.id ? "bg-[#2A3942]" : "hover:bg-[#202C33]"}
                  ${chat.unread ? "bg-[#202C33]" : ""}`}
              >
                <Avatar className="h-12 w-12 relative">
                  <AvatarImage src={chat.avatar} />
                  <AvatarFallback>{getChatDisplayName(chat)[0]}</AvatarFallback>
                  {chat.unread && (
                    <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {typeof chat.unreadCount === 'number' && chat.unreadCount > 0 
                        ? chat.unreadCount > 9 ? '9+' : chat.unreadCount 
                        : ''}
                    </span>
                  )}
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
  );
};

export default ChatSidebar; 