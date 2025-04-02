import { addPinnedNote, removePinnedNote } from '../components/PinnedNotes';

/**
 * This file provides examples of how to integrate pinned notes into your game's
 * story/plot progression. These functions can be called from various parts of the
 * application when specific story events are triggered.
 */

// Example: Adding a note when player discovers a clue
export const addClueDiscoveredNote = () => {
  addPinnedNote(
    "New Clue Found", 
    "The deleted emails contained references to Project Cerberus. Need to find out what this is.",
    "yellow"
  );
};

// Example: Adding a note when player completes a milestone
export const addMilestoneNote = () => {
  addPinnedNote(
    "Investigation Progress", 
    "I've gained access to the encrypted files. Three more security levels to go before I can access the main database.",
    "blue"
  );
};

// Example: Adding a plot point note
export const addPlotTwistNote = () => {
  addPinnedNote(
    "Something's Wrong", 
    "The security breach might have been an inside job. Check personnel files for anyone hired in the last 3 months.",
    "pink"
  );
};

// Example: Adding a warning note
export const addWarningNote = () => {
  addPinnedNote(
    "WARNING", 
    "Someone is tracking my activity on the network. Need to be more careful and use a VPN for future access.",
    "green"
  );
};

// Example: Using notes for tutorial guidance
export const addTutorialNote = () => {
  const noteId = addPinnedNote(
    "How To Investigate", 
    "Look for clues in emails, documents, and chat logs. Sometimes, important information is hidden in plain sight.",
    "blue"
  );
  
  // You could automatically remove this note after a certain time
  setTimeout(() => {
    removePinnedNote(noteId);
  }, 60000); // Remove after 1 minute
};

// Example: Adding notes based on game events or triggers
export const handleGameEvent = (eventType, eventData) => {
  switch(eventType) {
    case 'EMAIL_READ':
      if (eventData.emailId === 'secret-project-memo') {
        addPinnedNote(
          "Secret Project", 
          "The memo mentions a secret project that's not in any official records. Look for more information in the archived files.",
          "yellow"
        );
      }
      break;
      
    case 'FILE_DOWNLOADED':
      if (eventData.fileName.includes('budget')) {
        addPinnedNote(
          "Financial Discrepancy", 
          "The budget report shows $2.3M allocated to 'Special Projects' but there's no detail on what this is for.",
          "pink"
        );
      }
      break;
      
    case 'ACHIEVEMENT_UNLOCKED':
      addPinnedNote(
        "Progress Update", 
        `Achievement unlocked: ${eventData.achievementName}. ${eventData.description}`,
        "green"
      );
      break;
      
    default:
      // No action for other event types
      break;
  }
}; 