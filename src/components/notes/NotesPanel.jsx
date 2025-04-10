import React, { useState, useEffect } from 'react';
import { Icon } from '../../utils/general';
import { getNotes, markNotesAsRead } from '../../services/notesService';
import { useNotesSignalR } from './useNotesSignalR';
import './notes.scss';

// Function to safely format note content with line breaks
const formatNoteContent = (content) => {
  if (!content) return '';
  
  // Replace newlines with <br> tags
  const formattedContent = content
    .replace(/\n/g, '<br>')
    .replace(/\r/g, '');
    
  return formattedContent;
};

const NotesPanel = ({ isOpen, onClose, onNewNotes }) => {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  const scenarioId = localStorage.getItem('selected_scenario');
  const userInfo = JSON.parse(localStorage.getItem('user_info'));
  const userIdentityId = userInfo?.id;

  // Handle receiving new note in real-time
  const handleNewNote = (note) => {

    // Notify parent component of new notes
    if (onNewNotes) {
      onNewNotes();
    }

    setNotes(currentNotes => {
      // Check if note already exists
      const existingIndex = currentNotes.findIndex(n => n.id === note.id);
      
      if (existingIndex >= 0) {
        // Update existing note
        const updatedNotes = [...currentNotes];
        updatedNotes[existingIndex] = {
          ...updatedNotes[existingIndex],
          content: note.content,
          sourceDescription: note.sourceDescription,
          timestamp: note.timestamp,
          isNew: true
        };
        return updatedNotes;
      } else {
        // Add new note
        return [...currentNotes, {
          id: note.id,
          content: note.content,
          sourceDescription: note.sourceDescription,
          timestamp: note.timestamp,
          isNew: true
        }];
      }
    });
  };

  // Setup SignalR connection for real-time note updates
  useNotesSignalR({
    isAuthenticated: !!userIdentityId,
    userIdentityId,
    setConnectionStatus,
    onNewNote: handleNewNote
  });

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getNotes(scenarioId, userIdentityId);
        
        // Transform API data to match component state
        const transformedNotes = data.map(note => ({
          id: note.id,
          content: note.content,
          sourceDescription: note.sourceDescription,
          timestamp: note.timestamp,
          isNew: note.isNew
        }));
        
        // Sort notes by timestamp (newest first)
        transformedNotes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        setNotes(transformedNotes);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch notes:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchNotes();
    }
  }, [scenarioId, userIdentityId, isOpen]);

  // Mark notes as read when panel is opened
  useEffect(() => {
    if (isOpen && notes.some(note => note.isNew)) {
      const markAsRead = async () => {
        try {
          // Mark each new note as read
          const newNotes = notes.filter(note => note.isNew);
          
          // Process each new note individually
          for (const note of newNotes) {
            await markNotesAsRead(scenarioId, note.id);
          }
          
          // Update local state to reflect that notes are no longer new
          setNotes(currentNotes => 
            currentNotes.map(note => ({
              ...note,
              isNew: false
            }))
          );
        } catch (err) {
          console.error('Failed to mark notes as read:', err);
        }
      };
      
      markAsRead();
    }
  }, [isOpen, scenarioId, notes]);

  // Helper to format date
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Helper to get appropriate icon based on source
  const getSourceIcon = (sourceDescription) => {
    if (!sourceDescription) return 'note';
    
    const source = sourceDescription.toLowerCase();
    if (source.includes('chat') || source.includes('message')) return 'chat';
    if (source.includes('file') || source.includes('document')) return 'file';
    if (source.includes('email')) return 'mail';
    return 'note';
  };

  if (!isOpen) return null;

  return (
    <div className="notes-panel">
      <div className="notes-header">
        <h3>Investigation Notes</h3>
        <button className="close-button" onClick={onClose}>
          <Icon src="close" width={16} />
        </button>
      </div>
      
      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading notes...</p>
        </div>
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>
        </div>
      ) : (
        <div className="notes-list">
          {notes.length === 0 ? (
            <div className="empty-state">
              <p>No notes available yet</p>
            </div>
          ) : (
            notes.map(note => (
              <div key={note.id} className={`note-item ${note.isNew ? 'new-note' : ''}`}>
                <div className="note-content">
                  <div 
                    className="note-text"
                    dangerouslySetInnerHTML={{ __html: formatNoteContent(note.content) }}
                  ></div>
                  <div className="note-meta">
                    {note.sourceDescription && (
                      <span className="note-source">{note.sourceDescription}</span>
                    )}
                    <span className="note-timestamp">{formatDate(note.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotesPanel; 