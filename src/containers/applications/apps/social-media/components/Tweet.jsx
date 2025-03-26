"use client"

import { useState } from "react"
import { Heart, MessageCircle, Repeat, Share2, Bookmark, ExternalLink } from "react-feather"

function Tweet({ tweet, onClick }) {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  const handleTweetClick = (e) => {
    // Only trigger if not clicking on an action button
    if (!e.target.closest('.tweet-action')) {
      onClick && onClick(tweet)
    }
  }

  return (
    <div className="tweet" onClick={handleTweetClick} title="Click to view details">
      <div className="tweet-avatar">
        <img src={tweet.user.avatar || "https://via.placeholder.com/48"} alt={tweet.user.name} />
      </div>

      <div className="tweet-content">
        <div className="tweet-header">
          <span className="tweet-name">{tweet.user.name}</span>
          {tweet.user.verified && <span className="verified">✓</span>}
          <span className="tweet-handle">@{tweet.user.handle}</span>
          <span className="tweet-time">· {tweet.time}</span>
        </div>

        <div className="tweet-text">{tweet.text}</div>

        {tweet.image && (
          <div className="tweet-image">
            <img src={tweet.image || "/placeholder.svg"} alt="Tweet media" />
          </div>
        )}

        <div className="tweet-actions">
          <button className="tweet-action" title="Reply">
            <MessageCircle size={18} />
            <span>{tweet.replies || 0}</span>
          </button>

          <button className="tweet-action" title="Retweet">
            <Repeat size={18} />
            <span>{tweet.retweets || 0}</span>
          </button>

          <button 
            className={`tweet-action ${liked ? "liked" : ""}`} 
            onClick={() => setLiked(!liked)}
            title="Like"
          >
            <Heart size={18} />
            <span>{liked ? (tweet.likes || 0) + 1 : tweet.likes || 0}</span>
          </button>

          <button
            className={`tweet-action ${bookmarked ? "bookmarked" : ""}`}
            onClick={() => setBookmarked(!bookmarked)}
            title="Bookmark"
          >
            <Bookmark size={18} />
          </button>

          <button className="tweet-action" title="Share">
            <Share2 size={18} />
          </button>
          
          {onClick && (
            <button 
              className="tweet-action view-details" 
              onClick={(e) => {
                e.stopPropagation()
                onClick(tweet)
              }}
              title="View details"
            >
              <ExternalLink size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Tweet

