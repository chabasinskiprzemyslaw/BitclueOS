import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, Image as ImageIcon, Video, X } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { Avatar } from "../../../../components/ui/avatar";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import MediaViewer from './MediaViewer';

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
  messagesEndRef,
}) => {
  const [selectedMedia, setSelectedMedia] = useState(null);
  const scrollPositionRef = useRef(null);
  
  // Save scroll position before re-render
  useEffect(() => {
    if (activeChat) {
      const scrollArea = document.getElementById('chat-messages-scroll-area');
      if (scrollArea) {
        const viewport = scrollArea.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          scrollPositionRef.current = {
            scrollTop: viewport.scrollTop,
            scrollHeight: viewport.scrollHeight,
            clientHeight: viewport.clientHeight
          };
        }
      }
    }
  });
  
  // Restore scroll position after render if needed
  useEffect(() => {
    if (scrollPositionRef.current && activeChat?._isSignalRUpdate) {
      const scrollArea = document.getElementById('chat-messages-scroll-area');
      if (scrollArea) {
        const viewport = scrollArea.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
          const { scrollTop, scrollHeight, clientHeight } = scrollPositionRef.current;
          
          // If user was not near bottom, maintain their position relative to content
          const wasNearBottom = scrollHeight - scrollTop - clientHeight < 100;
          
          if (!wasNearBottom) {
            // Set scroll position to maintain the same view despite new content
            const newScrollHeight = viewport.scrollHeight;
            const heightDifference = newScrollHeight - scrollHeight;
            viewport.scrollTop = scrollTop + heightDifference;
          }
        }
      }
    }
  }, [activeChat?.messages]);

  // Add early return with debug info
  if (!activeChat?.messages) {
    console.log('No messages available:', { activeChat });
    return (
      <div className="flex-grow flex items-center justify-center">
        <p className="text-gray-400">No messages available</p>
      </div>
    );
  }

  if (!activeChat) {
    console.log('No active chat');
    return (
      <div className="flex-grow flex items-center justify-center">
        <p className="text-gray-400">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <img src={activeChat.avatar} alt={activeChat.name} />
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">{activeChat.name}</h2>
            <p className="text-sm text-gray-400">{connectionStatus}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => fetchChatMessages(activeChat.id)}>
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" id="chat-messages-scroll-area">
        <div className="space-y-4">
          {messagesLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : (
            activeChat.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[60%] rounded-lg p-3 ${
                  message.isCurrentUser 
                    ? message.isSending 
                      ? "bg-[#004238]" // Darker background for sending messages
                      : "bg-[#005C4B]" 
                    : "bg-[#202C33]"
                }`}>
                  {message.senderDisplayName && !message.isCurrentUser && (
                    <p className="text-xs text-teal-400 mb-1">{message.senderDisplayName}</p>
                  )}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="grid gap-2 mb-2">
                      {message.attachments.map((attachment) => {
                        const isImage = attachment.contentType.startsWith('image/');
                        const isVideo = attachment.contentType.startsWith('video/');

                        if (!isImage && !isVideo) return null;

                        return (
                          <div 
                            key={attachment.id} 
                            className="relative cursor-pointer"
                            onClick={() => setSelectedMedia(attachment)}
                          >
                            {isImage ? (
                              <img 
                                src={attachment.fileUrl} 
                                alt={attachment.fileName} 
                                className="max-w-full rounded-lg hover:opacity-90 transition-opacity"
                              />
                            ) : (
                              <video 
                                src={attachment.fileUrl} 
                                controls 
                                className="max-w-full rounded-lg"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {message.content && (
                    <p className={`text-sm ${message.isSending ? "text-gray-300" : "text-white"}`}>
                      {message.content}
                    </p>
                  )}
                  <div className="flex items-center justify-end mt-1 space-x-1">
                    <p className="text-xs text-gray-400">
                      {formatMessageTime(message.sentAt)}
                    </p>
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
                  </div>
                </div>
              </div>
            ))
          )}
          {/* Typing Indicator */}
          {typingUsers && typingUsers.length > 0 && (
            <div className="flex justify-start">
              <div className="max-w-[60%] rounded-lg p-3 bg-[#202C33]">
                <div className="flex items-center">
                  <span className="text-sm text-gray-300">
                    {typingUsers.length === 1 
                      ? `${typingUsers[0].displayName} is typing...` 
                      : `${typingUsers.length} people are typing...`}
                  </span>
                  <div className="ml-2 flex">
                    <div className="dot-typing"></div>
                    <div className="dot-typing animation-delay-200"></div>
                    <div className="dot-typing animation-delay-400"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-700">
        {/* Possible Responses */}
        {possibleResponses && possibleResponses.length > 0 && (
          <div className="p-4 flex flex-wrap gap-2">
            {possibleResponses.map((response) => (
              <Button
                key={response.optionIndex}
                type="submit"
                data-response-id={response.optionIndex}
                variant="outline"
                className="bg-[#202C33] hover:bg-[#2A3942] text-white border-gray-700"
                onClick={handleSendMessage}
              >
                {response.text}
              </Button>
            ))}
          </div>
        )}
        <form onSubmit={handleSendMessage} className="p-4 bg-[#202C33] flex items-center gap-4">
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder={possibleResponses.length > 0 ? "Choose a response above or type a message" : "Waiting for response options..."}
            className="bg-[#2A3942] border-0 text-gray-100 placeholder:text-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
            disabled={false}
          />
          <Button type="submit" variant="ghost" size="icon" className="text-gray-400">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="currentColor" />
              </svg>
          </Button>
        </form>
      </div>

      {/* Media Viewer Modal */}
      {selectedMedia && (
        <MediaViewer
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </div>
  );
};

/* Add typing indicator animation styles */
const styles = `
  .dot-typing {
    width: 4px;
    height: 4px;
    background-color: #8B98A5;
    border-radius: 50%;
    display: inline-block;
    margin: 0 2px;
    animation: dotTyping 1.5s infinite ease-in-out;
  }

  .animation-delay-200 {
    animation-delay: 0.2s;
  }

  .animation-delay-400 {
    animation-delay: 0.4s;
  }

  @keyframes dotTyping {
    0% { transform: scale(0); opacity: 0.5; }
    50% { transform: scale(1); opacity: 1; }
    100% { transform: scale(0); opacity: 0.5; }
  }
`;

// Add the styles to the head
if (typeof document !== 'undefined') {
  const styleEl = document.createElement('style');
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);
}

export default ChatArea; 