"use client"

import { useState, useEffect } from "react"
import Tweet from "../components/Tweet"

function Explore() {
  const [activeTab, setActiveTab] = useState("for-you")
  const [trendingTweets, setTrendingTweets] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadTrendingTweets = async () => {
      try {
        // In a real app, we would fetch from the API
        // const data = await fetchTrendingTweets();

        // For now, use mock data
        const mockTweets = [
          {
            id: 1,
            user: {
              name: "Tech News",
              handle: "technews",
              verified: true,
              avatar: "https://via.placeholder.com/48",
            },
            text: "Breaking: New AI model can generate realistic images from text descriptions.",
            time: "1d",
            likes: 1230,
            retweets: 578,
            replies: 125,
            image: "https://via.placeholder.com/500x300",
          },
          {
            id: 2,
            user: {
              name: "Sports Center",
              handle: "sportscenter",
              verified: true,
              avatar: "https://via.placeholder.com/48",
            },
            text: "Championship finals set to begin next week. Who are you rooting for?",
            time: "3h",
            likes: 842,
            retweets: 231,
            replies: 94,
          },
          {
            id: 3,
            user: {
              name: "World News",
              handle: "worldnews",
              verified: true,
              avatar: "https://via.placeholder.com/48",
            },
            text: "Summit on Ukraine and EU defense begins today with leaders from 27 countries.",
            time: "5h",
            likes: 1542,
            retweets: 842,
            replies: 231,
          },
          {
            id: 4,
            user: {
              name: "Science Daily",
              handle: "sciencedaily",
              verified: true,
              avatar: "https://via.placeholder.com/48",
            },
            text: "Researchers discover new species in deep ocean exploration.",
            time: "1d",
            likes: 732,
            retweets: 215,
            replies: 43,
            image: "https://via.placeholder.com/500x300",
          },
        ]

        setTrendingTweets(mockTweets)
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading trending tweets:", error)
        setIsLoading(false)
      }
    }

    loadTrendingTweets()
  }, [])

  const tabs = [
    { id: "for-you", label: "For you" },
    { id: "trending", label: "Trending" },
    { id: "news", label: "News" },
    { id: "sports", label: "Sports" },
    { id: "entertainment", label: "Entertainment" },
  ]

  return (
    <div className="explore-container">
      <div className="explore-header">
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

      <div className="explore-content">
        {isLoading ? (
          <div className="loading">Loading trending content...</div>
        ) : (
          <div className="trending-tweets">
            {trendingTweets.map((tweet) => (
              <Tweet key={tweet.id} tweet={tweet} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Explore