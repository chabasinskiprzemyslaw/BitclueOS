import React, { useState } from 'react';
import { addPinnedNote } from './PinnedNotes';
import '../styles/PinnedNotesDevTool.scss';

/**
 * A developer tool for testing the pinned notes feature.
 * This can be added temporarily to the app during development,
 * but should be removed or disabled in production.
 */
const PinnedNotesDevTool = () => {
  const [showTool, setShowTool] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('yellow');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      return;
    }
    
    // Add the note
    addPinnedNote(title, content, color);
    
    // Reset form
    setTitle('');
    setContent('');
  };

  // Toggle the dev tool panel
  const toggleTool = () => {
    setShowTool(!showTool);
  };

  return (
    <div className="pinned-notes-dev-tool">
      <button 
        className="toggle-button"
        onClick={toggleTool}
      >
        {showTool ? 'Hide Note Tool' : 'Show Note Tool'}
      </button>
      
      {showTool && (
        <div className="tool-panel">
          <h3>Add Test Note</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note Title"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="content">Content:</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Note Content"
                rows="4"
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="color">Color:</label>
              <select
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              >
                <option value="yellow">Yellow</option>
                <option value="blue">Blue</option>
                <option value="pink">Pink</option>
                <option value="green">Green</option>
              </select>
            </div>
            
            <button type="submit" className="add-button">
              Add Note
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PinnedNotesDevTool; 