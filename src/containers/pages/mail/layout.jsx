"use client"

import { useState, useEffect } from "react"
import { Menu, Search, Settings, HelpCircle, Grid, Mail, Lock } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Sidebar } from "./sidebar"
import { EmailList } from "./email-list"
import { EmailView } from "./email-view"
import { ComposeEmail } from "./compose-email"

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

    try {
      // Get the auth token from localStorage (set by the game system)
      const token = localStorage.getItem("auth_token");
      
      if (!token) {
        throw new Error("Authentication token not found. Please restart the game.");
      }

      const response = await fetch("https://localhost:5001/emails/accounts/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ EmailAddress: emailAddress, Password: password }),
      });

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const data = await response.json();
      
      // Store the email account ID
      localStorage.setItem("email_account_id", data.emailAccountId);
      
      // Call the onLogin callback with the account info
      onLogin(data.emailAccountId, emailAddress);
    } catch (error) {
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
    throw new Error("Authentication token not found");
  }
  
  const headers = {
    ...options.headers,
    "Authorization": `Bearer ${token}`
  };
  
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

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const storedAccountId = localStorage.getItem("email_account_id");
    
    if (token && storedAccountId) {
      setIsAuthenticated(true);
      setEmailAccountId(storedAccountId);
      setUserEmail(storedAccountId.includes('@') ? storedAccountId : '');
    }
  }, []);

  const handleLogin = (accountId, email) => {
    setIsAuthenticated(true);
    setEmailAccountId(accountId);
    setUserEmail(email);
  };

  const handleLogout = () => {
    // Only remove email_account_id, not auth_token since that's for the game system
    localStorage.removeItem("email_account_id");
    setIsAuthenticated(false);
    setEmailAccountId(null);
    setUserEmail("");
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
        <Sidebar isCollapsed={isCollapsed} onCompose={() => setIsComposing(true)} />
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
          />
        )}
      </div>
      {isComposing && (
        <ComposeEmail 
          onClose={() => setIsComposing(false)} 
          emailAccountId={emailAccountId}
          makeAuthenticatedRequest={makeAuthenticatedRequest}
        />
      )}
    </div>
  )
}

