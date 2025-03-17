"use client"

import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { cn } from "../../../lib/utils";
import { Loader2 } from "lucide-react";

export function EmailList({ 
  activeTab, 
  setActiveTab, 
  onEmailSelect, 
  emails = [], 
  isLoading = false, 
  error = null,
  currentFolder
}) {
  // Filter emails by category if we're using tabs
  const filteredEmails = activeTab ? emails.filter(email => email.category === activeTab) : emails;

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
      {activeTab && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0">
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
      <div className="overflow-auto flex-1">
        {filteredEmails.map((email) => (
          <div
            key={email.id}
            onClick={() => onEmailSelect(email)}
            className={cn(
              "flex items-center gap-4 px-4 py-2 hover:bg-secondary/50 cursor-pointer",
              !email.isRead && "font-medium",
            )}
          >
            <input type="checkbox" className="h-4 w-4" onClick={(e) => e.stopPropagation()} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate">{email.senderName}</span>
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

