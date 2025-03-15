import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from './utils';
import { TYPING_DEBOUNCE_DELAY, TYPING_INDICATOR_TIMEOUT } from './constants';

/**
 * Custom hook for managing typing indicators
 * 
 * @param {Object} params - Hook parameters
 * @param {Object} params.hubConnectionRef - Reference to the SignalR hub connection
 * @param {Object} params.activeChat - The active chat
 * @returns {Object} Typing indicator state and functions
 */
const useTypingIndicator = ({ hubConnectionRef, activeChat }) => {
  // State for tracking users who are typing
  const [typingUsers, setTypingUsers] = useState([]);
  
  // Ref to store timeouts for removing typing indicators
  const typingTimeoutsRef = useRef({});
  
  // Clear typing indicator for a user after a timeout
  const clearTypingIndicator = useCallback((userId) => {
    setTypingUsers(prev => prev.filter(user => user.id !== userId));
    
    // Clear the timeout reference
    if (typingTimeoutsRef.current[userId]) {
      delete typingTimeoutsRef.current[userId];
    }
  }, []);
  
  // Handle user typing event
  const handleUserTyping = useCallback((user, chatId) => {
    // Only update if it's for the active chat
    if (activeChat && activeChat.id && activeChat.id.toString() === chatId.toString()) {
      // Check if user is already in the typing list
      setTypingUsers(prev => {
        const existingUserIndex = prev.findIndex(u => u.id === user.id);
        
        if (existingUserIndex >= 0) {
          // User is already in the list, just return the current state
          return prev;
        } else {
          // Add the user to the typing list
          return [...prev, { 
            id: user.id, 
            name: user.displayName || 'Someone', 
            avatar: user.avatar 
          }];
        }
      });
      
      // Clear any existing timeout for this user
      if (typingTimeoutsRef.current[user.id]) {
        clearTimeout(typingTimeoutsRef.current[user.id]);
      }
      
      // Set a timeout to remove the typing indicator after a delay
      typingTimeoutsRef.current[user.id] = setTimeout(() => {
        clearTypingIndicator(user.id);
      }, TYPING_INDICATOR_TIMEOUT);
    }
  }, [activeChat, clearTypingIndicator]);
  
  // Handle user stopped typing event
  const handleUserStoppedTyping = useCallback((user, chatId) => {
    // Only update if it's for the active chat
    if (activeChat && activeChat.id && activeChat.id.toString() === chatId.toString()) {
      clearTypingIndicator(user.id);
    }
  }, [activeChat, clearTypingIndicator]);
  
  // Set up event handlers when the connection or active chat changes
  useEffect(() => {
    const connection = hubConnectionRef?.current;
    
    if (connection) {
      // Register event handlers
      connection.on('UserTyping', handleUserTyping);
      connection.on('UserStoppedTyping', handleUserStoppedTyping);
      
      // Clean up event handlers when the component unmounts
      return () => {
        connection.off('UserTyping', handleUserTyping);
        connection.off('UserStoppedTyping', handleUserStoppedTyping);
        
        // Clear all typing timeouts
        Object.values(typingTimeoutsRef.current).forEach(timeout => {
          clearTimeout(timeout);
        });
        typingTimeoutsRef.current = {};
        
        // Clear typing users state
        setTypingUsers([]);
      };
    }
  }, [hubConnectionRef, handleUserTyping, handleUserStoppedTyping]);
  
  // Send typing indicator to the server
  const sendTypingIndicator = useCallback(
    debounce((isTyping) => {
      if (hubConnectionRef?.current && activeChat && activeChat.id) {
        try {
          if (isTyping) {
            hubConnectionRef.current.invoke('SendTypingIndicator', activeChat.id.toString());
          } else {
            hubConnectionRef.current.invoke('SendStoppedTypingIndicator', activeChat.id.toString());
          }
        } catch (err) {
          console.error('Error sending typing indicator:', err);
        }
      }
    }, TYPING_DEBOUNCE_DELAY),
    [hubConnectionRef, activeChat]
  );
  
  // Clear typing indicators when changing chats
  useEffect(() => {
    // Clear all typing indicators when the active chat changes
    setTypingUsers([]);
    
    // Clear all typing timeouts
    Object.values(typingTimeoutsRef.current).forEach(timeout => {
      clearTimeout(timeout);
    });
    typingTimeoutsRef.current = {};
  }, [activeChat?.id]);
  
  return {
    typingUsers,
    sendTypingIndicator
  };
};

export default useTypingIndicator; 