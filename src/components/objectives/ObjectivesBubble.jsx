import React, { useState, useEffect } from 'react';
import { Icon } from '../../utils/general';
import { getCurrentStepObjectives } from '../../services/storyEngineService';
import './objectives.scss';

const ObjectivesBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(null);
  const [objectives, setObjectives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const scenarioId = localStorage.getItem('selected_scenario');
  const userInfo = JSON.parse(localStorage.getItem('user_info'));

  const userIdentityId = userInfo?.id;

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

  const toggleObjective = async (id) => {
    // TODO: Implement API call to update objective completion status
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
                  {objective.hint && (
                    <button 
                      className="hint-button"
                      onClick={() => toggleHint(objective.id)}
                    >
                      <Icon src="hint" width={16} />
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