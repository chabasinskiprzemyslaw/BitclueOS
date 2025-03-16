import React from 'react';
import { RefreshCw, Mic, Smile, Paperclip } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { getChatDisplayName } from './utils';

/**
 * Chat area component for WhatsApp
 */
const ChatArea = ({
  activeChat,
  connectionStatus,
  messagesLoading,
  fetchChatMessages,
  typingUsers,
  messageInput,
  setMessageInput,
  handleSendMessage,
  possibleResponses,
  messagesEndRef
}) => {
  if (!activeChat) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <p className="text-gray-400">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <>
      {/* Chat Header */}
      <div className="p-4 flex items-center justify-between bg-[#202C33]">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={activeChat.avatar} />
            <AvatarFallback>{getChatDisplayName(activeChat)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{getChatDisplayName(activeChat)}</p>
            <p className="text-xs text-gray-400">
              {connectionStatus === "connected" ? (
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span> Online
                </span>
              ) : connectionStatus === "reconnecting" ? (
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1 animate-pulse"></span> Reconnecting...
                </span>
              ) : (
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span> Offline
                </span>
              )}
            </p>
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
          <div className="space-y-4" key={`chat-${activeChat.id}`}>
            {activeChat.messages.map((message) => (
              <div key={message.id} className={`flex ${message.sent ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[60%] rounded-lg p-3 ${
                  message.sent 
                    ? message.isSending 
                      ? "bg-[#004238]" // Darker background for sending messages
                      : "bg-[#005C4B]" 
                    : "bg-[#202C33]"
                }`}>
                  {message.senderName && !message.sent && (
                    <p className="text-xs text-teal-400 mb-1">{message.senderName}</p>
                  )}
                  <p className={`text-sm ${message.isSending ? "text-gray-300" : "text-white"}`}>{message.text}</p>
                  <div className="flex items-center justify-end mt-1 space-x-1">
                    <p className="text-xs text-gray-400">{message.time}</p>
                    {message.isSending && (
                      <span className="text-xs text-gray-400 italic">sending...</span>
                    )}
                    {message.isFailed && (
                      <span className="text-xs text-red-400 flex items-center">
                        <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor" />
                        </svg>
                        Failed
                      </span>
                    )}
                    {message.isTemporary && !message.isSending && !message.isFailed && (
                      <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM9 16H11V18H13V16H15V14H9V16ZM12 6C9.79 6 8 7.79 8 10H10C10 8.9 10.9 8 12 8C13.1 8 14 8.9 14 10C14 12 11 11.75 11 15H13C13 12.75 16 12.5 16 10C16 7.79 14.21 6 12 6Z" fill="currentColor" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing indicator */}
            {typingUsers && typingUsers.length > 0 && (
              <div className="flex justify-start">
                <div className="bg-[#202C33] rounded-lg p-3 max-w-[60%]">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "600ms" }}></div>
                    </div>
                    <p className="text-xs text-gray-400">
                      {typingUsers.length === 1 
                        ? `${typingUsers[0].name} is typing...` 
                        : `${typingUsers.length} people are typing...`}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-400">No messages yet. Start a conversation!</p>
          </div>
        )}
      </ScrollArea>

      {/* Possible Responses */}
      {typingUsers.length === 0 && possibleResponses.length > 0 && (
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
          placeholder={possibleResponses.length > 0 ? "Choose a response above or type a message" : "Type a message"}
          className="bg-[#2A3942] border-0 text-gray-100 placeholder:text-gray-500 focus-visible:ring-0"
          disabled={false}
        />
        <Button type="submit" variant="ghost" size="icon" className="text-gray-400">
          {messageInput.trim() ? (
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor" />
            </svg>
          ) : (
            <Mic className="h-6 w-6" />
          )}
        </Button>
      </form>
    </>
  );
};

export default ChatArea; 