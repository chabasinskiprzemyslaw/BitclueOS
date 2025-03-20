"use client"

import { useState, useEffect } from "react"
import { Bell, Heart, Repeat, User, MessageCircle } from "react-feather"

function Notifications() {
  const [activeTab, setActiveTab] = useState("all")
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        // In a real app, we would fetch from the API
        // const data = await fetchNotifications();

        // For now, use mock data
        const mockNotifications = [
          {
            id: 1,
            type: "like",
            user: {
              name: "John Doe",
              handle: "johndoe",
              avatar: "https://via.placeholder.com/48",
            },
            content: "liked your tweet",
            tweetText: "Just launched my new website! Check it out and let me know what you think.",
            time: "2h ago",
          },
          {
            id: 2,
            type: "retweet",
            user: {
              name: "Jane Smith",
              handle: "janesmith",
              avatar: "https://via.placeholder.com/48",
            },
            content: "retweeted your tweet",
            tweetText: "Working on a new project. Can't wait to share it with everyone!",
            time: "5h ago",
          },
          {
            id: 3,
            type: "follow",
            user: {
              name: "Tech News",
              handle: "technews",
              avatar: "https://via.placeholder.com/48",
            },
            content: "followed you",
            time: "1d ago",
          },
          {
            id: 4,
            type: "mention",
            user: {
              name: "Sarah Johnson",
              handle: "sarahjohnson",
              avatar: "https://via.placeholder.com/48",
            },
            content: "mentioned you",
            tweetText: "Hey @currentuser, what do you think about the new AI developments?",
            time: "2d ago",
          },
        ]

        setNotifications(mockNotifications)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading notifications:", error)
        setIsLoading(false)
      }
    }

    loadNotifications()
  }, [])

  const tabs = [
    { id: "all", label: "All" },
    { id: "mentions", label: "Mentions" },
  ]

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return <Heart size={18} className="notification-icon like" />
      case "retweet":
        return <Repeat size={18} className="notification-icon retweet" />
      case "follow":
        return <User size={18} className="notification-icon follow" />
      case "mention":
        return <MessageCircle size={18} className="notification-icon mention" />
      default:
        return <Bell size={18} className="notification-icon" />
    }
  }

  const filteredNotifications =
    activeTab === "all" ? notifications : notifications.filter((notification) => notification.type === "mention")

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>Notifications</h2>

        <div className="tabs-container">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="notifications-content">
        {isLoading ? (
          <div className="loading">Loading notifications...</div>
        ) : filteredNotifications.length === 0 ? (
          <div className="empty-state">
            <h3>Nothing to see here — yet</h3>
            <p>When there's new activity, it'll show up here.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {filteredNotifications.map((notification) => (
              <div key={notification.id} className="notification-item">
                <div className="notification-icon-container">{getNotificationIcon(notification.type)}</div>

                <div className="notification-content">
                  <div className="notification-avatar">
                    <img src={notification.user.avatar || "/placeholder.svg"} alt={notification.user.name} />
                  </div>

                  <div className="notification-details">
                    <div className="notification-header">
                      <span className="notification-name">{notification.user.name}</span>
                      <span className="notification-action">{notification.content}</span>
                    </div>

                    {notification.tweetText && <div className="notification-tweet">{notification.tweetText}</div>}

                    <div className="notification-time">{notification.time}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Notifications

