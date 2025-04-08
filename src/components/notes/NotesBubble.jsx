import React, { useState, useEffect } from 'react';
import { Icon } from '../../utils/general';
import NotesPanel from './NotesPanel';
import './notes.scss';

const NotesBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewNotes, setHasNewNotes] = useState(false);

  // Reset new notes flag when opening the panel
  useEffect(() => {
    if (isOpen) {
      setHasNewNotes(false);
    }
  }, [isOpen]);

  // Method to be called from NotesPanel when new notes arrive
  const onNewNotesReceived = () => {
    setHasNewNotes(true);
  };

  return (
    <div className="notes-bubble">
      <div 
        className={`bubble-trigger ${hasNewNotes ? 'has-new-notes' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icon src="notepad" width={24} />
        {hasNewNotes && <div className="notification-badge"></div>}
      </div>
      
      <NotesPanel 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        onNewNotes={onNewNotesReceived}
      />
    </div>
  );
};

export default NotesBubble; 