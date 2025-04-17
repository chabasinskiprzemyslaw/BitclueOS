import { useCallback, useRef } from 'react';
import { getRandomDelay, calculateTypingDelay, debugLog } from './utils';
import { NPC_TYPING } from './constants';

/**
 * Custom hook for simulating NPC typing behavior
 * 
 * @param {Object} params - Hook parameters
 * @param {Function} params.setTypingUsers - Function to set typing users
 * @param {Function} params.addMessage - Function to add a message to the chat
 * @returns {Object} NPC typing simulation functions
 */
const useNpcTypingSimulation = ({ setTypingUsers, addMessage }) => {
  // Ref to store timeouts for typing simulation
  const typingTimeoutsRef = useRef({});
  
  // Clear all typing simulations
  const clearAllTypingSimulations = useCallback(() => {
    // Clear all timeouts
    Object.values(typingTimeoutsRef.current).forEach(timeout => {
      clearTimeout(timeout);
    });
    typingTimeoutsRef.current = {};
    
    // Clear typing indicators
    setTypingUsers([]);
  }, [setTypingUsers]);
  
  // Simulate NPC typing and then sending a message
  const simulateNpcTyping = useCallback((npc, message, delay = null) => {
    // Generate a unique ID for this simulation if not provided
    const simulationId = `${npc.id}-${Date.now()}`;
    
    // Clear any existing simulation for this NPC
    if (typingTimeoutsRef.current[npc.id]) {
      clearTimeout(typingTimeoutsRef.current[npc.id]);
    }
    
    // Calculate typing delay based on message length if not provided
    const typingDelay = delay || calculateTypingDelay(
      message, 
      NPC_TYPING.BASE_SPEED
    );
    
    debugLog(`Simulating typing for ${npc.displayName || 'NPC'} (${typingDelay}ms)`, { message });
    
    // Show typing indicator
    setTypingUsers(prev => {
      // Check if NPC is already in the typing list
      const existingIndex = prev.findIndex(u => u.id === npc.id);
      
      if (existingIndex >= 0) {
        // NPC is already typing, just return current state
        return prev;
      } else {
        // Add NPC to typing list
        return [...prev, {
          id: npc.id,
          name: npc.displayName || 'NPC',
          avatar: npc.avatar
        }];
      }
    });
    
    // Set timeout to send the message after typing delay
    typingTimeoutsRef.current[npc.id] = setTimeout(() => {
      // Remove typing indicator
      setTypingUsers(prev => prev.filter(u => u.id !== npc.id));
      
      // Add the message
      addMessage({
        id: `${npc.id}-${Date.now()}`,
        text: message,
        sent: false,
        time: new Date().toISOString(),
        senderName: npc.displayName || 'NPC',
        avatarUrl: npc.avatar
      });
      
      // Clear the timeout reference
      delete typingTimeoutsRef.current[npc.id];
    }, typingDelay);
    
    // Return the simulation ID for potential cancellation
    return simulationId;
  }, [setTypingUsers, addMessage]);
  
  // Simulate multiple NPCs typing in sequence
  const simulateSequentialNpcTyping = useCallback((messages, baseDelay = 1000) => {
    // Clear any existing simulations
    clearAllTypingSimulations();
    
    // Process each message in sequence
    let cumulativeDelay = 0;
    
    messages.forEach((item, index) => {
      const { npc, message, delay } = item;
      
      // Calculate typing delay based on message length if not provided
      const typingDelay = delay || calculateTypingDelay(
        message, 
        NPC_TYPING.BASE_SPEED
      );
      
      // Add a random delay between messages
      const betweenMessageDelay = index === 0 ? 0 : getRandomDelay(500, 2000);
      
      // Calculate when this message should start typing
      cumulativeDelay += betweenMessageDelay;
      
      // Schedule the typing simulation
      setTimeout(() => {
        simulateNpcTyping(npc, message, typingDelay);
      }, cumulativeDelay);
      
      // Add the typing delay to the cumulative delay
      cumulativeDelay += typingDelay;
    });
  }, [simulateNpcTyping, clearAllTypingSimulations]);
  
  return {
    simulateNpcTyping,
    simulateSequentialNpcTyping,
    clearAllTypingSimulations
  };
};

export default useNpcTypingSimulation; 