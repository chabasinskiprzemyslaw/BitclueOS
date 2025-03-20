"use client"

import { useState } from "react"
import { Heart, MessageCircle, Repeat, Share2, Bookmark } from "react-feather"

function Tweet({ tweet }) {
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  return (
    <div className="tweet">
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
          <button className="tweet-action">
            <MessageCircle size={18} />
            <span>{tweet.replies || 0}</span>
          </button>

          <button className="tweet-action">
            <Repeat size={18} />
            <span>{tweet.retweets || 0}</span>
          </button>

          <button className={`tweet-action ${liked ? "liked" : ""}`} onClick={() => setLiked(!liked)}>
            <Heart size={18} />
            <span>{liked ? (tweet.likes || 0) + 1 : tweet.likes || 0}</span>
          </button>

          <button
            className={`tweet-action ${bookmarked ? "bookmarked" : ""}`}
            onClick={() => setBookmarked(!bookmarked)}
          >
            <Bookmark size={18} />
          </button>

          <button className="tweet-action">
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Tweet

