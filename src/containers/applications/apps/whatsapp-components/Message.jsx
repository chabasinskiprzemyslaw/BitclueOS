import React from 'react';
import { Check, CheckCheck, Clock } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { Avatar } from '../../../../components/ui/avatar';
import { MESSAGE_TYPES } from './constants';

/**
 * Message component for displaying individual chat messages
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Message ID
 * @param {string} props.text - Message content
 * @param {boolean} props.sent - Whether the message was sent by the current user
 * @param {string} props.time - Formatted time string
 * @param {string} props.senderName - Name of the message sender
 * @param {string} props.status - Message status (sent, delivered, read, pending)
 * @param {string} props.type - Message type (text, image, file, system)
 * @param {string} props.avatarUrl - URL for the sender's avatar
 * @param {Array} props.possibleResponses - Array of possible responses to this message
 * @param {Function} props.onResponseClick - Function to handle clicking a response option
 * @returns {JSX.Element} Message component
 */
const Message = ({
  id,
  text,
  sent = false,
  time,
  senderName,
  status = 'read',
  type = MESSAGE_TYPES.TEXT,
  avatarUrl,
  possibleResponses = [],
  onResponseClick
}) => {
  // Determine message status icon
  const getStatusIcon = () => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3 text-muted-foreground" />;
      case 'sent':
        return <Check className="h-3 w-3 text-muted-foreground" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  // Handle system messages differently
  if (type === MESSAGE_TYPES.SYSTEM) {
    return (
      <div className="flex justify-center my-2">
        <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
          {text}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-2 mb-2",
        sent ? "justify-end" : "justify-start"
      )}
    >
      {/* Show avatar only for received messages */}
      {!sent && (
        <div className="flex-shrink-0 mt-1">
          <Avatar className="h-8 w-8">
            <img src={avatarUrl || "/placeholder.svg"} alt={senderName} />
          </Avatar>
        </div>
      )}

      <div className={cn("flex flex-col max-w-[75%]", sent && "items-end")}>
        {/* Show sender name for received messages */}
        {!sent && senderName && (
          <span className="text-xs font-medium text-primary mb-1">
            {senderName}
          </span>
        )}

        {/* Message bubble */}
        <div
          className={cn(
            "px-3 py-2 rounded-lg",
            sent
              ? "bg-primary text-primary-foreground rounded-tr-none"
              : "bg-secondary text-secondary-foreground rounded-tl-none"
          )}
        >
          {text}
          <div className="flex justify-end items-center gap-1 -mb-1 mt-1">
            <span className="text-[10px] opacity-70">{time}</span>
            {sent && getStatusIcon()}
          </div>
        </div>

        {/* Possible responses */}
        {possibleResponses && possibleResponses.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {possibleResponses.map((response) => (
              <button
                key={response.id || response.text}
                onClick={() => onResponseClick && onResponseClick(response)}
                className="bg-secondary hover:bg-secondary/80 text-secondary-foreground text-sm px-3 py-1 rounded-full transition-colors"
              >
                {response.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message; 