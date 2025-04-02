import React from 'react';
import './exifHidingGuide.css';

const ExifHidingGuide = () => {
  return (
    <div className="forum-container">
      <div className="forum-header">
        <div className="forum-logo">TechXplorer</div>
        <div className="forum-nav">
          <span>Forums</span>
          <span>{'>'}</span>
          <span>Image Processing</span>
          <span>{'>'}</span>
          <span>EXIF Manipulation</span>
        </div>
      </div>

      <div className="post-container">
        <h1 className="post-title">How to hide text in EXIF comment field [Tutorial]</h1>
        
        <div className="post-metadata">
          <span className="post-date">Posted: 2024-01-15</span>
          <span className="post-views">Views: 1,337</span>
          <span className="post-replies">Replies: 6</span>
        </div>

        <div className="forum-post">
          <div className="post-author">
            <div className="author-avatar">DK</div>
            <div className="author-info">
              <div className="author-name">DataKeeper</div>
              <div className="author-status">Senior Member</div>
              <div className="author-posts">Posts: 842</div>
            </div>
          </div>

          <div className="post-content">
            <p>Hey everyone! Here's a quick guide on how to hide text in JPEG EXIF comments. This is useful for adding invisible notes to your images. 👻</p>
            
            <div className="code-block">
              <div className="code-header">
                <span>Command Line Method</span>
                <button className="copy-btn">Copy</button>
              </div>
              <pre>
                <code>
exiftool -Comment="Your hidden message here" image.jpg
                </code>
              </pre>
            </div>

            <h3>Steps:</h3>
            <ol>
              <li>Install ExifTool on your system</li>
              <li>Open terminal/command prompt</li>
              <li>Navigate to your image directory</li>
              <li>Run the command above</li>
              <li>To verify, use: exiftool -Comment image.jpg</li>
            </ol>

            <div className="info-box">
              <p>💡 Pro Tip: EXIF comments can store quite a bit of text - perfect for longer messages!</p>
            </div>

            <p>The best part? Most image viewers don't show EXIF comments by default, so your message stays hidden unless someone specifically looks for it.</p>
          </div>
        </div>

        <div className="forum-replies">
          <div className="reply">
            <div className="reply-author">ImageMaster</div>
            <div className="reply-content">
              <p>Great tutorial! You can also use this to store backup info in your vacation photos 😉</p>
            </div>
          </div>

          <div className="reply">
            <div className="reply-author">SecureData</div>
            <div className="reply-content">
              <p>Just remember that some social media platforms strip EXIF data when you upload images!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="similar-threads">
        <h3>Similar Threads</h3>
        <ul>
          <li>Understanding EXIF metadata structure</li>
          <li>Best tools for EXIF manipulation</li>
          <li>How to batch process EXIF data</li>
        </ul>
      </div>
    </div>
  );
};

export default ExifHidingGuide; 