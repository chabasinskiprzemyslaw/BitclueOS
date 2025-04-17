import React from 'react';
import './quickBite.css';

const QuickBite = () => {
  return (
    <div className="quickbite-container">
      <header className="quickbite-header">
        <div className="header-content">
          <div className="logo">Quick<span>Bite</span></div>
          <div className="search-bar">
            <input type="text" placeholder="Search for restaurants or cuisines..." />
            <button className="search-btn">🔍</button>
          </div>
          <div className="user-actions">
            <button className="location-btn">📍 Current Location</button>
            <button className="cart-btn">🛒 Cart (0)</button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="categories-bar">
          <div className="category active">All</div>
          <div className="category">Pizza</div>
          <div className="category">Burgers</div>
          <div className="category">Sushi</div>
          <div className="category">Desserts</div>
          <div className="category">Drinks</div>
        </div>

        <div className="restaurants-grid">
          <div className="restaurant-card">
            <div className="restaurant-image pizza"></div>
            <div className="restaurant-info">
              <div className="restaurant-header">
                <h2>Pizza Express</h2>
                <span className="rating">⭐ 4.8</span>
              </div>
              <p className="cuisine">Italian • Pizza • Pasta</p>
              <div className="delivery-info">
                <span>🛵 20-30 min</span>
                <span>💵 Free delivery</span>
              </div>
              <div className="price-range">€€</div>
            </div>
          </div>

          <div className="restaurant-card">
            <div className="restaurant-image sushi"></div>
            <div className="restaurant-info">
              <div className="restaurant-header">
                <h2>Sushi Master</h2>
                <span className="rating">⭐ 4.9</span>
              </div>
              <p className="cuisine">Japanese • Sushi • Asian</p>
              <div className="delivery-info">
                <span>🛵 25-35 min</span>
                <span>💵 €2.99 delivery</span>
              </div>
              <div className="price-range">€€€</div>
            </div>
          </div>

          <div className="restaurant-card">
            <div className="restaurant-image burger"></div>
            <div className="restaurant-info">
              <div className="restaurant-header">
                <h2>Burger House</h2>
                <span className="rating">⭐ 4.7</span>
              </div>
              <p className="cuisine">American • Burgers • Fast Food</p>
              <div className="delivery-info">
                <span>🛵 15-25 min</span>
                <span>💵 Free delivery</span>
              </div>
              <div className="price-range">€€</div>
            </div>
          </div>

          <div className="restaurant-card">
            <div className="restaurant-image dessert"></div>
            <div className="restaurant-info">
              <div className="restaurant-header">
                <h2>Sweet Dreams</h2>
                <span className="rating">⭐ 4.6</span>
              </div>
              <p className="cuisine">Desserts • Ice Cream • Cakes</p>
              <div className="delivery-info">
                <span>🛵 30-40 min</span>
                <span>💵 €1.99 delivery</span>
              </div>
              <div className="price-range">€€</div>
            </div>
          </div>
        </div>
      </main>

      <div className="promo-banner">
        <div className="promo-content">
          <h3>🎉 Special Offer!</h3>
          <p>Get 20% off on your first order</p>
          <button className="promo-btn">Use Code: FIRST20</button>
        </div>
      </div>

      <footer className="quickbite-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>About QuickBite</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Press</a>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Contact Us</a>
            <a href="#">FAQs</a>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 QuickBite. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default QuickBite; 