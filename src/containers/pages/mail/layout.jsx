"use client"

import { useState, useEffect, useRef } from "react"
import { Menu, Search, Settings, HelpCircle, Grid, Mail, Lock, Bell, BellOff, Bug } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Sidebar } from "./sidebar"
import { EmailList } from "./email-list"
import { EmailView } from "./email-view"
import { ComposeEmail } from "./compose-email"
import { EmailDebugTools } from "./debug-tools"
// Import SignalR
import * as signalR from "@microsoft/signalr"
// Import our custom SignalR hook
import { useEmailSignalR, CONNECTION_STATUS } from "./useEmailSignalR"

// Debug mode flag - set to true to enable debug logging
const EMAIL_DEBUG_MODE = true;

/**
 * Helper function for email-specific debug logging
 * @param {string} message - The message to log
 * @param {any} data - Optional data to log
 */
const emailDebugLog = (message, data) => {
  if (EMAIL_DEBUG_MODE) {
    if (data) {
      console.log(`[Email Debug] ${message}`, data);
    } else {
      console.log(`[Email Debug] ${message}`);
    }
  }
};

// Login Screen Component
const LoginScreen = ({ onLogin }) => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    emailDebugLog("Login attempt", { emailAddress });

    try {
      // Get the auth token from localStorage (set by the game system)
      const token = localStorage.getItem("auth_token");
      const userInfo = JSON.parse(localStorage.getItem("user_info"));
      const selectedScenario = localStorage.getItem("selected_scenario");

      if (!token) {
        throw new Error("Authentication token not found. Please restart the game.");
      }

      emailDebugLog("Making login request");
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/emails/accounts/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ EmailAddress: emailAddress, Password: password, UserIdentityId: userInfo.id, ScenarioId: selectedScenario }),
      });

      if (!response.ok) {
        emailDebugLog("Login failed", { status: response.status });
        throw new Error("Login failed. Please check your credentials.");
      }

      const data = await response.json();
      emailDebugLog("Login successful", { accountId: data.emailAccountId });
      
      // Store the email account ID
      localStorage.setItem("email_account_id", data.emailAccountId);
      
      // Call the onLogin callback with the account info
      onLogin(data.emailAccountId, emailAddress);
    } catch (error) {
      emailDebugLog("Login error", { error: error.message });
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return <ForgotPasswordScreen onCancel={() => setShowForgotPassword(false)} />;
  }

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black">Sign in</h2>
          <p className="mt-2 text-gray-600">to continue to SecMail</p>
        </div>
        
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pl-10 bg-gray-50 text-gray-800"
                  placeholder="Email address"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="pl-10 bg-gray-50 text-gray-800"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">

            <div className="text-sm">
              <a href="#" onClick={(e) => {
                e.preventDefault();
                setShowForgotPassword(true);
              }} className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Forgot Password Screen Component
