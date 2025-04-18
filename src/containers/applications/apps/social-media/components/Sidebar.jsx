import { Home, Search, Bell, Mail, User, MoreHorizontal, Twitter } from "react-feather"
import { useState, useEffect } from "react"

function Sidebar({ activePage, onChangePage, isLoggedIn }) {
  const [userDetails, setUserDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("user_info"))
        const userId = userInfo?.id
        if (!userId) {
          setError('User ID not found')
          setLoading(false)
          return
        }

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/social-media/users/${userId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch user details')
        }

        const data = await response.json()
        setUserDetails(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserDetails()
  }, [isLoggedIn])

  const isActive = (page) => {
    return activePage === page ? "active" : ""
  }

  return (
    <div className="sidebar">
      <div className="logo">
        <Twitter size={28} />
      </div>

      <nav className="sidebar-menu">
        <a onClick={() => onChangePage("home")} className={`sidebar-item ${isActive("home")}`}>
          <Home size={24} />
          <span>Home</span>
        </a>

        <a onClick={() => onChangePage("explore")} className={`sidebar-item ${isActive("explore")}`}>
          <Search size={24} />
          <span>Explore</span>
        </a>

        <a onClick={() => onChangePage("notifications")} className={`sidebar-item ${isActive("notifications")}`}>
          <Bell size={24} />
          <span>Notifications</span>
        </a>

        <a onClick={() => onChangePage("messages")} className={`sidebar-item ${isActive("messages")}`}>
          <Mail size={24} />
          <span>Messages</span>
        </a>
      </nav>

      <div className="profile-section">
        <a onClick={() => onChangePage("profile")} className="profile-button">
          <div className="avatar">
            {userDetails?.profileImage ? (
              <img src={userDetails.profileImage} alt={userDetails.username} />
            ) : (
              <User size={24} />
            )}
          </div>
          <div className="profile-info">
            <span className="profile-name">
              {loading ? 'Loading...' : error ? 'Error' : userDetails?.displayName || userDetails?.username || 'Unknown User'}
            </span>
            <span className="profile-handle">
              {loading ? '' : error ? '' : `@${userDetails?.username || 'username'}`}
            </span>
          </div>
          <MoreHorizontal size={16} />
        </a>
      </div>

      <button className="tweet-button">Tweet</button>
    </div>
  )
}

export default Sidebar

