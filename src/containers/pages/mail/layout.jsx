"use client"

import { useState, useEffect } from "react"
import { Menu, Search, Settings, HelpCircle, Grid, Mail, Lock } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Sidebar } from "./sidebar"
import { EmailList } from "./email-list"
import { EmailView } from "./email-view"
import { ComposeEmail } from "./compose-email"

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    emailDebugLog("Login attempt", { emailAddress });

    try {
      // Get the auth token from localStorage (set by the game system)
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        throw new Error("Authentication token not found. Please restart the game.");
      }

      emailDebugLog("Making login request");
      const response = await fetch("https://localhost:5001/emails/accounts/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ EmailAddress: emailAddress, Password: password }),
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

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <img
            src="https://www.google.com/gmail/about/static-2.0/images/logo-gmail.png?fingerprint=c2eaf4aae389c3f885e97081bb197b97"
            alt="Gmail"
            className="h-10 mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold">Sign in</h2>
          <p className="mt-2 text-gray-600">to continue to Gmail</p>
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
                  className="pl-10"
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
                  className="pl-10"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
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
      const url = `https://localhost:5001/emails/accounts/${accountId}/profile`;
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
    
    try {
      const url = `https://localhost:5001/emails/${accountId}/messages/folder/${folderName}`;
      emailDebugLog("Fetching emails with URL", { url });
      
      const response = await makeAuthenticatedRequest(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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
            <Input placeholder="Search mail" className="pl-10 bg-secondary" />
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
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
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Sign out
            </Button>
          </div>
        </div>
      </header>
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
            onClose={() => setSelectedEmail(null)} 
            emailAccountId={emailAccountId} 
            makeAuthenticatedRequest={makeAuthenticatedRequest}
          />
        ) : (
          <EmailList 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onEmailSelect={setSelectedEmail} 
            emailAccountId={emailAccountId}
            makeAuthenticatedRequest={makeAuthenticatedRequest}
            emails={emails}
            isLoading={isLoadingEmails}
            error={emailError}
            currentFolder={currentFolder}
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
    </div>
  )
}

