import React from 'react';
import './buzzHub.css';

const BuzzHub = () => {
  return (
    <div className="buzzhub-container">
      <header className="buzzhub-header">
        <div className="header-top">
          <div className="logo">Buzz<span>Hub</span></div>
          <nav className="main-nav">
            <a href="#" className="active">Trending</a>
            <a href="#">Celeb News</a>
            <a href="#">Social Media</a>
            <a href="#">Style</a>
            <a href="#">Videos</a>
          </nav>
        </div>
        <div className="trending-bar">
          <span className="trending-label">TRENDING NOW:</span>
          <div className="trending-topics">
            <span>#TechTokDrama</span>
            <span>#VirtualInfluencer</span>
            <span>#MetaverseParty</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="featured-story">
          <div className="story-image"></div>
          <div className="story-content">
            <div className="story-category">BREAKING NEWS</div>
            <h1>Famous Tech Influencer Disappears from Social Media After Cryptic Post</h1>
            <p className="story-excerpt">
              Fans are worried after the sudden disappearance of @TechWhisperer, known for exposing industry secrets...
            </p>
            <div className="story-meta">
              <span className="author">By Sarah Chen</span>
              <span className="date">2 hours ago</span>
              <span className="comments">847 comments</span>
            </div>
          </div>
        </div>

        <div className="content-grid">
          <div className="main-column">
            <article className="news-card">
              <div className="card-image lifestyle"></div>
              <div className="card-content">
                <span className="category">LIFESTYLE</span>
                <h2>"Living My Best Digital Life": Influencers Share Their Morning Routines</h2>
                <p>From meditation apps to smart coffee makers, here's how top creators start their day...</p>
                <div className="card-meta">
                  <span>12K shares</span>
                  <span>5 hours ago</span>
                </div>
              </div>
            </article>

            <article className="news-card">
              <div className="card-image controversy"></div>
              <div className="card-content">
                <span className="category">CONTROVERSY</span>
                <h2>Popular Creator Accused of Using AI to Generate Content</h2>
                <p>Followers spot inconsistencies in recent posts, leading to heated debate...</p>
                <div className="card-meta">
                  <span>8.5K shares</span>
                  <span>1 day ago</span>
                </div>
              </div>
            </article>
          </div>

          <aside className="sidebar">
            <div className="trending-widget">
              <h3>🔥 Trending Stories</h3>
              <ul>
                <li>
                  <span className="number">1</span>
                  <div className="trend-content">
                    <h4>New Social Platform Causes Stir Among Gen Z</h4>
                    <span className="trend-meta">Trending for 3 days</span>
                  </div>
                </li>
                <li>
                  <span className="number">2</span>
                  <div className="trend-content">
                    <h4>Virtual Influencer's Identity Revealed?</h4>
                    <span className="trend-meta">50K shares</span>
                  </div>
                </li>
                <li>
                  <span className="number">3</span>
                  <div className="trend-content">
                    <h4>Top Creator's Secret Project Leaked</h4>
                    <span className="trend-meta">Breaking News</span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="must-read">
              <h3>📱 Must Read</h3>
              <div className="must-read-item">
                <h4>10 Rising Stars You Need to Follow in 2024</h4>
                <p>Discover the next generation of digital creators...</p>
              </div>
              <div className="must-read-item">
                <h4>The Dark Side of Influencer Culture</h4>
                <p>Exclusive investigation reveals hidden pressures...</p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <footer className="buzzhub-footer">
        <div className="footer-content">
          <div className="footer-logo">BuzzHub</div>
          <div className="footer-links">
            <a href="#">About</a>
            <a href="#">Contact</a>
            <a href="#">Advertise</a>
            <a href="#">Privacy Policy</a>
          </div>
          <div className="social-links">
            <span>Follow us:</span>
            <a href="#" className="social-icon">📱</a>
            <a href="#" className="social-icon">💬</a>
            <a href="#" className="social-icon">📸</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BuzzHub; 