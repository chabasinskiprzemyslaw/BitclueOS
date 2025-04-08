import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '../../utils/general';
import { getCurrentStepObjectives } from '../../services/storyEngineService';
import './objectives.scss';
import { useObjectiveSignalR } from './useObjectiveSignalR';

const ObjectivesBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(null);
  const [objectives, setObjectives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasNewObjectives, setHasNewObjectives] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [maxHeight, setMaxHeight] = useState(null);
  const objectivesPanelRef = useRef(null);

  const scenarioId = localStorage.getItem('selected_scenario');
  const userInfo = JSON.parse(localStorage.getItem('user_info'));
  const userIdentityId = userInfo?.id;

  // Handle receiving new objective in real-time
  const handleNewObjective = (objective) => {
    setObjectives(currentObjectives => {
      // Check if objective already exists
      const existingIndex = currentObjectives.findIndex(obj => obj.id === objective.id);
      
      if (existingIndex >= 0) {
        // Update existing objective
        const updatedObjectives = [...currentObjectives];
        updatedObjectives[existingIndex] = {
          ...updatedObjectives[existingIndex],
          text: objective.description,
          completed: objective.isCompleted,
          hint: objective.hint,
          completedOn: objective.completedOn,
          stepIndex: objective.stepIndex
        };
        return updatedObjectives;
      } else {
        // Add new objective and mark existing ones as completed
        // (assuming that when new objectives arrive, previous ones are completed)
        setHasNewObjectives(true);
        
        const updatedObjectives = currentObjectives.map(obj => ({
          ...obj,
          completed: true // Mark all existing objectives as completed
        }));
        
        return [...updatedObjectives, {
          id: objective.id,
          text: objective.description,
          completed: objective.isCompleted,
          hint: objective.hint,
          completedOn: objective.completedOn,
          stepIndex: objective.stepIndex
        }];
      }
    });
  };

  // Setup SignalR connection for real-time objective updates
  useObjectiveSignalR({
    isAuthenticated: !!userIdentityId,
    userIdentityId,
    setConnectionStatus,
    onNewObjective: handleNewObjective
  });

  // Calculate max height based on screen size
  useEffect(() => {
    const updateMaxHeight = () => {
      const screenHeight = window.innerHeight;
      setMaxHeight(screenHeight * 0.75); // 3/4 of the screen height
    };

    updateMaxHeight();
    window.addEventListener('resize', updateMaxHeight);
    
    return () => {
      window.removeEventListener('resize', updateMaxHeight);
    };
  }, []);

  useEffect(() => {
    const fetchObjectives = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getCurrentStepObjectives(scenarioId, userIdentityId);
        
        // Transform API data to match component state
        const transformedObjectives = data.map(obj => ({
          id: obj.id,
          text: obj.description,
          completed: obj.isCompleted,
          hint: obj.hint,
          completedOn: obj.completedOn,
          stepIndex: obj.stepIndex
        }));
        
        setObjectives(transformedObjectives);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch objectives:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchObjectives();
  }, [scenarioId, userIdentityId]);

  // Reset new objectives flag when opening the panel
  useEffect(() => {
    if (isOpen) {
      setHasNewObjectives(false);
    }
  }, [isOpen]);

  const toggleObjective = async (id) => {
    // TODO: Implement API call to update objective completion status
    setObjectives(objectives.map(obj => 
      obj.id === id ? { ...obj, completed: !obj.completed } : obj
    ));
  };

  const toggleHint = (id) => {
    setShowHint(showHint === id ? null : id);
  };

  // Sort objectives to show incomplete ones first
  const sortedObjectives = [...objectives].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });

  return (
    <div className="objectives-bubble">
      <div 
        className={`bubble-trigger ${hasNewObjectives ? 'has-new-objectives' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icon src="objectives" width={24} />
        {hasNewObjectives && <div className="notification-badge"></div>}
        <Icon src="help-circle" width={16} />
      </div>
      
      {isOpen && (
        <div className="objectives-panel" ref={objectivesPanelRef}>
          <h3>Investigation Objectives</h3>
          {isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading objectives...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>{error}</p>
            </div>
          ) : (
            <div 
              className="objectives-list" 
              style={{ 
                maxHeight: maxHeight ? `${maxHeight - 90}px` : 'auto', 
                overflowY: 'auto',
                paddingRight: '8px'
              }}
            >
              {sortedObjectives.map(objective => (
                <div 
                  key={objective.id} 
                  className={`objective-item ${objective.isNew ? 'new-objective' : ''} ${objective.completed ? 'completed' : ''}`}
                >
                  <div className="objective-content">
                    <span className={objective.completed ? 'completed' : ''}>
                      {objective.text}
                    </span>
                  </div>
                  {objective.hint && (
                    <button 
                      className="hint-button"
                      onClick={() => toggleHint(objective.id)}
                    >
                      <Icon src="hint" width={16} />
                      <span>Hint</span>
                    </button>
                  )}
                  {showHint === objective.id && objective.hint && (
                    <div className="hint-content">
                      {objective.hint}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ObjectivesBubble; 