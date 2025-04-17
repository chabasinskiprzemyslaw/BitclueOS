import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToolBar } from "../../../utils/general";
import { nanoid } from "nanoid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faPalette, faThumbtack, faWindowRestore, faXmark } from "@fortawesome/free-solid-svg-icons";
import "./stickynotes.scss";

// Store notes in a shared variable to access across components
let sharedNotes = [];
let sharedDispatch = null;
let noteUpdateCallbacks = [];

// Helper function to register callbacks for note updates
export const registerNoteUpdateCallback = (callback) => {
  noteUpdateCallbacks.push(callback);
};

// Helper function to update notes
const updateNotes = (notes) => {
  sharedNotes = notes;
  localStorage.setItem("win11_stickynotes", JSON.stringify(notes));
  // Call all registered callbacks
  noteUpdateCallbacks.forEach(callback => callback(notes));
};

// MiniNote component to be shown on desktop
export const MiniNote = ({ note, onClose, onEdit }) => {
  if (!note) return null;
  
  return (
    <div 
      className="miniNote dpShad" 
      style={{ backgroundColor: note.color }}
      data-pinned={note.pinned}
    >
      <div className="miniNoteToolbar">
        <span className="miniNoteTitle">Sticky Note</span>
        <div className="miniNoteActions">
          <button onClick={onEdit} title="Edit in Sticky Notes">
            <FontAwesomeIcon icon={faWindowRestore} />
          </button>
          <button onClick={onClose} title="Close">
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>
      </div>
      <div className="miniNoteContent">
        {note.content}
      </div>
    </div>
  );
};

// Open the Sticky Notes application
export const openStickyNotes = (noteId) => {
  if (sharedDispatch) {
    if (noteId) {
      // Set active note - we'll need to handle this separately
      // by iterating through component instances
      noteUpdateCallbacks.forEach(callback => {
        if (typeof callback === 'function') {
          callback(sharedNotes, noteId);
        }
      });
    }
    sharedDispatch({ type: "STICKYNOTES", payload: "full" });
  }
};

// Close a pinned note
export const closePinnedNote = (noteId) => {
  const updatedNotes = sharedNotes.map((note) => 
    note.id === noteId ? { ...note, pinned: false } : note
  );
  updateNotes(updatedNotes);
};

// Render pinned notes component for desktop
// This will be used in App.jsx
export const PinnedNotes = () => {
  const [, forceUpdate] = useState({});
  
  useEffect(() => {
    // Register callback to update this component when notes change
    const callback = () => forceUpdate({});
    registerNoteUpdateCallback(callback);
    
    return () => {
      // Remove callback on unmount
      noteUpdateCallbacks = noteUpdateCallbacks.filter(cb => cb !== callback);
    };
  }, []);
  
  const pinnedNotes = sharedNotes.filter(note => note.pinned);
  
  return (
    <div className="pinnedNotesContainer">
      {pinnedNotes.map(note => (
        <MiniNote 
          key={note.id}
          note={note}
          onClose={() => closePinnedNote(note.id)}
          onEdit={() => openStickyNotes(note.id)}
        />
      ))}
    </div>
  );
};

