import React from 'react';
import './exifGuide.css';

const ExifGuide = () => {
  return (
    <div className="exif-guide-container">
      <header className="guide-header">
        <h1>Understanding EXIF Metadata in Images</h1>
        <p className="subtitle">A comprehensive guide to digital image information</p>
      </header>

      <main className="guide-content">
        <section className="guide-section">
          <h2>What is EXIF Metadata?</h2>
          <p>EXIF (Exchangeable Image File Format) is a standard that specifies the formats for images, sound, and ancillary tags used by digital cameras, smartphones, and other imaging devices. This metadata provides crucial information about your images.</p>
          
          <div className="key-points">
            <h3>Common EXIF Data Types</h3>
            <ul>
              <li>Camera make and model</li>
              <li>Date and time of image capture</li>
              <li>Camera settings (aperture, shutter speed, ISO)</li>
              <li>GPS location coordinates</li>
              <li>Image resolution and compression</li>
            </ul>
          </div>
        </section>

        <section className="guide-section">
          <h2>Why EXIF Matters</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>Photography</h3>
              <p>Helps photographers track their camera settings and shooting conditions for future reference and improvement.</p>
            </div>
            <div className="info-card">
              <h3>Digital Forensics</h3>
              <p>Provides valuable information for investigating image authenticity and origin in digital forensics.</p>
            </div>
            <div className="info-card">
              <h3>Privacy Concerns</h3>
              <p>May contain sensitive information like location data, requiring careful consideration before sharing images online.</p>
            </div>
          </div>
        </section>

        <section className="guide-section">
          <h2>Working with EXIF Data</h2>
          <div className="tips-container">
            <div className="tip">
              <h4>Viewing EXIF Data</h4>
              <p>Most image editing software and operating systems provide built-in tools to view EXIF information.</p>
            </div>
            <div className="tip">
              <h4>Removing EXIF Data</h4>
              <p>You can strip EXIF data from images for privacy using specialized tools or image editors.</p>
            </div>
            <div className="tip">
              <h4>Editing EXIF Data</h4>
              <p>Some tools allow you to modify or add EXIF information for organizational purposes.</p>
            </div>
          </div>
        </section>

        <section className="guide-section">
          <h2>Security Considerations</h2>
          <ul className="security-list">
            <li>Check EXIF data before sharing sensitive images online</li>
            <li>Be aware that social media platforms may strip or modify EXIF data</li>
            <li>Consider using automated tools to remove sensitive EXIF data</li>
            <li>Keep original EXIF data in archived copies for personal reference</li>
          </ul>
        </section>
      </main>

      <footer className="guide-footer">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        <p>© 2024 EXIF Metadata Guide</p>
      </footer>
    </div>
  );
};

export default ExifGuide; 