"use client"

import { useState } from "react"
import { Twitter } from "react-feather"

function Login({ onLogin }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const scenarioId = localStorage.getItem("selected_scenario")
      const userInfo = JSON.parse(localStorage.getItem("user_info"))
      const userIdentityId = userInfo?.id

      if (!scenarioId || !userIdentityId) {
        throw new Error("Missing required game information")
      }

      const loginRequest = {
        scenarioId,
        userIdentityId,
        username,
        password
      }

      const response = await fetch('https://localhost:5001/social-media/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginRequest)
      })

      if (!response.ok) {
        throw new Error(response.status === 400 ? 'Invalid credentials' : 'Login failed')
      }

      const sessionId = await response.json();
      console.log("--->", sessionId);
      // Store the session ID if needed
      localStorage.setItem('socialMediaSessionId', sessionId)
      
      setIsLoading(false)
      onLogin()
    } catch (err) {
      setIsLoading(false)
      setError(err.message || "Login failed. Please try again.")
    }
  }

  return (
    <div className="login-container h-full">
      <div className="login-form-container">
        <div className="login-logo">
          <Twitter size={40} />
        </div>

        <h1>Social Summit</h1>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login

