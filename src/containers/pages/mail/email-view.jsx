"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Archive,
  Trash2,
  Mail,
  Clock,
  TagIcon as Label,
  MoreVertical,
  Reply,
  ReplyAll,
  Forward,
  Paperclip,
  Download,
  Loader2,
} from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Avatar } from "../../../components/ui/avatar"
import { Separator } from "../../../components/ui/separator"
import { getSelectedScenario } from "../../pages/internalDNS"

export function EmailView({ email, onClose }) {
  const [emailDetails, setEmailDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (email?.id) {
      fetchEmailDetails(email.id);
    }
  }, [email]);

  const fetchEmailDetails = async (messageId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const authToken = localStorage.getItem("auth_token");
      const scenarioId = getSelectedScenario();
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/emails/messages/${messageId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'X-Scenario-Id': scenarioId // Pass the scenario ID in headers
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching email details: ${response.status}`);
      }
      
      const data = await response.json();
      setEmailDetails(data);
      
      // Mark the email as read
      if (!data.isRead) {
        markAsRead(messageId);
      }
    } catch (err) {
      console.error("Failed to fetch email details:", err);
      setError("Unable to load email details. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const markAsRead = async (messageId) => {
    try {
      const authToken = localStorage.getItem("auth_token");
      const scenarioId = getSelectedScenario();
      
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/emails/messages/${messageId}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
          'X-Scenario-Id': scenarioId
        }
      });
    } catch (err) {
      console.error("Failed to mark email as read:", err);
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const options = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    
    return date.toLocaleString(undefined, options);
  };
  
  const getRecipientsByType = (type) => {
    if (!emailDetails?.recipients) return [];
    return emailDetails.recipients.filter(r => r.type === type);
  };
  
  const getRecipientsString = (recipients) => {
    if (!recipients || recipients.length === 0) return '';
    return recipients.map(r => r.emailAddress).join(', ');
  };
  
  // Get recipients by type
  const toRecipients = emailDetails ? getRecipientsByType(1) : []; // Assuming 1 is TO
  const ccRecipients = emailDetails ? getRecipientsByType(2) : []; // Assuming 2 is CC
  const bccRecipients = emailDetails ? getRecipientsByType(3) : []; // Assuming 3 is BCC

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="mt-2 text-sm text-muted-foreground">Loading email...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-medium">{error}</p>
          <Button variant="outline" className="mt-4" onClick={onClose}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!email || !emailDetails) return null;

  return (
    <div className="flex-1 overflow-auto bg-background">
      {/* Email Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center p-4">
          <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Archive className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Mail className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Clock className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Label className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Email Content */}
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">{emailDetails.subject}</h1>

        <div className="flex items-start gap-4 mb-6">
          <Avatar>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-semibold">{emailDetails.senderName[0]}</span>
            </div>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="font-semibold">{emailDetails.senderName}</span>
                <span className="text-muted-foreground ml-2">&lt;{emailDetails.senderEmail}&gt;</span>
              </div>
              <span className="text-sm text-muted-foreground">{formatDate(emailDetails.sentAt)}</span>
            </div>
            
            {/* Recipients */}
            <div className="text-sm text-muted-foreground">
              to {getRecipientsString(toRecipients)}
              
              {ccRecipients.length > 0 && (
                <div className="mt-1">cc: {getRecipientsString(ccRecipients)}</div>
              )}
              
              {bccRecipients.length > 0 && (
                <div className="mt-1">bcc: {getRecipientsString(bccRecipients)}</div>
              )}
            </div>
          </div>
        </div>

        {/* Attachments */}
        {emailDetails.attachments && emailDetails.attachments.length > 0 && (
          <div className="mb-6 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
            <h3 className="text-sm font-medium mb-2">
              <Paperclip className="h-4 w-4 inline mr-1" />
              Attachments ({emailDetails.attachments.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {emailDetails.attachments.map((attachment) => (
                <div 
                  key={attachment.id} 
                  className="flex items-center p-2 border rounded-md bg-white dark:bg-gray-700"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{attachment.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {(attachment.fileSize / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator className="my-6" />

        {/* Email Body */}
        {emailDetails.isHtml ? (
          <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: emailDetails.body }} />
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-wrap">{emailDetails.body}</div>
        )}

        <div className="flex gap-2 mt-6">
          <Button variant="secondary">
            <Reply className="h-4 w-4 mr-2" />
            Reply
          </Button>
          <Button variant="secondary">
            <ReplyAll className="h-4 w-4 mr-2" />
            Reply all
          </Button>
          <Button variant="secondary">
            <Forward className="h-4 w-4 mr-2" />
            Forward
          </Button>
        </div>
      </div>
    </div>
  )
}

