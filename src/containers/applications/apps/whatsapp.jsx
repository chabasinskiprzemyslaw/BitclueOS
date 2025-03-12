"use client"

import { useState } from "react"
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
} from "lucide-react"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { ScrollArea } from "../../../components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import { useSelector } from "react-redux";
import { ToolBar } from "../../../utils/general";

// Sample chat data with unread property
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
    name: "Alice Smith",
    avatar: "/placeholder.svg",
    lastMessage: "The meeting is at 3 PM",
    timestamp: "11:45 AM",
    unread: false,
    messages: [
      { id: 1, text: "Hi, when is the meeting?", sent: true, time: "11:40 AM" },
      { id: 2, text: "The meeting is at 3 PM", sent: false, time: "11:45 AM" },
      { id: 3, text: "Thanks! I'll be there", sent: true, time: "11:46 AM" },
    ],
  },
  {
    id: 3,
    name: "Team Chat",
    avatar: "/placeholder.svg",
    lastMessage: "Project deadline updated",
    timestamp: "10:20 AM",
    unread: true,
    messages: [
      { id: 1, text: "Project deadline updated to next Friday", sent: false, time: "10:15 AM" },
      { id: 2, text: "Thanks for the update", sent: true, time: "10:18 AM" },
      { id: 3, text: "Please review the latest changes", sent: false, time: "10:20 AM" },
    ],
  },
]

export const WhatsApp = () => {
  const wnapp = useSelector((state) => state.apps.whatsapp);

  const [chats, setChats] = useState(INITIAL_CHATS)
  const [activeChat, setActiveChat] = useState(chats[0])
  const [messageInput, setMessageInput] = useState("")

  const handleChatSelect = (chat) => {
    setActiveChat(chat)
    // Mark the selected chat as read
    setChats((prevChats) => prevChats.map((c) => (c.id === chat.id ? { ...c, unread: false } : c)))
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!messageInput.trim()) return

    const newMessage = {
      id: activeChat.messages.length + 1,
      text: messageInput,
      sent: true,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    const updatedChat = {
      ...activeChat,
      messages: [...activeChat.messages, newMessage],
      lastMessage: messageInput,
      timestamp: newMessage.time,
    }

    setChats((prevChats) => prevChats.map((chat) => (chat.id === activeChat.id ? updatedChat : chat)))
    setActiveChat(updatedChat)
    setMessageInput("")
  }

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
                  <DropdownMenuItem className="focus:bg-[#202C33] cursor-pointer">
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
            <div className="space-y-1">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleChatSelect(chat)}
                  className={`flex items-center gap-3 p-3 cursor-pointer transition-colors
                    ${activeChat.id === chat.id ? "bg-[#2A3942]" : "hover:bg-[#202C33]"}
                    ${chat.unread ? "bg-[#202C33]" : ""}`}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={chat.avatar} />
                    <AvatarFallback>{chat.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <p className={`text-sm font-medium truncate ${chat.unread ? "text-white" : "text-gray-300"}`}>
                        {chat.name}
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
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className="flex flex-col">
          {/* Chat Header */}
          <div className="p-4 flex items-center justify-between bg-[#202C33]">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={activeChat.avatar} />
                <AvatarFallback>{activeChat.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{activeChat.name}</p>
                <p className="text-sm text-gray-400">online</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" className="text-gray-400">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {activeChat.messages.map((message) => (
                <div key={message.id} className={`flex ${message.sent ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[60%] rounded-lg p-3 ${message.sent ? "bg-[#005C4B]" : "bg-[#202C33]"}`}>
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs text-gray-400 text-right mt-1">{message.time}</p>
                  </div>
                </div>
              ))}
            </div>
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
        </div>
      </div>
    </div>

    </div>
  )
}

