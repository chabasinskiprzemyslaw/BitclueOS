import React, { useState } from 'react';
import { Check, CheckCheck, Clock, Image as ImageIcon, Video } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { Avatar } from '../../../../components/ui/avatar';
import { MESSAGE_TYPES } from './constants';
import { MediaViewer } from '../../../../components/MediaViewer';

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
 * @param {Array} props.attachments - Array of attachment objects
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
  onResponseClick,
  attachments = []
}) => {
  const [showMediaViewer, setShowMediaViewer] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState(null);

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

  // Render media content
  const renderMediaContent = () => {
    if (!attachments || attachments.length === 0) return null;

    return (
      <div className="grid gap-2">
        {attachments.map((attachment) => {
          const isImage = attachment.contentType.startsWith('image/');
          const isVideo = attachment.contentType.startsWith('video/');

          if (!isImage && !isVideo) return null;

          return (
            <div 
              key={attachment.id}
              className={cn(
                "relative cursor-pointer rounded-lg overflow-hidden",
                sent ? "ml-auto" : "mr-auto"
              )}
              onClick={() => {
                setSelectedAttachment(attachment);
                setShowMediaViewer(true);
              }}
            >
              {isImage ? (
                <img 
                  src={attachment.fileUrl} 
                  alt={attachment.fileName} 
                  className="max-w-full h-auto"
                />
              ) : (
                <video 
                  src={attachment.fileUrl} 
                  className="max-w-full h-auto"
                  poster={attachment.thumbnail}
                />
              )}
              <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                {isImage ? (
                  <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100" />
                ) : (
                  <Video className="w-8 h-8 text-white opacity-0 group-hover:opacity-100" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
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
            {renderMediaContent()}
            {text && <div className="mt-2">{text}</div>}
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

      {/* Media Viewer Modal */}
      {showMediaViewer && selectedAttachment && (
        <MediaViewer
          fileView={{
            type: selectedAttachment.contentType.startsWith('image/') ? 'image' : 'video',
            url: selectedAttachment.fileUrl,
            name: selectedAttachment.fileName
          }}
          fileData={{
            name: selectedAttachment.fileName,
            type: selectedAttachment.contentType,
            info: {
              size: formatFileSize(selectedAttachment.fileSize),
              dateCreated: new Date().toLocaleString(),
              dateModified: new Date().toLocaleString()
            }
          }}
          onClose={() => {
            setShowMediaViewer(false);
            setSelectedAttachment(null);
          }}
        />
      )}
    </>
  );
};

export default Message; 