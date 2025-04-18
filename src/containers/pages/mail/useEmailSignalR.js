import { useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

// Constants
const HUB_URL = `${import.meta.env.VITE_API_BASE_URL}/hubs/email`;
const CONNECTION_STATUS = {
  DISCONNECTED: 'disconnected',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  RECONNECTING: 'reconnecting',
  ERROR: 'error'
};

// Debug mode flag
const EMAIL_DEBUG_MODE = true;

/**
 * Helper function for email-specific debug logging
 */
const emailDebugLog = (message, data) => {
  if (EMAIL_DEBUG_MODE) {
    if (data) {
      console.log(`[Email SignalR] ${message}`, data);
    } else {
      console.log(`[Email SignalR] ${message}`);
    }
  }
};

/**
 * Custom hook for managing a SignalR connection for email notifications
 * 
 * @param {Object} params - Parameters for the hook
 * @param {boolean} params.isAuthenticated - Whether the user is authenticated
 * @param {string} params.token - Authentication token
 * @param {string} params.emailAccountId - User's email account ID
 * @param {Function} params.setConnectionStatus - Function to set connection status
 * @param {Function} params.onNewEmail - Callback function when a new email is received
 * @returns {Object} SignalR connection reference
 */
const useEmailSignalR = ({
  isAuthenticated,
  token,
  emailAccountId,
  setConnectionStatus,
  onNewEmail
}) => {
  // Connection reference
  const hubConnectionRef = useRef(null);
  
  // Static connection flag to prevent multiple connections across re-renders
  const hasInitializedRef = useRef(false);

  // Initialize SignalR connection
  useEffect(() => {
    // Only create a connection if authenticated and no connection exists
    if (isAuthenticated && emailAccountId && !hubConnectionRef.current && !hasInitializedRef.current) {
      emailDebugLog("Starting SignalR connection initialization");
      hasInitializedRef.current = true;
      
      const createHubConnection = async () => {
        try {
          emailDebugLog("Initializing SignalR connection");
          setConnectionStatus(CONNECTION_STATUS.CONNECTING);
          
          // Check if we already have a connection (race condition check)
          if (hubConnectionRef.current) {
            emailDebugLog("Connection already exists, skipping initialization");
            return;
          }
          
          const currentToken = localStorage.getItem('auth_token') || token;
          
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
            emailDebugLog("Attempting to reconnect to SignalR hub...");
            setConnectionStatus(CONNECTION_STATUS.RECONNECTING);
          });
          
          connection.onreconnected(() => {
            emailDebugLog("Reconnected to SignalR hub");
            setConnectionStatus(CONNECTION_STATUS.CONNECTED);
            
            // Rejoin the email notification group after reconnection
            if (emailAccountId) {
              emailDebugLog(`Rejoining email notification group for account ${emailAccountId}`);
              connection.invoke("JoinEmailAccountGroup", emailAccountId)
                .catch(err => console.error(`Error rejoining email notification group:`, err));
            }
          });
          
          connection.onclose(() => {
            emailDebugLog("Disconnected from SignalR hub");
            setConnectionStatus(CONNECTION_STATUS.DISCONNECTED);
            hubConnectionRef.current = null;
          });
          
          // Set up email notification handler
          connection.on("ReceiveNewEmail", (email) => {
            if (!email) {
              emailDebugLog("Received empty email notification, ignoring");
              return;
            }
            
            emailDebugLog("Received real-time email notification:", email);
            
            // Call the onNewEmail callback with the received email
            if (onNewEmail && typeof onNewEmail === 'function') {
              onNewEmail(email);
            }
          });
          
          // Start the connection
          await connection.start();
          emailDebugLog("SignalR connection established successfully");
          setConnectionStatus(CONNECTION_STATUS.CONNECTED);
          
          // Join the email notification group for this account
          if (emailAccountId) {
            emailDebugLog(`Joining email notification group for account ${emailAccountId}`);
            await connection.invoke("JoinEmailAccountGroup", emailAccountId);
          }
          
        } catch (error) {
          emailDebugLog("Error establishing SignalR connection:", error);
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
        emailDebugLog("Stopping SignalR connection");
        
        // Try to leave the email notification group before disconnecting
        if (emailAccountId) {
          hubConnectionRef.current.invoke("LeaveEmailAccountGroup", emailAccountId)
            .catch(err => console.error("Error leaving email notification group:", err));
        }
        
        // Stop the connection
        hubConnectionRef.current.stop()
          .catch(err => console.error("Error stopping SignalR connection:", err));
          
        hubConnectionRef.current = null;
        hasInitializedRef.current = false;
      }
    };
  }, [isAuthenticated, emailAccountId]); // Only re-run when auth status or email ID changes

  return hubConnectionRef;
};

export { useEmailSignalR, CONNECTION_STATUS }; 