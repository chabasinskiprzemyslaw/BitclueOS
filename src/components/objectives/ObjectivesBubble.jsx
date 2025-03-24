import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Icon } from '../../utils/general';
import './objectives.scss';

const ObjectivesBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(null);
  const [objectives, setObjectives] = useState([
    { id: 1, text: "Find the hidden message in the email", completed: false, hint: "Check the email attachments carefully" },
    { id: 2, text: "Decode the encrypted file", completed: false, hint: "Look for patterns in the file content" },
    { id: 3, text: "Identify the suspicious user", completed: false, hint: "Check the user's recent activity" },
    { id: 4, text: "Locate the secret folder", completed: false, hint: "Search in system directories" },
  ]);

  const toggleObjective = (id) => {
    setObjectives(objectives.map(obj => 
      obj.id === id ? { ...obj, completed: !obj.completed } : obj
    ));
  };

  const toggleHint = (id) => {
    setShowHint(showHint === id ? null : id);
  };

  return (
    <div className="objectives-bubble">
      <div 
        className="bubble-trigger"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icon src="objectives" width={24} />
      </div>
      
      {isOpen && (
        <div className="objectives-panel">
          <h3>Investigation Objectives</h3>
          <div className="objectives-list">
            {objectives.map(objective => (
              <div key={objective.id} className="objective-item">
                <div className="objective-content">
                  <input
                    type="checkbox"
                    checked={objective.completed}
                    onChange={() => toggleObjective(objective.id)}
                  />
                  <span className={objective.completed ? 'completed' : ''}>
                    {objective.text}
                  </span>
                </div>
                <button 
                  className="hint-button"
                  onClick={() => toggleHint(objective.id)}
                >
                  <Icon src="hint" width={16} />
                </button>
                {showHint === objective.id && (
                  <div className="hint-content">
                    {objective.hint}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ObjectivesBubble; 