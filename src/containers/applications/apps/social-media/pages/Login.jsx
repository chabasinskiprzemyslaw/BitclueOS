"use client"

import { useState } from "react"
import { Twitter } from "react-feather"

function Login({ onLogin }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // In a real app, we would call the API
      // const response = await loginUser({ email, password });

      // For now, just simulate a successful login
      setTimeout(() => {
        setIsLoading(false)
        onLogin()
      }, 1000)
    } catch (err) {
      setIsLoading(false)
      setError("Invalid email or password")
    }
  }

  return (
    <div className="login-container">
      <div className="login-form-container">
        <div className="login-logo">
          <Twitter size={40} />
        </div>

        <h1>Sign in to X</h1>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
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

        <div className="login-links">
          <a href="#">Forgot password?</a>
          <span>·</span>
          <a href="#">Sign up for X</a>
        </div>
      </div>
    </div>
  )
}

export default Login

