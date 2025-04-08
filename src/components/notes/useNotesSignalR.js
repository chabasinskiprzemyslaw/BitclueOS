import { useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

// Constants
const HUB_URL = "https://localhost:5001/hubs/notes";
const CONNECTION_STATUS = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  RECONNECTING: 'reconnecting',
  ERROR: 'error'
};

// Debug mode flag
const NOTES_DEBUG_MODE = true;

/**
 * Helper function for notes-specific debug logging
 */
const notesDebugLog = (message, data) => {
  if (NOTES_DEBUG_MODE) {
    if (data) {
      console.log(`[Notes SignalR] ${message}`, data);
    } else {
      console.log(`[Notes SignalR] ${message}`);
    }
  }
};

/**
 * Custom hook for managing a SignalR connection for notes notifications
 * 
 * @param {Object} params - Parameters for the hook
 * @param {boolean} params.isAuthenticated - Whether the user is authenticated
 * @param {string} params.userIdentityId - User's identity ID
 * @param {Function} params.setConnectionStatus - Function to set connection status
 * @param {Function} params.onNewNote - Callback function when a new note is received
 * @returns {Object} SignalR connection reference
 */
export const useNotesSignalR = ({
  isAuthenticated,
  userIdentityId,
  setConnectionStatus,
  onNewNote
}) => {
  // Connection reference
  const hubConnectionRef = useRef(null);
  
  // Static connection flag to prevent multiple connections across re-renders
  const hasInitializedRef = useRef(false);

  // Initialize SignalR connection
  useEffect(() => {
    // Only create a connection if authenticated and no connection exists
    if (isAuthenticated && userIdentityId && !hubConnectionRef.current && !hasInitializedRef.current) {
      notesDebugLog("Starting SignalR connection initialization");
      hasInitializedRef.current = true;
      
      const createHubConnection = async () => {
        try {
          notesDebugLog("Initializing SignalR connection");
          setConnectionStatus(CONNECTION_STATUS.CONNECTING);
          
          // Check if we already have a connection (race condition check)
          if (hubConnectionRef.current) {
            notesDebugLog("Connection already exists, skipping initialization");
            return;
          }
          
          const currentToken = localStorage.getItem('auth_token');
          
          // Create the connection
          const connection = new signalR.HubConnectionBuilder()
            .withUrl(HUB_URL, {
              accessTokenFactory: () => currentToken
            })
            .withAutomaticReconnect([
              0, 
              1000, 
              5000, 
              10000
            ])
            .configureLogging(signalR.LogLevel.Information)
            .build();
          
          // Store the connection in the ref immediately to prevent race conditions
          hubConnectionRef.current = connection;
          
          // Set up connection event handlers
          connection.onreconnecting(() => {
            notesDebugLog("Attempting to reconnect to SignalR hub...");
            setConnectionStatus(CONNECTION_STATUS.RECONNECTING);
          });
          
          connection.onreconnected(() => {
            notesDebugLog("Reconnected to SignalR hub");
            setConnectionStatus(CONNECTION_STATUS.CONNECTED);
            
            // Rejoin the user's notes group after reconnection
            if (userIdentityId) {
              notesDebugLog(`Rejoining user notes group for user ${userIdentityId}`);
              connection.invoke("JoinUserNotesGroup", userIdentityId)
                .catch(err => console.error(`Error rejoining user notes group:`, err));
            }
          });
          
          connection.onclose(() => {
            notesDebugLog("Disconnected from SignalR hub");
            setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
            hubConnectionRef.current = null;
          });
          
          // Set up notes notification handler
          connection.on("ReceiveObjective", (objective) => {
            if (!objective) {
              notesDebugLog("Received empty objective notification, ignoring");
              return;
            }
            
            notesDebugLog("Received real-time objective update:", objective);
            
            // Convert objective to note format
            const note = {
              id: objective.id,
              content: objective.description,
              sourceDescription: 'System Objective',
              timestamp: new Date().toISOString(),
              isNew: true
            };
            
            // Call the onNewNote callback with the received note
            if (onNewNote && typeof onNewNote === 'function') {
              onNewNote(note);
            }
          });
          
          // Start the connection
          await connection.start();
          notesDebugLog("SignalR connection established successfully");
          setConnectionStatus(CONNECTION_STATUS.CONNECTED);
          
          // Join the user's notes notification group
          if (userIdentityId) {
            notesDebugLog(`Joining user notes group for user ${userIdentityId}`);
            await connection.invoke("JoinUserNotesGroup", userIdentityId);
          }
          
        } catch (error) {
          notesDebugLog("Error establishing SignalR connection:", error);
          setConnectionStatus(CONNECTION_STATUS.ERROR);
          
          // Reset the initialization flag to allow future connection attempts
          hasInitializedRef.current = false;
          hubConnectionRef.current = null;
        }
      };
      
      // Create the hub connection
      createHubConnection();
    }
    
    // Clean up function to stop the connection when the component unmounts
    return () => {
      if (hubConnectionRef.current) {
        notesDebugLog("Stopping SignalR connection");
        
        // Try to leave the user's notes group before disconnecting
        if (userIdentityId) {
          hubConnectionRef.current.invoke("LeaveUserNotesGroup", userIdentityId)
            .catch(err => console.error("Error leaving user notes group:", err));
        }
        
        // Stop the connection
        hubConnectionRef.current.stop()
          .catch(err => console.error("Error stopping SignalR connection:", err));
          
        hubConnectionRef.current = null;
        hasInitializedRef.current = false;
      }
    };
  }, [isAuthenticated, userIdentityId]); // Only re-run when auth status or user ID changes

  return hubConnectionRef;
};

export { CONNECTION_STATUS };