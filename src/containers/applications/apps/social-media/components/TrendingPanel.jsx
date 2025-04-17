function TrendingPanel() {
    const trendingTopics = [
      { id: 1, category: "Politics", title: "Summit on Ukraine and EU defense", count: "+12.6K tweets" },
      { id: 2, category: "Law & Justice", title: "Anti-Corruption Team - New Policy", count: "+2.9K tweets" },
      { id: 3, category: "Business", title: "Tesla", count: "124K tweets" },
      { id: 4, category: "Technology", title: "Starlink", count: "30.5K tweets" },
      { id: 5, category: "US Politics", title: "The US", count: "1.3M tweets" },
    ]
  
    const whoToFollow = [
      { id: 1, name: "Tech Insider", handle: "@TechInsider", verified: true },
      { id: 2, name: "Peter Yang", handle: "@peteryang", verified: true },
      { id: 3, name: "Dev Community", handle: "@devcomm", verified: false },
    ]
  
    return (
      <div className="trending-panel">
        <div className="search-container">
          <input type="text" placeholder="Search" className="search-input" />
        </div>
  
        <div className="trending-section">
          <h2>What's happening</h2>
          <div className="trending-topics">
            {trendingTopics.map((topic) => (
              <div key={topic.id} className="trending-topic">
                <div className="topic-category">{topic.category}</div>
                <div className="topic-title">{topic.title}</div>
                <div className="topic-count">{topic.count}</div>
              </div>
            ))}
          </div>
          <a href="#" className="show-more">
            Show more
          </a>
        </div>
  
        <div className="who-to-follow">
          <h2>Who to follow</h2>
          {whoToFollow.map((user) => (
            <div key={user.id} className="follow-suggestion">
              <div className="user-avatar"></div>
              <div className="user-info">
                <div className="user-name">
                  {user.name} {user.verified && <span className="verified-badge">✓</span>}
                </div>
                <div className="user-handle">{user.handle}</div>
              </div>
              <button className="follow-button">Follow</button>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  export default TrendingPanel
  
  