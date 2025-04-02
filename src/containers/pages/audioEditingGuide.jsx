import React from 'react';
import './audioEditingGuide.css';

const AudioEditingGuide = () => {
  return (
    <div className="audio-guide-container">
      <header className="guide-header">
        <h1>Professional Audio Editing Guide</h1>
        <p className="subtitle">Master the art of audio production with our comprehensive guide</p>
      </header>

      <main className="guide-content">
        <section className="guide-section">
          <h2>Getting Started with Audio Editing</h2>
          <p>Audio editing is the process of manipulating recorded sound to achieve the desired result. Whether you're creating music, podcasts, or sound effects, understanding the basics is crucial.</p>
          
          <div className="key-points">
            <h3>Essential Tools</h3>
            <ul>
              <li>Digital Audio Workstation (DAW)</li>
              <li>High-quality headphones or studio monitors</li>
              <li>Audio interface (for recording)</li>
              <li>Basic plugins (EQ, compression, reverb)</li>
            </ul>
          </div>
        </section>

        <section className="guide-section">
          <h2>Basic Techniques</h2>
          <div className="technique-grid">
            <div className="technique-card">
              <h3>Cutting and Trimming</h3>
              <p>Learn to make precise cuts and remove unwanted sections while maintaining smooth transitions.</p>
            </div>
            <div className="technique-card">
              <h3>Fade In/Out</h3>
              <p>Create smooth beginnings and endings to your audio tracks using fade effects.</p>
            </div>
            <div className="technique-card">
              <h3>Equalization</h3>
              <p>Balance your mix by adjusting different frequency ranges to achieve clarity and depth.</p>
            </div>
          </div>
        </section>

        <section className="guide-section">
          <h2>Advanced Tips</h2>
          <div className="tips-container">
            <div className="tip">
              <h4>1. Room Treatment</h4>
              <p>Ensure your mixing environment is properly treated for accurate sound reproduction.</p>
            </div>
            <div className="tip">
              <h4>2. Reference Tracks</h4>
              <p>Use professional tracks as reference points to guide your mixing decisions.</p>
            </div>
            <div className="tip">
              <h4>3. Gain Staging</h4>
              <p>Maintain proper levels throughout your signal chain to prevent distortion.</p>
            </div>
          </div>
        </section>

        <section className="guide-section">
          <h2>Common Mistakes to Avoid</h2>
          <ul className="mistakes-list">
            <li>Over-compression leading to loss of dynamics</li>
            <li>Poor room acoustics affecting mix decisions</li>
            <li>Ignoring phase relationships between tracks</li>
            <li>Mixing at inappropriate volume levels</li>
          </ul>
        </section>
      </main>

      <footer className="guide-footer">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>© 2024 Professional Audio Editing Guide</p>
      </footer>
    </div>
  );
};

export default AudioEditingGuide; 