"use client"

import { useState, useEffect } from "react"
import { MessageCircle, Send, Check } from "react-feather"

function Messages() {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const [userInfoId, setUserInfoId] = useState(null)

  useEffect(() => {
    const socialMediaUserId = localStorage.getItem("socialMediaSessionId")
    if (socialMediaUserId) {
      setUserInfoId(socialMediaUserId);
    }
  }, [])

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const scenarioId = localStorage.getItem("selected_scenario");
        
        if (!userInfoId || !scenarioId) {
          throw new Error("Missing required user or scenario information")
        }

        const response = await fetch(
          `https://localhost:5001/social-media/users/${userInfoId}/direct-messages?scenarioId=${scenarioId}`
        )

        if (!response.ok) {
          throw new Error("Failed to fetch messages")
        }

        const data = await response.json()
        setMessages(data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading messages:", error)
        setError(error.message)
        setIsLoading(false)
      }
    }

    if (userInfoId) {
      loadMessages()
    }
  }, [userInfoId])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    try {
      // TODO: Implement send message API call
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Group messages by conversation
  const conversations = messages.reduce((acc, message) => {
    const otherUserId = message.senderUserId === userInfoId ? message.receiverUserId : message.senderUserId
    const otherUsername = message.senderUserId === userInfoId ? message.receiverUsername : message.senderUsername
    if (!acc[otherUserId]) {
      acc[otherUserId] = {
        userId: otherUserId,
        username: otherUsername,
        messages: [],
        lastMessage: message,
        unreadCount: 0
      }
    }
    if (!message.isRead && message.receiverUserId === userInfoId) {
      acc[otherUserId].unreadCount++
    }
    acc[otherUserId].messages.push(message)
    return acc
  }, {})

  return (
    <div className="messages-container">
      <div className="messages-sidebar">
        <h2>Messages</h2>
        {isLoading ? (
          <div className="loading">Loading messages...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="conversations-list">
            {Object.values(conversations).map((conversation) => (
              <div
                key={conversation.userId}
                className={`conversation-item ${selectedConversation?.userId === conversation.userId ? "active" : ""}`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="conversation-avatar">
                  <MessageCircle size={24} />
                </div>
                <div className="conversation-info">
                  <div className="conversation-name">{conversation.username}</div>
                  <div className="conversation-preview">
                    {conversation.lastMessage.content.substring(0, 50)}
                    {conversation.lastMessage.content.length > 50 && "..."}
                  </div>
                  <div className="conversation-meta">
                    <span className="conversation-time">
                      {formatDate(conversation.lastMessage.sentAt)}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <span className="unread-count">{conversation.unreadCount}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="messages-content">
        {selectedConversation ? (
          <>
            <div className="messages-header">
              <h3>Conversation with {selectedConversation.username}</h3>
            </div>

            <div className="messages-list">
              {selectedConversation.messages.map((message) => (
                <div
                  key={message.directMessageId}
                  className={`message-item ${message.senderUserId === userInfoId ? "sent" : "received"}`}
                >
                  <div className="message-content">{message.content}</div>
                  <div className="message-footer">
                    <span className="message-time">{formatDate(message.sentAt)}</span>
                    {message.senderUserId === userInfoId && (
                      <span className="message-status">
                        {message.isRead ? <div><Check size={16} /><Check size={16} /></div> : <Check size={16} />}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <form className="message-input" onSubmit={handleSendMessage}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button type="submit">
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="no-conversation">
            <MessageCircle size={48} />
            <h3>Select a conversation</h3>
            <p>Choose a conversation from the list to start messaging</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Messages

