"use client"

import { useState, useEffect } from "react"
import Tweet from "../components/Tweet"

function Home() {
  const [tweets, setTweets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [tweetText, setTweetText] = useState("")

  useEffect(() => {
    const loadTweets = async () => {
      try {
        // In a real app, we would fetch from the API
        // const data = await fetchTweets();

        // For now, use mock data
        const mockTweets = [
          {
            id: 1,
            user: {
              name: "John Doe",
              handle: "johndoe",
              verified: true,
              avatar: "https://via.placeholder.com/48",
            },
            text: "Just launched my new website! Check it out and let me know what you think.",
            time: "2h",
            likes: 42,
            retweets: 5,
            replies: 3,
          },
          {
            id: 2,
            user: {
              name: "Jane Smith",
              handle: "janesmith",
              verified: false,
              avatar: "https://via.placeholder.com/48",
            },
            text: "Working on a new project. Can't wait to share it with everyone!",
            time: "5h",
            likes: 18,
            retweets: 2,
            replies: 1,
            image: "https://via.placeholder.com/500x300",
          },
          {
            id: 3,
            user: {
              name: "Tech News",
              handle: "technews",
              verified: true,
              avatar: "https://via.placeholder.com/48",
            },
            text: "Breaking: New AI model can generate realistic images from text descriptions.",
            time: "1d",
            likes: 230,
            retweets: 78,
            replies: 25,
          },
        ]

        setTweets(mockTweets)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading tweets:", error)
        setIsLoading(false)
      }
    }

    loadTweets()
  }, [])

  const handleTweetSubmit = (e) => {
    e.preventDefault()

    if (!tweetText.trim()) return

    const newTweet = {
      id: Date.now(),
      user: {
        name: "Current User",
        handle: "currentuser",
        verified: false,
        avatar: "https://via.placeholder.com/48",
      },
      text: tweetText,
      time: "now",
      likes: 0,
      retweets: 0,
      replies: 0,
    }

    setTweets([newTweet, ...tweets])
    setTweetText("")
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h2>Home</h2>
      </div>

      <div className="compose-tweet">
        <div className="compose-avatar">
          <img src="https://via.placeholder.com/48" alt="Your avatar" />
        </div>

        <form onSubmit={handleTweetSubmit} className="compose-form">
          <textarea
            placeholder="What's happening?"
            value={tweetText}
            onChange={(e) => setTweetText(e.target.value)}
            maxLength={280}
          />

          <div className="compose-actions">
            <button type="submit" disabled={!tweetText.trim()}>
              Tweet
            </button>
          </div>
        </form>
      </div>

      <div className="tweets-container">
        {isLoading ? (
          <div className="loading">Loading tweets...</div>
        ) : (
          tweets.map((tweet) => <Tweet key={tweet.id} tweet={tweet} />)
        )}
      </div>
    </div>
  )
}

export default Home