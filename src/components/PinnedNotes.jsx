import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../styles/PinnedNotes.scss";

// This component displays pinned notes on the desktop background
// These notes are meant to provide plot/lore information for the game
// They are not functional elements but rather informational content for the player

// Helper function to add a new note programmatically - can be exported and used by other components
export const addPinnedNote = (title, content, color = "yellow") => {
  // Get existing notes
  const savedNotes = localStorage.getItem('pinnedNotes');
  const notes = savedNotes ? JSON.parse(savedNotes) : [];
  
  // Generate random position within visible area
  const randomX = Math.floor(Math.random() * (window.innerWidth - 250)) + 50;
  const randomY = Math.floor(Math.random() * (window.innerHeight - 300)) + 50;
  
  // Create new note
  const newNote = {
    id: Date.now(), // Use timestamp as ID
    title,
    content,
    color,
    position: { x: randomX, y: randomY }
  };
  
  // Add to existing notes
  const updatedNotes = [...notes, newNote];
  
  // Save to localStorage
  localStorage.setItem('pinnedNotes', JSON.stringify(updatedNotes));
  
  // Return the new note ID in case it's needed
  return newNote.id;
};

// Helper function to remove a note programmatically
export const removePinnedNote = (noteId) => {
  // Get existing notes
  const savedNotes = localStorage.getItem('pinnedNotes');
  if (!savedNotes) return false;
  
  const notes = JSON.parse(savedNotes);
  const updatedNotes = notes.filter(note => note.id !== noteId);
  
  // Save to localStorage
  localStorage.setItem('pinnedNotes', JSON.stringify(updatedNotes));
  
  return true;
};

const PinnedNotes = () => {
  // Default notes data
  const defaultNotes = [
    {
      id: 1,
      title: "",
      content: "I KNOW YOU ARE READING THIS. YOU DON'T PUSH ME TO THE LIMIT. I'M NOT GONNA STOP UNTIL I GET THE TRUTH.",
      color: "yellow",
      position: { x: 120, y: 80 }
    },
    {
      id: 2,
      title: "Video ideas",
      content: "1. Scamers using AI, 2. Drink & Eat what we affiliate then slow die - influencers don't care about your health, 3. Your Time for Money - how influencers waste your life",
      color: "blue",
      position: { x: 400, y: 200 }
    },
    {
      id: 3,
      title: "Grocery list",
      content: "1. 2x eggs, 2. 1x bread, 3. 1x milk, 4. 1x apple, 5. 1x banana, 6. 1x orange, 7. 1x chicken, 8. 1x fish, 9. 1x beef, 10. 1x pork, 11. 1x rice, 12. 1x pasta, 13. 1x potato, 14. 1x onion, 15. 1x garlic, 16. 1x salt, 17. 1x pepper, 18. 1x sugar, 19. 1x coffee, 20. 1x tea",
      color: "pink",
      position: { x: 220, y: 350 }
    }
  ];

  // Load notes from localStorage or use defaults
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('pinnedNotes');
    return savedNotes ? JSON.parse(savedNotes) : defaultNotes;
  });

  // This would track which note is being dragged
  const [draggedNote, setDraggedNote] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [expanded, setExpanded] = useState(null);

  // Only show notes when user is logged in
  const wallLocked = useSelector((state) => state.wallpaper.locked);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('pinnedNotes', JSON.stringify(notes));
  }, [notes]);

  // Listen for changes to localStorage from other components
  useEffect(() => {
    const handleStorageChange = () => {
      const savedNotes = localStorage.getItem('pinnedNotes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    };

    // Add event listener
    window.addEventListener('storage', handleStorageChange);
    
    // Clean up
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Handle starting to drag a note
  const handleDragStart = (e, note) => {
    const boundingRect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - boundingRect.left;
    const offsetY = e.clientY - boundingRect.top;
    
    setDraggedNote(note.id);
    setDragOffset({ x: offsetX, y: offsetY });
  };

  // Handle dragging a note
  const handleDrag = (e) => {
    if (draggedNote === null) return;
    
    const updatedNotes = notes.map(note => {
      if (note.id === draggedNote) {
        return {
          ...note,
          position: {
            x: e.clientX - dragOffset.x,
            y: e.clientY - dragOffset.y
          }
        };
      }
      return note;
    });
    
    setNotes(updatedNotes);
  };

  // Handle finishing dragging a note
  const handleDragEnd = () => {
    setDraggedNote(null);
  };

  // Toggle expanded state of a note
  const toggleExpand = (noteId) => {
    if (expanded === noteId) {
      setExpanded(null);
    } else {
      setExpanded(noteId);
    }
  };

  // Handle removing a note
  const handleRemoveNote = (e, noteId) => {
    e.stopPropagation(); // Prevent toggle expand
    const updatedNotes = notes.filter(note => note.id !== noteId);
    setNotes(updatedNotes);
  };

  // Don't render anything if the screen is locked
  if (wallLocked) return null;

  return (
    <div className="pinned-notes-container">
      {notes.map(note => (
        <div
          key={note.id}
          className={`pinned-note ${note.color} ${expanded === note.id ? 'expanded' : ''} ${draggedNote === note.id ? 'dragging' : ''}`}
          style={{
            left: note.position.x + 'px',
            top: note.position.y + 'px',
          }}
          onMouseDown={(e) => handleDragStart(e, note)}
          onMouseMove={handleDrag}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          <div className="note-header" onClick={() => toggleExpand(note.id)}>
            <div className="note-title">{note.title}</div>
            <div className="note-controls">
              <span className="minimize-icon">—</span>
              <span className="close-icon" onClick={(e) => handleRemoveNote(e, note.id)}>×</span>
            </div>
          </div>
          <div className="note-content">
            {note.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PinnedNotes; 