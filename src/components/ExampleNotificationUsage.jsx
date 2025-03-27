import React from 'react';
import { showNotification, simulateBackendNotification } from '../utils/notifications';

/**
 * Example component demonstrating how to use notifications
 * NOTE: This component is for demonstration purposes only and doesn't need to be added to your app
 */
const ExampleNotificationUsage = () => {
  // Example 1: Simple notification
  const showSimpleNotification = () => {
    showNotification({
      title: 'Simple Notification',
      message: 'This is a basic notification with default settings.',
      icon: 'info'
    });
  };

  // Example 2: Notification with buttons and actions
  const showActionNotification = () => {
    showNotification({
      title: 'Action Required',
      message: 'Do you want to open File Explorer?',
      icon: 'explorer',
      buttons: [
        {
          text: 'Open',
          action: 'EXPLORER' // Direct app action
        },
        {
          text: 'Cancel',
          action: () => console.log('Cancelled action') // Function action
        }
      ],
      time: 8000 // 8 seconds
    });
  };

  // Example 3: Notification with custom icon and longer duration
  const showLongNotification = () => {
    showNotification({
      title: 'Download Complete',
      message: 'Your file has been successfully downloaded.',
      icon: 'faDownload', // FontAwesome icon
      time: 10000 // 10 seconds
    });
  };

  // Example 4: Simulating a backend-triggered notification
  const triggerBackendNotification = () => {
    simulateBackendNotification({
      title: 'New Message',
      message: 'You have received a new message from the server.',
      icon: 'mail',
      buttons: [
        {
          text: 'View',
          action: {
            type: 'EXTERNAL',
            payload: 'mailto:example@example.com'
          }
        }
      ]
    });
  };

  return (
    <div>
      <h2>Notification Examples</h2>
      <button onClick={showSimpleNotification}>Show Simple Notification</button>
      <button onClick={showActionNotification}>Show Action Notification</button>
      <button onClick={showLongNotification}>Show Long Notification</button>
      <button onClick={triggerBackendNotification}>Simulate Backend Notification</button>
    </div>
  );
};

export default ExampleNotificationUsage; 