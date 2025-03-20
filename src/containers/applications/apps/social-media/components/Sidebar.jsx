import { Home, Search, Bell, Mail, User, MoreHorizontal, Twitter } from "react-feather"

function Sidebar({ activePage, onChangePage }) {
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
            <User size={24} />
          </div>
          <div className="profile-info">
            <span className="profile-name">Username</span>
            <span className="profile-handle">@username</span>
          </div>
          <MoreHorizontal size={16} />
        </a>
      </div>

      <button className="tweet-button">Tweet</button>
    </div>
  )
}

export default Sidebar

