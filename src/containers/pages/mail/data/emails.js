export const sampleEmails = [
  {
    id: "1",
    sender: "GitHub",
    senderEmail: "noreply@github.com",
    subject: "Your daily digest",
    preview: "See what's happening in your repositories...",
    timestamp: "10:30 AM",
    read: false,
    category: "primary",
    content: `
        <h2>Your GitHub Daily Digest</h2>
        <p>Here's what happened in your repositories today:</p>
        <ul>
          <li>3 new pull requests were opened</li>
          <li>5 issues were closed</li>
          <li>Your repository stars increased by 12</li>
        </ul>
        <p>Visit GitHub to see more details about your activity.</p>
        <p>Best regards,<br>GitHub Team</p>
      `,
  },
  {
    id: "2",
    sender: "LinkedIn",
    subject: "New job opportunities for you",
    preview: "Based on your profile, we found these matches...",
    timestamp: "9:15 AM",
    read: true,
    category: "primary",
  },
  {
    id: "3",
    sender: "Amazon",
    subject: "Your order has shipped!",
    preview: "Track your package...",
    timestamp: "8:45 AM",
    read: false,
    category: "promotions",
  },
  {
    id: "4",
    sender: "Netflix",
    subject: "New shows you might like",
    preview: "Check out our latest releases...",
    timestamp: "Yesterday",
    read: true,
    category: "promotions",
  },
  {
    id: "5",
    sender: "Twitter",
    subject: "Your weekly digest",
    preview: "See what you missed...",
    timestamp: "Yesterday",
    read: true,
    category: "social",
  },
  {
    id: "6",
    sender: "Facebook",
    subject: "New friend request",
    preview: "Someone wants to connect...",
    timestamp: "Yesterday",
    read: false,
    category: "social",
  },
  {
    id: "7",
    sender: "System",
    subject: "Security alert",
    preview: "New sign-in from unknown device...",
    timestamp: "Feb 7",
    read: false,
    category: "updates",
  },
  {
    id: "8",
    sender: "Admin",
    subject: "System maintenance",
    preview: "Scheduled downtime...",
    timestamp: "Feb 7",
    read: true,
    category: "updates",
  },
];
