import React from 'react';
import { Avatar } from '../../../../components/ui/avatar';

/**
 * TypingIndicator component to show when users are typing
 * 
 * @param {Object} props - Component props
 * @param {Array} props.typingUsers - Array of users who are currently typing
 * @returns {JSX.Element} TypingIndicator component
 */
const TypingIndicator = ({ typingUsers = [] }) => {
  if (!typingUsers || typingUsers.length === 0) {
    return null;
  }

  // Get the first typing user for the avatar
  const firstUser = typingUsers[0];
  
  // Create the typing message text
  const getTypingText = () => {
    if (typingUsers.length === 1) {
      return `${firstUser.name} is typing...`;
    } else if (typingUsers.length === 2) {
      return `${firstUser.name} and ${typingUsers[1].name} are typing...`;
    } else {
      return `${firstUser.name} and ${typingUsers.length - 1} others are typing...`;
    }
  };

  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="flex-shrink-0">
        <Avatar className="h-8 w-8">
          <img 
            src={firstUser.avatar || "/placeholder.svg"} 
            alt={firstUser.name} 
          />
        </Avatar>
      </div>
      <div className="bg-secondary px-4 py-2 rounded-lg rounded-tl-none flex items-center">
        <div className="flex space-x-1">
          <div className="h-2 w-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="h-2 w-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="h-2 w-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <span className="text-xs text-muted-foreground ml-2">{getTypingText()}</span>
      </div>
    </div>
  );
};

export default TypingIndicator; 