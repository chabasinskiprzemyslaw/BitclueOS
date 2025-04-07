import { useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

// Constants
const HUB_URL = "https://localhost:5001/hubs/objective";
const CONNECTION_STATUS = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  RECONNECTING: 'reconnecting',
  ERROR: 'error'
};

// Debug mode flag
const OBJECTIVE_DEBUG_MODE = true;

/**
 * Helper function for objective-specific debug logging
 */
const objectiveDebugLog = (message, data) => {
  if (OBJECTIVE_DEBUG_MODE) {
    if (data) {
      console.log(`[Objective SignalR] ${message}`, data);
    } else {
      console.log(`[Objective SignalR] ${message}`);
    }
  }
};

/**
 * Custom hook for managing a SignalR connection for objective notifications
 * 
 * @param {Object} params - Parameters for the hook
 * @param {boolean} params.isAuthenticated - Whether the user is authenticated
 * @param {string} params.userIdentityId - User's identity ID
 * @param {Function} params.setConnectionStatus - Function to set connection status
 * @param {Function} params.onNewObjective - Callback function when a new objective is received
 * @returns {Object} SignalR connection reference
 */
const useObjectiveSignalR = ({
  isAuthenticated,
  userIdentityId,
  setConnectionStatus,
  onNewObjective
}) => {
  // Connection reference
  const hubConnectionRef = useRef(null);
  
  // Static connection flag to prevent multiple connections across re-renders
  const hasInitializedRef = useRef(false);

  // Initialize SignalR connection
  useEffect(() => {
    // Only create a connection if authenticated and no connection exists
    if (isAuthenticated && userIdentityId && !hubConnectionRef.current && !hasInitializedRef.current) {
      objectiveDebugLog("Starting SignalR connection initialization");
      hasInitializedRef.current = true;
      
      const createHubConnection = async () => {
        try {
          objectiveDebugLog("Initializing SignalR connection");
          setConnectionStatus(CONNECTION_STATUS.CONNECTING);
          
          // Check if we already have a connection (race condition check)
          if (hubConnectionRef.current) {
            objectiveDebugLog("Connection already exists, skipping initialization");
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
            objectiveDebugLog("Attempting to reconnect to SignalR hub...");
            setConnectionStatus(CONNECTION_STATUS.RECONNECTING);
          });
          
          connection.onreconnected(() => {
            objectiveDebugLog("Reconnected to SignalR hub");
            setConnectionStatus(CONNECTION_STATUS.CONNECTED);
            
            // Rejoin the user's objective group after reconnection
            if (userIdentityId) {
              objectiveDebugLog(`Rejoining user objective group for user ${userIdentityId}`);
              connection.invoke("JoinUserObjectiveGroup", userIdentityId)
                .catch(err => console.error(`Error rejoining user objective group:`, err));
            }
          });
          
          connection.onclose(() => {
            objectiveDebugLog("Disconnected from SignalR hub");
            setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
            hubConnectionRef.current = null;
          });
          
          // Set up objective notification handler
          connection.on("ObjectiveReceived", (objective) => {
            if (!objective) {
              objectiveDebugLog("Received empty objective notification, ignoring");
              return;
            }
            
            objectiveDebugLog("Received real-time objective update:", objective);
            
            // Call the onNewObjective callback with the received objective
            if (onNewObjective && typeof onNewObjective === 'function') {
              onNewObjective(objective);
            }
          });
          
          // Start the connection
          await connection.start();
          objectiveDebugLog("SignalR connection established successfully");
          setConnectionStatus(CONNECTION_STATUS.CONNECTED);
          
          // Join the user's objective notification group
          if (userIdentityId) {
            objectiveDebugLog(`Joining user objective group for user ${userIdentityId}`);
            await connection.invoke("JoinUserObjectiveGroup", userIdentityId);
          }
          
        } catch (error) {
          objectiveDebugLog("Error establishing SignalR connection:", error);
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
        objectiveDebugLog("Stopping SignalR connection");
        
        // Try to leave the user's objective group before disconnecting
        if (userIdentityId) {
          hubConnectionRef.current.invoke("LeaveUserObjectiveGroup", userIdentityId)
            .catch(err => console.error("Error leaving user objective group:", err));
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

export { useObjectiveSignalR, CONNECTION_STATUS }; 