const ForgotPasswordScreen = ({ onCancel }) => {
  const [emailAddress, setEmailAddress] = useState("alex.freeman.priv@hiddentruth.com");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [activeTab, setActiveTab] = useState("security"); // "security" or "support"

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setIsError(false);

    try {
      // Simulating password reset request
      emailDebugLog("Password reset attempt", { emailAddress, method: activeTab });

      // For simulation purposes, we'll just show a success message
      setTimeout(() => {
        if (activeTab === "security") {
          setMessage("If this email exists in our system, password reset instructions will be sent to it.");
        } else {
          setMessage("Our support team will contact you shortly in connected chat account AF_INSIDER");
        }
        setIsLoading(false);
      }, 1500);

    } catch (error) {
      emailDebugLog("Password reset error", { error: error.message });
      setMessage(error.message);
      setIsError(true);
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-black">Forgot Password</h2>
          <p className="mt-2 text-gray-600">Recover access to your account</p>
        </div>
        
        {message && (
          <div className={`p-3 ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} rounded-md text-sm`}>
            {message}
          </div>
        )}
        
        {/* Tab navigation */}
        <div className="flex border-b">
          <button
            className={`py-2 px-4 text-sm font-medium ${activeTab === 'security' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('security')}
          >
            Security Question
          </button>
          <button
            className={`py-2 px-4 text-sm font-medium ${activeTab === 'support' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('support')}
          >
            Contact Support
          </button>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="reset-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="pl-10 bg-gray-50 text-gray-800"
                  placeholder="Email address"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Enter the email address associated with your account
              </p>
            </div>
            
            {activeTab === "security" ? (
              <div>
                <label htmlFor="security-question" className="block text-sm font-medium text-gray-700 mb-1">
                  Security Question
                </label>
                <p className="text-sm text-gray-600 mb-2">
                  What was the name of your first pet?
                </p>
                <Input
                  id="security-question"
                  name="security-answer"
                  type="text"
                  required
                  className="bg-gray-50 text-gray-800"
                  placeholder="Your answer"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Support Request
                </label>
                <p className="text-sm text-gray-600 mb-2">
                  Our support team is available 24/7 to help you recover your account.
                  Click below to initiate a chat with our support team.
                </p>
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            <Button
              type="button"
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={onCancel}
            >
              Back to Login
            </Button>
            <Button
              type="submit"
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : activeTab === "security" ? "Reset Password" : "Contact Support"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper function to make authenticated API requests
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = localStorage.getItem("auth_token");
  
  if (!token) {
    emailDebugLog("Auth token not found in makeAuthenticatedRequest");
    throw new Error("Authentication token not found");
  }
  
  const headers = {
    ...options.headers,
    "Authorization": `Bearer ${token}`
  };
  
  emailDebugLog(`Making authenticated request to ${url}`, { method: options.method || 'GET' });
  
  return fetch(url, {
    ...options,
    headers
  });
};

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("primary");
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isComposing, setIsComposing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailAccountId, setEmailAccountId] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [emails, setEmails] = useState([]);
  const [isLoadingEmails, setIsLoadingEmails] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [currentFolder, setCurrentFolder] = useState("Inbox");
  const [accountProfile, setAccountProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(CONNECTION_STATUS.DISCONNECTED);
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  // Track if we've received a notification recently for visual feedback
  const [newEmailNotification, setNewEmailNotification] = useState(false);
  const notificationTimeoutRef = useRef(null);
  const [showDebugTools, setShowDebugTools] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);

  // Initialize SignalR connection using our custom hook
  const hubConnectionRef = useEmailSignalR({
    isAuthenticated,
    token: localStorage.getItem("auth_token"),
    emailAccountId,
    setConnectionStatus,
    onNewEmail: (email) => {
      if (!realTimeEnabled) return;
      
      emailDebugLog("Received new email notification", email);
      
      // Check if this email belongs to the current folder (usually Inbox for new emails)
      if (email.folderName && email.folderName.toLowerCase() === currentFolder.toLowerCase()) {
        // Add the new email to the emails list without refetching
        setEmails(prevEmails => {
          // Check if email already exists to prevent duplicates
          const emailExists = prevEmails.some(existingEmail => existingEmail.id === email.id);
          if (emailExists) {
            return prevEmails;
          }
          
          // Add the new email to the top of the list
          return [email, ...prevEmails];
        });
      }
      
      // Show notification indicator
      setNewEmailNotification(true);
      
      // Clear any existing timeout
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
      
      // Hide notification indicator after 3 seconds
      notificationTimeoutRef.current = setTimeout(() => {
        setNewEmailNotification(false);
      }, 3000);
    }
  });

  // Register global callback for debug tools
  useEffect(() => {
    // Only register in authenticated state
    if (isAuthenticated) {
      // Create a global callback function that debug tools can access
      window.emailNotificationCallback = (email) => {
        if (hubConnectionRef.current) {
          // Simulate a real-time email notification
          emailDebugLog("Simulating email notification via debug tools", email);
          
          // Call our onNewEmail handler directly
          if (realTimeEnabled) {
            // Check if this email belongs to the current folder (usually Inbox for new emails)
            if (email.folderName && email.folderName.toLowerCase() === currentFolder.toLowerCase()) {
              // Add the new email to the emails list without refetching
              setEmails(prevEmails => {
                // Check if email already exists to prevent duplicates
                const emailExists = prevEmails.some(existingEmail => existingEmail.id === email.id);
                if (emailExists) {
                  return prevEmails;
                }
                
                // Add the new email to the top of the list
                return [email, ...prevEmails];
              });
            }
            
            // Show notification indicator
            setNewEmailNotification(true);
            
            // Clear any existing timeout
            if (notificationTimeoutRef.current) {
              clearTimeout(notificationTimeoutRef.current);
            }
            
            // Hide notification indicator after 3 seconds
            notificationTimeoutRef.current = setTimeout(() => {
              setNewEmailNotification(false);
            }, 3000);
          }
        }
      };
    }
    
    // Cleanup the global callback on unmount or deauthentication
    return () => {
      window.emailNotificationCallback = null;
    };
  }, [isAuthenticated, realTimeEnabled, currentFolder]);

  // Check if we're in development mode
  useEffect(() => {
    // Check if we're in development mode
    const isDev = process.env.NODE_ENV === 'development' || 
                 window.location.hostname === 'localhost' ||
                 window.location.hostname === '127.0.0.1';
    setIsDevMode(isDev);
  }, []);

  // Check if user is already authenticated on component mount
  useEffect(() => {
    emailDebugLog("Layout component mounted, checking authentication");
    const token = localStorage.getItem("auth_token");
    const storedAccountId = localStorage.getItem("email_account_id");
    
    if (token && storedAccountId) {
      emailDebugLog("Found existing authentication", { accountId: storedAccountId });
      setIsAuthenticated(true);
      setEmailAccountId(storedAccountId);
      setUserEmail(storedAccountId.includes('@') ? storedAccountId : '');
      
      // Fetch account profile
      fetchAccountProfile(storedAccountId);
      
      // Fetch emails if we have an account ID
      fetchEmails(storedAccountId, null, "Inbox");
    } else {
      emailDebugLog("No existing authentication found");
    }
  }, []);

  // Fetch account profile from the backend
  const fetchAccountProfile = async (accountId) => {
    if (!accountId) {
      emailDebugLog("fetchAccountProfile called without accountId");
      return;
    }
    
    emailDebugLog("Fetching account profile", { accountId });
    setIsLoadingProfile(true);
    
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/emails/accounts/${accountId}/profile`;
      emailDebugLog("Fetching profile with URL", { url });
      
      const response = await makeAuthenticatedRequest(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        emailDebugLog("Failed to fetch profile", { status: response.status });
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      const data = await response.json();
      emailDebugLog("Profile fetched successfully", { profile: data });
      
      setAccountProfile(data);
      
      // Update email address if it's available in the profile
      if (data.emailAddress) {
        setUserEmail(data.emailAddress);
      }
      
    } catch (error) {
      emailDebugLog("Error fetching profile", { error: error.message });
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Fetch emails from the backend
  const fetchEmails = async (accountId, folderId = null, folderName = "Inbox") => {
    if (!accountId) {
      emailDebugLog("fetchEmails called without accountId");
      return;
    }
    
    emailDebugLog("Fetching emails", { accountId, folderId, folderName });
    setIsLoadingEmails(true);
    setEmailError("");
    setCurrentFolder(folderName);

    const userInfo = JSON.parse(localStorage.getItem("user_info"));
    const selectedScenario = localStorage.getItem("selected_scenario");
    
    try {
      const url = `${import.meta.env.VITE_API_BASE_URL}/emails/${accountId}/messages/folder/${folderName}`;
      emailDebugLog("Fetching emails with URL", { url });
      
      const response = await makeAuthenticatedRequest(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ UserIdentityId: userInfo.id, ScenarioId: selectedScenario }),
      });

      if (!response.ok) {
        emailDebugLog("Failed to fetch emails", { status: response.status });
        throw new Error(`Failed to fetch emails: ${response.statusText}`);
      }

      const data = await response.json();
      emailDebugLog("Emails fetched successfully", { count: data.length });
      setEmails(data);
    } catch (error) {
      emailDebugLog("Error fetching emails", { error: error.message });
      console.error("Error fetching emails:", error);
      setEmailError("Failed to load emails. Please try again later.");
    } finally {
      setIsLoadingEmails(false);
    }
  };

  const handleLogin = (accountId, email) => {
    emailDebugLog("User logged in", { accountId, email });
    setIsAuthenticated(true);
    setEmailAccountId(accountId);
    setUserEmail(email);
    
    // Fetch account profile after successful login
    fetchAccountProfile(accountId);
    
    // Fetch emails after successful login
    fetchEmails(accountId, null, "Inbox");
  };

  const handleLogout = () => {
    emailDebugLog("User logging out", { accountId: emailAccountId });
    // Only remove email_account_id, not auth_token since that's for the game system
    localStorage.removeItem("email_account_id");
    setIsAuthenticated(false);
    setEmailAccountId(null);
    setUserEmail("");
    setEmails([]);
    setAccountProfile(null);
  };

  const handleFolderChange = (folderName, folderId = null) => {
    emailDebugLog("Folder changed", { folderName, folderId });
    fetchEmails(emailAccountId, folderId, folderName);
  };

  const handleEmailSelect = (email) => {
    emailDebugLog("Email selected", { emailId: email.id });
    setSelectedEmail(email);
  };

  // Clear notification timeout on unmount
  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  // Toggle real-time notifications
  const toggleRealTime = () => {
    setRealTimeEnabled(prev => !prev);
    emailDebugLog(`Real-time notifications ${!realTimeEnabled ? 'enabled' : 'disabled'}`);
  };

  // If not authenticated, show login screen
  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // Otherwise, show the email interface
  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="flex items-center px-4 py-2 border-b">
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="mr-2">
          <Menu className="h-5 w-5" />
        </Button>
        <img
          src="https://www.google.com/gmail/about/static-2.0/images/logo-gmail.png?fingerprint=c2eaf4aae389c3f885e97081bb197b97"
          alt="Gmail"
          className="h-8 mr-4"
        />
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search mail" className="pl-10 bg-secondary text-gray-800" />
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          {/* Real-time toggle button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleRealTime} 
            title={realTimeEnabled ? "Disable real-time notifications" : "Enable real-time notifications"}
            className={newEmailNotification ? "animate-pulse" : ""}
          >
            {realTimeEnabled ? (
              <Bell className={`h-5 w-5 ${newEmailNotification ? "text-green-500" : ""}`} />
            ) : (
              <BellOff className="h-5 w-5" />
            )}
          </Button>
          {/* Debug tools button (only in dev mode) */}
          {isDevMode && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDebugTools(!showDebugTools)}
              title="Debug Tools"
            >
              <Bug className={`h-5 w-5 ${showDebugTools ? "text-yellow-500" : ""}`} />
            </Button>
          )}
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Grid className="h-5 w-5" />
          </Button>
          <div className="ml-2 flex items-center">
            <span className="text-sm mr-2">{userEmail}</span>
            {/* Connection status indicator */}
            {connectionStatus === CONNECTION_STATUS.CONNECTED && realTimeEnabled && (
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2" title="Connected for real-time notifications"></span>
            )}
            {connectionStatus === CONNECTION_STATUS.RECONNECTING && realTimeEnabled && (
              <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse" title="Reconnecting..."></span>
            )}
            {connectionStatus === CONNECTION_STATUS.ERROR && realTimeEnabled && (
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2" title="Connection error"></span>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Sign out
            </Button>
          </div>
        </div>
      </header>
      {/* Display connection status message if there's an issue */}
      {realTimeEnabled && (connectionStatus === CONNECTION_STATUS.RECONNECTING || connectionStatus === CONNECTION_STATUS.ERROR) && (
        <div className={`px-4 py-1 text-xs text-center ${connectionStatus === CONNECTION_STATUS.ERROR ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {connectionStatus === CONNECTION_STATUS.RECONNECTING ? 'Reconnecting to email server...' : 'Connection issue with email server. Some features may be unavailable.'}
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isCollapsed={isCollapsed} 
          onCompose={() => setIsComposing(true)} 
          onFolderSelect={handleFolderChange}
          currentFolder={currentFolder}
          folders={accountProfile?.folders || []}
          isLoading={isLoadingProfile}
        />
        {selectedEmail ? (
          <EmailView 
            email={selectedEmail} 
            onClose={() => {
              setSelectedEmail(null);
              // Refresh emails list to update read status
              fetchEmails(emailAccountId, null, currentFolder);
            }} 
          />
        ) : (
          <EmailList 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onEmailSelect={handleEmailSelect} 
            emailAccountId={emailAccountId}
            makeAuthenticatedRequest={makeAuthenticatedRequest}
            emails={emails}
            isLoading={isLoadingEmails}
            error={emailError}
            currentFolder={currentFolder}
            newEmailNotification={newEmailNotification}
          />
        )}
      </div>
      {isComposing && (
        <ComposeEmail 
          onClose={() => setIsComposing(false)} 
          emailAccountId={emailAccountId}
          makeAuthenticatedRequest={makeAuthenticatedRequest}
          onEmailSent={() => fetchEmails(emailAccountId, null, currentFolder)}
        />
      )}

      {/* Debug tools */}
      {showDebugTools && isDevMode && (
        <EmailDebugTools 
          emailAccountId={emailAccountId}
          hubConnection={hubConnectionRef}
          onClose={() => setShowDebugTools(false)}
        />
      )}
    </div>
  )
}

