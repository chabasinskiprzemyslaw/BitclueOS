"use client"

import { useState, useEffect, useRef } from "react"
import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { cn } from "../../../lib/utils";
import { Loader2, Paperclip, RefreshCw } from "lucide-react";
import { Button } from "../../../components/ui/button"

export function EmailList({ 
  activeTab, 
  setActiveTab, 
  onEmailSelect, 
  emails = [], 
  isLoading = false, 
  error = null,
  currentFolder,
  newEmailNotification = false,
  makeAuthenticatedRequest,
  emailAccountId
}) {
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const listRef = useRef(null);

  // Filter emails by category if we're using tabs
  const filteredEmails = emails;

  // Handle email selection
  const handleEmailSelect = (email) => {
    if (onEmailSelect && email?.id) {
      onEmailSelect(email);
    }
  };

  // Handle manual refresh
  const handleRefresh = async () => {
    if (!emailAccountId || refreshing) return;
    
    setRefreshing(true);
    
    try {
      const userInfo = JSON.parse(localStorage.getItem("user_info"));
      const selectedScenario = localStorage.getItem("selected_scenario");
      
      const response = await makeAuthenticatedRequest(`https://localhost:5001/emails/${emailAccountId}/messages/folder/${currentFolder}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ UserIdentityId: userInfo.id, ScenarioId: selectedScenario }),
      });
      
      if (response.ok) {
        const data = await response.json();
        // We could update the emails here, but the parent component (Layout) is responsible for state management
        // This would be done via a callback, but for now, we'll just update the refresh time
        setLastRefreshed(new Date());
      }
    } catch (error) {
      console.error("Error refreshing emails:", error);
    } finally {
      setRefreshing(false);
    }
  };

  // Effect to handle new email notifications with scroll behavior
  useEffect(() => {
    if (newEmailNotification && listRef.current) {
      // Smooth scroll to top when new email arrives
      listRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [newEmailNotification]);

  // Format the "last refreshed" time
  const formatRefreshTime = () => {
    const now = new Date();
    const diff = now - lastRefreshed;
    
    // If less than a minute ago
    if (diff < 60000) {
      return 'just now';
    }
    
    // If less than an hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }
    
    // Otherwise show time
    return lastRefreshed.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="mt-2 text-sm text-muted-foreground">Loading emails...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md p-4">
          <p className="text-red-500 font-medium">Error loading emails</p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  // Render empty state
  if (!filteredEmails.length) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md p-4">
          <h3 className="font-medium text-lg">No emails found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {currentFolder === "Inbox" 
              ? "Your inbox is empty. When you receive emails, they'll appear here." 
              : `No emails in ${currentFolder}.`}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        {activeTab && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="justify-start rounded-none border-b-0 bg-transparent h-auto p-0">
              <TabsTrigger
                value="primary"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                Primary
              </TabsTrigger>
              <TabsTrigger
                value="promotions"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                Promotions
              </TabsTrigger>
              <TabsTrigger
                value="social"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                Social
              </TabsTrigger>
              <TabsTrigger
                value="updates"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
              >
                Updates
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">
            Last updated: {formatRefreshTime()}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh} 
            disabled={refreshing || isLoading}
            title="Refresh emails"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      <div className="overflow-auto flex-1" ref={listRef}>
        {newEmailNotification && (
          <div className="bg-green-50 text-green-700 px-4 py-2 text-sm font-medium border-b border-green-100 animate-pulse">
            New email received
          </div>
        )}
        {filteredEmails.map((email) => (
          <div
            key={email.id}
            onClick={() => handleEmailSelect(email)}
            className={cn(
              "flex items-center gap-4 px-4 py-2 hover:bg-secondary/50 cursor-pointer",
              !email.isRead && "font-medium bg-blue-50/50",
              email.isNew && "border-l-4 border-blue-500",
            )}
          >
            <input type="checkbox" className="h-4 w-4" onClick={(e) => e.stopPropagation()} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate">{email.senderName}</span>
                {email.attachments && email.attachments.length > 0 && (
                  <Paperclip className="h-3 w-3 text-muted-foreground" />
                )}
                <span className="text-sm text-muted-foreground ml-auto">
                  {formatDate(email.sentAt)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground truncate">
                {email.subject} - {email.preview || email.body?.substring(0, 50)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Helper function to format dates
function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  
  // Check if the date is today
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  // Check if the date is yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  
  // Check if the date is within the last 7 days
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7);
  if (date > oneWeekAgo) {
    return date.toLocaleDateString([], { weekday: 'long' });
  }
  
  // Otherwise, show the date
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

