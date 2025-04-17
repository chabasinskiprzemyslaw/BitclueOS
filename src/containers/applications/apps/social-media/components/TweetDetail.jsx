"use client"

import { useState } from "react"
import { ArrowLeft, Heart, MessageCircle, Repeat, Share2, Bookmark } from "react-feather"
import Tweet from "./Tweet"

function TweetDetail({ tweet, onClose }) {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [comments, setComments] = useState([
    {
      id: "c1",
      user: {
        name: "Alice Johnson",
        handle: "alicejohnson",
        verified: false,
        avatar: "https://via.placeholder.com/48",
      },
      text: "This is really interesting! Thanks for sharing.",
      time: "1h",
      likes: 5,
      retweets: 0,
      replies: 0,
      isReply: true,
    },
    {
      id: "c2",
      user: {
        name: "Bob Williams",
        handle: "bobwilliams",
        verified: true,
        avatar: "https://via.placeholder.com/48",
      },
      text: "I've been working on something similar. Would love to connect!",
      time: "45m",
      likes: 3,
      retweets: 1,
      replies: 0,
      isReply: true,
    },
    {
      id: "c3",
      user: {
        name: "Carol Davis",
        handle: "caroldavis",
        verified: false,
        avatar: "https://via.placeholder.com/48",
      },
      text: "Have you considered using the new framework for this?",
      time: "30m",
      likes: 2,
      retweets: 0,
      replies: 0,
      isReply: true,
    }
  ])

  const handleSubmitReply = (e) => {
    e.preventDefault()
    
    if (!replyText.trim()) return
    
    const newComment = {
      id: `c${Date.now()}`,
      user: {
        name: "Current User",
        handle: "currentuser",
        verified: false,
        avatar: "https://via.placeholder.com/48",
      },
      text: replyText,
      time: "just now",
      likes: 0,
      retweets: 0,
      replies: 0,
      isReply: true,
    }
    
    setComments([newComment, ...comments])
    setReplyText("")
  }

  return (
    <div className="tweet-detail">
      <div className="tweet-detail-header">
        <button className="back-button" onClick={onClose}>
          <ArrowLeft size={20} />
        </button>
        <h2>Post</h2>
      </div>
      
      <div className="tweet-detail-content">
        <div className="tweet-detail-main">
          <div className="tweet-avatar">
            <img src={tweet.user.avatar || "https://via.placeholder.com/48"} alt={tweet.user.name} />
          </div>
          
          <div className="tweet-content">
            <div className="tweet-header">
              <span className="tweet-name">{tweet.user.name}</span>
              {tweet.user.verified && <span className="verified">✓</span>}
              <span className="tweet-handle">@{tweet.user.handle}</span>
            </div>
            
            <div className="tweet-text">{tweet.text}</div>
            
            {tweet.image && (
              <div className="tweet-image">
                <img src={tweet.image || "/placeholder.svg"} alt="Tweet media" />
              </div>
            )}
            
            <div className="tweet-time-full">
              {/* Mock time format - would be real in production */}
              <span>{tweet.time === "now" ? "Just now" : `${tweet.time === "1d" ? "Yesterday" : tweet.time} ago`}</span>
            </div>
            
            <div className="tweet-stats">
              <div className="stat">
                <span className="count">{tweet.retweets}</span>
                <span className="label">Retweets</span>
              </div>
              <div className="stat">
                <span className="count">{tweet.likes}</span>
                <span className="label">Likes</span>
              </div>
              <div className="stat">
                <span className="count">{comments.length}</span>
                <span className="label">Comments</span>
              </div>
            </div>
            
            <div className="tweet-actions">
              <button className="tweet-action">
                <MessageCircle size={18} />
              </button>
              
              <button className="tweet-action">
                <Repeat size={18} />
              </button>
              
              <button className={`tweet-action ${liked ? "liked" : ""}`} onClick={() => setLiked(!liked)}>
                <Heart size={18} />
              </button>
              
              <button className={`tweet-action ${bookmarked ? "bookmarked" : ""}`} onClick={() => setBookmarked(!bookmarked)}>
                <Bookmark size={18} />
              </button>
              
              <button className="tweet-action">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="reply-compose">
        <div className="reply-avatar">
          <img src="https://via.placeholder.com/48" alt="Your avatar" />
        </div>
        
        <form onSubmit={handleSubmitReply} className="reply-form">
          <textarea
            placeholder="Tweet your reply"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            maxLength={280}
          />
          
          <div className="reply-actions">
            <button type="submit" disabled={!replyText.trim()}>
              Reply
            </button>
          </div>
        </form>
      </div>
      
      <div className="comments-container">
        <h3>Comments</h3>
        {comments.map((comment) => (
          <Tweet key={comment.id} tweet={comment} />
        ))}
      </div>
    </div>
  )
}

export default TweetDetail 