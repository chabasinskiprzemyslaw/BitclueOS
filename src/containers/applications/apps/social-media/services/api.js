// This file contains mock API service functions
// In a real application, these would make actual HTTP requests to your backend

// User Management
export const registerUser = async (userData) => {
    // In a real app: return fetch('/social-media/users', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(userData)
    // }).then(res => res.json());
  
    console.log("Registering user:", userData)
    return { userId: "mock-user-id", ...userData }
  }
  
  export const loginUser = async (credentials) => {
    // In a real app: return fetch('/social-media/users/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(credentials)
    // }).then(res => res.json());
  
    console.log("Logging in user:", credentials)
    return { userId: "mock-user-id", token: "mock-auth-token" }
  }
  
  export const getUserById = async (userId) => {
    // In a real app: return fetch(`/social-media/users/${userId}`).then(res => res.json());
  
    console.log("Getting user:", userId)
    return {
      userId,
      name: "Mock User",
      handle: "mockuser",
      avatar: "https://via.placeholder.com/48",
    }
  }
  
  // Tweet Management
  export const createTweet = async (tweetData) => {
    // In a real app: return fetch('/social-media/tweets', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(tweetData)
    // }).then(res => res.json());
  
    console.log("Creating tweet:", tweetData)
    return {
      id: "mock-tweet-id",
      ...tweetData,
      createdAt: new Date().toISOString(),
    }
  }
  
  export const getTweetById = async (tweetId) => {
    // In a real app: return fetch(`/social-media/tweets/${tweetId}`).then(res => res.json());
  
    console.log("Getting tweet:", tweetId)
    return {
      id: tweetId,
      text: "This is a mock tweet",
      user: {
        id: "mock-user-id",
        name: "Mock User",
        handle: "mockuser",
      },
      createdAt: new Date().toISOString(),
    }
  }
  
  export const getTweetReplies = async (parentTweetId) => {
    // In a real app: return fetch(`/social-media/tweets/${parentTweetId}/replies`).then(res => res.json());
  
    console.log("Getting replies for tweet:", parentTweetId)
    return [
      {
        id: "mock-reply-1",
        text: "This is a mock reply",
        user: {
          id: "mock-user-id-2",
          name: "Another User",
          handle: "anotheruser",
        },
        createdAt: new Date().toISOString(),
      },
    ]
  }
  
  export const replyToTweet = async (parentTweetId, replyData) => {
    // In a real app: return fetch(`/social-media/tweets/${parentTweetId}/replies`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(replyData)
    // }).then(res => res.json());
  
    console.log("Replying to tweet:", parentTweetId, replyData)
    return {
      id: "mock-reply-id",
      parentTweetId,
      ...replyData,
      createdAt: new Date().toISOString(),
    }
  }
  
  // Direct Messages
  export const sendDirectMessage = async (messageData) => {
    // In a real app: return fetch('/social-media/direct-messages', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(messageData)
    // }).then(res => res.json());
  
    console.log("Sending direct message:", messageData)
    return {
      id: "mock-message-id",
      ...messageData,
      createdAt: new Date().toISOString(),
    }
  }
  
  export const markDirectMessageAsRead = async (directMessageId) => {
    // In a real app: return fetch(`/social-media/direct-messages/${directMessageId}/read`, {
    //   method: 'PUT'
    // }).then(res => res.json());
  
    console.log("Marking message as read:", directMessageId)
    return { success: true }
  }
  
  export const getDMsForUser = async (userId) => {
    // In a real app: return fetch(`/social-media/users/${userId}/direct-messages`).then(res => res.json());
  
    console.log("Getting DMs for user:", userId)
    return [
      {
        id: "mock-conversation-1",
        participants: [userId, "other-user-id"],
        messages: [
          {
            id: "mock-message-1",
            senderId: "other-user-id",
            text: "Hey there!",
            createdAt: new Date().toISOString(),
          },
        ],
      },
    ]
  }
  
  // Favorites
  export const addTweetToFavorites = async (userId, tweetId) => {
    // In a real app: return fetch(`/social-media/users/${userId}/favorites/tweets`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ tweetId })
    // }).then(res => res.json());
  
    console.log("Adding tweet to favorites:", userId, tweetId)
    return { success: true }
  }
  
  export const getUserFavorites = async (userId) => {
    // In a real app: return fetch(`/social-media/users/${userId}/favorites`).then(res => res.json());
  
    console.log("Getting favorites for user:", userId)
    return [
      {
        id: "mock-tweet-id",
        text: "This is a favorited tweet",
        user: {
          id: "other-user-id",
          name: "Other User",
          handle: "otheruser",
        },
        createdAt: new Date().toISOString(),
      },
    ]
  }
  
  // Fetch tweets for home timeline
  export const fetchTweets = async () => {
    // In a real app: return fetch('/social-media/tweets').then(res => res.json());
  
    console.log("Fetching tweets for timeline")
    return [
      {
        id: "mock-tweet-1",
        text: "This is a mock tweet for the timeline",
        user: {
          id: "mock-user-id-1",
          name: "User One",
          handle: "userone",
          avatar: "https://via.placeholder.com/48",
        },
        createdAt: new Date().toISOString(),
        likes: 42,
        retweets: 12,
        replies: 5,
      },
      {
        id: "mock-tweet-2",
        text: "Another mock tweet with an image",
        user: {
          id: "mock-user-id-2",
          name: "User Two",
          handle: "usertwo",
          avatar: "https://via.placeholder.com/48",
        },
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        likes: 18,
        retweets: 3,
        replies: 1,
        image: "https://via.placeholder.com/500x300",
      },
    ]
  }
  
  