// Generate a random pastel color
const getRandomColor = () => {
  const colors = [
    "#ffe66d", // yellow
    "#ffcc80", // orange
    "#ef9a9a", // red
    "#ce93d8", // purple
    "#90caf9", // blue
    "#a5d6a7", // green
    "#b0bec5", // gray
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};

// Main Sticky Notes component
export const StickyNotes = () => {
  const wnapp = useSelector((state) => state.apps.stickynotes);
  const dispatch = useDispatch();
  
  // Store dispatch for use in other components
  sharedDispatch = dispatch;
  
  // Get notes from localStorage or initialize with a default note
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("win11_stickynotes");
    let initialNotes;
    if (savedNotes) {
      initialNotes = JSON.parse(savedNotes);
    } else {
      initialNotes = [
        {
          id: nanoid(),
          content: "Welcome to Sticky Notes! Type your notes here...",
          color: "#ffe66d",
          pinned: true, // Pin the first note by default
        },
      ];
    }
    sharedNotes = initialNotes;
    return initialNotes;
  });
  
  const [activeNote, setActiveNote] = useState(notes[0]?.id || null);
  
  // Register a callback to set the active note when opened from a pinned note
  useEffect(() => {
    const callback = (updatedNotes, noteId) => {
      if (noteId) {
        setActiveNote(noteId);
      }
    };
    registerNoteUpdateCallback(callback);
    
    return () => {
      // Remove callback on unmount
      noteUpdateCallbacks = noteUpdateCallbacks.filter(cb => cb !== callback);
    };
  }, []);
  
  // Save notes to shared state and localStorage whenever they change
  useEffect(() => {
    updateNotes(notes);
  }, [notes]);
  
  // Find the currently active note
  const currentNote = notes.find((note) => note.id === activeNote) || notes[0];
  
  // Create a new note
  const createNewNote = () => {
    const newNote = {
      id: nanoid(),
      content: "",
      color: getRandomColor(),
      pinned: false,
    };
    
    setNotes([...notes, newNote]);
    setActiveNote(newNote.id);
  };
  
  // Handle text change in the active note
  const updateNoteContent = (content) => {
    setNotes(
      notes.map((note) => 
        note.id === activeNote ? { ...note, content } : note
      )
    );
  };
  
  // Delete the active note
  const deleteNote = () => {
    if (notes.length <= 1) {
      // Don't delete the last note
      return;
    }
    
    const newNotes = notes.filter((note) => note.id !== activeNote);
    setNotes(newNotes);
    setActiveNote(newNotes[0]?.id || null);
  };
  
  // Change the color of the active note
  const changeColor = () => {
    setNotes(
      notes.map((note) => 
        note.id === activeNote ? { ...note, color: getRandomColor() } : note
      )
    );
  };
  
  // Toggle pin status for the active note
  const togglePin = () => {
    setNotes(
      notes.map((note) => 
        note.id === activeNote ? { ...note, pinned: !note.pinned } : note
      )
    );
  };
  
  // Return null if the app is hidden
  if (wnapp.hide) return null;
  
  return (
    <div
      className="stickynotes floatTab dpShad"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size == "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      id={wnapp.icon + "App"}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name="Sticky Notes"
      />
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="noteToolbar">
          <button className="noteBtn" onClick={createNewNote} title="New note">
            <FontAwesomeIcon icon={faPlus} />
          </button>
          <button className="noteBtn" onClick={deleteNote} title="Delete note" disabled={notes.length <= 1}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
          <button className="noteBtn" onClick={changeColor} title="Change color">
            <FontAwesomeIcon icon={faPalette} />
          </button>
          <button 
            className={`noteBtn ${currentNote?.pinned ? 'active' : ''}`} 
            onClick={togglePin} 
            title={currentNote?.pinned ? "Unpin from desktop" : "Pin to desktop"}
          >
            <FontAwesomeIcon icon={faThumbtack} />
          </button>
        </div>
        <div className="notesContainer">
          <div className="notesList">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`noteItem ${note.id === activeNote ? "active" : ""} ${note.pinned ? "pinned" : ""}`}
                onClick={() => setActiveNote(note.id)}
                style={{ backgroundColor: note.color }}
              >
                <span className="noteItemText">{note.content.substring(0, 15) || "Empty note..."}</span>
                {note.pinned && <FontAwesomeIcon icon={faThumbtack} className="pinIcon" />}
              </div>
            ))}
          </div>
          <div 
            className="activeNote" 
            style={{ backgroundColor: currentNote?.color }}
          >
            <textarea
              value={currentNote?.content || ""}
              onChange={(e) => updateNoteContent(e.target.value)}
              placeholder="Type your note here..."
              className="noteTextarea"
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 