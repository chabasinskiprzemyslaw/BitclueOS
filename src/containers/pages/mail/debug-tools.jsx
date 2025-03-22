import { useState } from 'react';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";

/**
 * Debug Tools Component
 * 
 * This component provides debugging utilities for the email app,
 * including the ability to simulate real-time email notifications.
 * 
 * IMPORTANT: This should only be used in development/testing environments.
 */
export function EmailDebugTools({ emailAccountId, hubConnection, onClose }) {
  const [subject, setSubject] = useState("Test Email Subject");
  const [sender, setSender] = useState("Debug Sender");
  const [body, setBody] = useState("This is a test email sent from the debug tools.");
  const [senderEmail, setSenderEmail] = useState("debug@example.com");
  const [status, setStatus] = useState("");

  const simulateNewEmail = () => {
    if (!hubConnection.current) {
      setStatus("Error: No SignalR connection available");
      return;
    }

    // Create a mock email object
    const mockEmail = {
      id: `mock-${Date.now()}`,
      subject: subject,
      senderName: sender,
      senderEmail: senderEmail,
      body: body,
      preview: body.substring(0, 50) + (body.length > 50 ? "..." : ""),
      isRead: false,
      isNew: true,
      folderName: "Inbox",
      sentAt: new Date().toISOString(),
      recipients: [
        {
          type: 1, // TO
          emailAddress: emailAccountId,
          displayName: "You"
        }
      ],
      attachments: []
    };

    setStatus("Simulating new email...");

    // Debug: Simulate receiving the email via SignalR
    // In a real app, this would come from the server
    try {
      // The real implementation would call the server, but for debugging
      // we're directly simulating the callback that would be triggered
      if (window.emailNotificationCallback) {
        window.emailNotificationCallback(mockEmail);
        setStatus("New email simulated successfully!");
      } else {
        setStatus("Error: No notification callback registered");
      }
    } catch (error) {
      console.error("Error simulating email:", error);
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 w-80 z-50 border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Email Debug Tools</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
      </div>
      
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium block mb-1">Subject</label>
          <Input 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Email subject"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium block mb-1">Sender Name</label>
          <Input 
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            placeholder="Sender name"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium block mb-1">Sender Email</label>
          <Input 
            value={senderEmail}
            onChange={(e) => setSenderEmail(e.target.value)}
            placeholder="sender@example.com"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium block mb-1">Body</label>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Email content"
            rows={3}
          />
        </div>
        
        <Button 
          className="w-full"
          onClick={simulateNewEmail}
          disabled={!emailAccountId}
        >
          Simulate New Email
        </Button>
        
        {status && (
          <div className="text-sm mt-2 p-2 rounded bg-gray-100">
            {status}
          </div>
        )}
        
        <div className="text-xs text-muted-foreground mt-2">
          Connection Status: {hubConnection.current ? "Connected" : "Not Connected"}
          <br />
          Email Account: {emailAccountId || "Not logged in"}
        </div>
      </div>
    </div>
  );
} 