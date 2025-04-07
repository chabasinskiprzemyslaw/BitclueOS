import React from 'react';
import { showNotification, simulateBackendNotification } from '../utils/notifications';
import { useDispatch } from 'react-redux';

/**
 * Example component demonstrating how to use notifications
 * NOTE: This component is for demonstration purposes only and doesn't need to be added to your app
 */
const ExampleNotificationUsage = () => {
  const dispatch = useDispatch();

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

  // Example of manually triggering a notification (for testing purposes)
  const triggerLocalNotification = () => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: `local-${Date.now()}`,
        title: 'Local Notification',
        message: 'This is a local notification triggered from the application',
        icon: 'bxs-bell',
        buttons: [
          {
            text: 'Dismiss',
            action: 'NOTIFICATION_DISMISSED'
          },
          {
            text: 'View',
            action: {
              type: 'OPEN_APP',
              payload: {
                app: 'settings',
                info: { isTriggerBackend: true }
              }
            }
          }
        ],
        time: 8000 // 8 seconds
      }
    });
  };

  // Example of manually triggering a notification that looks like it came from SignalR
  const simulateRealtimeNotification = () => {
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: `realtime-${Date.now()}`,
        title: 'Real-time Notification',
        message: 'This simulates a notification received via SignalR',
        icon: 'bxs-message-dots',
        buttons: [
          {
            text: 'Dismiss',
            action: 'NOTIFICATION_DISMISSED'
          },
          {
            text: 'Take Action',
            action: {
              type: 'OPEN_APP',
              payload: {
                app: 'mail',
                info: { isTriggerBackend: true, id: `realtime-${Date.now()}` }
              }
            }
          }
        ],
        time: 10000 // 10 seconds
      }
    });
  };

  return (
    <div className="example-notification-tools">
      <h3>Notification Test Tools</h3>
      <p>Use these buttons to test the notification system:</p>
      <div className="example-buttons">
        <button onClick={showSimpleNotification}>Show Simple Notification</button>
        <button onClick={showActionNotification}>Show Action Notification</button>
        <button onClick={showLongNotification}>Show Long Notification</button>
        <button onClick={triggerBackendNotification}>Simulate Backend Notification</button>
        <button onClick={triggerLocalNotification}>
          Trigger Local Notification
        </button>
        <button onClick={simulateRealtimeNotification}>
          Simulate Real-time Notification
        </button>
      </div>
    </div>
  );
};

export default ExampleNotificationUsage; 