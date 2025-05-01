// Collection of static emails for the investigation game

const staticEmails = [
  {
    id: 'static-email-1',
    senderName: 'Katherine Newman',
    senderEmail: 'katherine.newman87@email.com',
    subject: 'Mr. Freeman - You Are AMAZING!',
    body: `Dear Mr. Freeman,

I have to write this because I watch every episode of yours, and I am truly impressed! What you do—exposing all these fraudsters and showing people how to protect themselves online—is simply incredible. You have such charisma and a way of speaking that makes even the most difficult topics understandable.

You are my idol and a model of how to fight for the truth. I admire your courage because I know you've stepped on the toes of many powerful players. Thanks to you, I feel safer on the internet and know what to watch out for.

Please don't change, and keep up the amazing work! Millions of people are counting on you!

With the greatest admiration,
Katherine Newman`,
    preview: "I have to write this because I watch every episode of yours, and I am truly impressed!",
    isRead: false,
    isNew: true,
    sentAt: "2023-11-15T09:45:30.000Z", // Fixed date for the investigation scenario
    recipients: [
      { type: 1, emailAddress: 'mr.expert@securitychannel.com' }
    ],
    folder: 'Inbox',
    isStatic: true,
    isHtml: false
  },
  {
    id: "static-email-2",
    senderName: "John Smith",
    senderEmail: "[email address removed]",
    subject: "THANK YOU! You Saved Me from Disaster!",
    body: `Dear Mr. Freeman,

I'm writing to you because I feel immense gratitude. I almost fell for that cryptocurrency scam with "guaranteed profits" that has been making the rounds lately. I was just about to transfer my money—my entire savings, really…

But the day before, I watched your latest video, where you explained in detail how this pyramid scheme works. Something clicked for me, so I double-checked, and… it all lined up! Your warning saved me at the last moment. I don't even know how to thank you!

You are our guardian angel in this digital jungle. Thank you, thank you, thank you!

Sincerely,  
John Smith`,
    preview: "I'm writing to you because I feel immense gratitude.",
    isRead: false,
    isNew: true,
    sentAt: "2023-11-15T09:50:45.000Z", // Fixed date for consistency
    recipients: [
      { type: 1, emailAddress: "mr.expert@securitychannel.com" }
    ],
    folder: "Inbox",
    isStatic: true,
    isHtml: false
  },
  {
    id: "static-email-3",
    senderName: "Martha Baczynska",
    senderEmail: "marta.baczynska@email.com",
    subject: "Urgent Request to Investigate 'Golden Tomorrow Invest'",
    body: `Dear Mr. Freeman,

I am writing to you on behalf of myself and a few friends with an urgent request for help. We've been closely following the activities of 'Golden Tomorrow Invest,' a company promising unrealistically high profits from investments in "innovative ecological technologies." Their website looks professional, but their consultants are extremely pushy and avoid giving clear answers about risks.

We have a strong feeling that this may be another malicious scam that takes away people’s hard-earned money. I know you specialize in such cases and have an incredible ability to expose shady entities. Could you take a closer look with your expert eye?

We suspect this might be another financial pyramid scheme, and only you have the tools and courage to publicly prove it before it’s too late. Many people have already invested, lured in by their grand promises.

Please, we ask you to look into this matter! We believe in you and your mission!

With hope for your help,  
Martha Baczynska`,
    preview: "I am writing to you on behalf of myself and a few friends with an urgent request for help.",
    isRead: false,
    isNew: true,
    sentAt: "2023-11-15T10:05:20.000Z", // Fixed date for consistency
    recipients: [
      { type: 1, emailAddress: "mr.expert@securitychannel.com" }
    ],
    folder: "Inbox",
    isStatic: true,
    isHtml: false
  },
  {
    id: "static-email-4",
    senderName: "Peter Zielinski",
    senderEmail: "piotr.zielinski.fan@email.com",
    subject: "Thank You for Creating This Community!",
    body: `Hey Freeman!

I just wanted to write a quick email to say thank you—not just for your videos and knowledge, but for the entire community you've built around your channel. I finally feel like I'm not alone in my concerns about the internet.

Thanks to you, I'm starting to understand all these threats that I had no idea about before. And reading the comments and discussions under your videos, I see how many people think the same way, wanting a safe and honest internet.

You give people strength and the feeling that together we can make a difference and fight against all the online mess.

Keep going and stay strong! I'm with you!  

Peter Z.`,
    preview: "I just wanted to write a quick email to say thank you—not just for your videos and knowledge, but for the entire community...",
    isRead: false,
    isNew: true,
    sentAt: "2023-11-15T10:15:30.000Z", // Fixed date for consistency
    recipients: [
      { type: 1, emailAddress: "mr.expert@securitychannel.com" }
    ],
    folder: "Inbox",
    isStatic: true,
    isHtml: false
},
{
  id: "static-email-5",
  senderName: "Anna Zielinska",
  senderEmail: "[email address removed]",
  subject: "Commercial Partnership Proposal - SecureNet VPN & Expert Truth Channel",
  body: `Dear Sir,

My name is Anna Zielinska, and I am the Marketing Manager at SecureNet VPN. For quite some time, we have been keenly observing the rapid growth of your channel, "Expert Truth," and the impressive reach and engagement of the community you have built.

The mission of your channel—educating people about cybersecurity and exposing online threats—aligns significantly with our brand’s values, which prioritize user security and privacy on the internet.

We see tremendous potential in a collaboration between SecureNet VPN and your channel. We believe that your authority and the trust your audience places in you make for an excellent platform to promote tools that enhance online security, such as our VPN service.

We would love to present you with a detailed proposal for a long-term partnership, including dedicated video content and other promotional opportunities. Would you be open to a phone conversation next week to discuss potential directions for this collaboration?

Sincerely,  
Anna Zielinska  
Marketing Manager  
SecureNet VPN`,
  preview: "My name is Anna Zielinska, and I am the Marketing Manager at SecureNet VPN...",
  isRead: false,
  isNew: true,
  sentAt: "2023-11-15T10:25:45.000Z", // Fixed date for consistency
  recipients: [
    { type: 1, emailAddress: "mr.expert@securitychannel.com" }
  ],
  folder: "Inbox",
  isStatic: true,
  isHtml: false
},
{
  id: "static-email-6",
  senderName: "[Expert's Name or Business Representative]",
  senderEmail: "[email address removed]",
  subject: "Performance Report - 'CyberProtection Plus' Campaign - May 2025",
  body: `Mr. Mark,

Attached is a detailed report on the results of the promotional campaign for the 'CyberProtection Plus' package on my channel in May 2025.

As you will see, the dedicated video titled 'The 5 Biggest Phishing Threats and How to Protect Yourself (with CyberProtection Plus)' achieved over 350,000 views in the first 7 days, with an engagement rate (likes + comments) of 6.8%. The affiliate link in the video description generated more than 1,200 clicks.

We are particularly pleased with the positive reception from viewers, who appreciated the practical advice and the seamless integration of information about your product as an effective solution.

We are confident that the campaign is meeting its intended goals and is positively influencing brand awareness for 'CyberProtection Plus' within our target audience.

Sincerely,  
[Expert's Name or Business Representative]  
Expert Truth`,
  preview: "Attached is a detailed report on the results of the promotional campaign for the 'CyberProtection Plus' package...",
  isRead: false,
  isNew: true,
  sentAt: "2023-11-15T10:35:50.000Z", // Fixed date for consistency
  recipients: [
    { type: 1, emailAddress: "mr.expert@securitychannel.com" }
  ],
  folder: "Inbox",
  isStatic: true,
  isHtml: false
},
{
  id: "static-email-7",
  senderName: "Krzysztof Nowicki",
  senderEmail: "[email address removed]",
  subject: "Sponsored Content Status - SafeGuard Antivirus",
  body: `Dear Mr. Expert,

I would like to gently inquire about the status of the sponsored video for SafeGuard Antivirus, which, according to our schedule, was set to be published this week.

As you know, the end of the quarter is approaching, and we are finalizing our major marketing campaign, "Safe Summer Online," in which your video was expected to play a significant role in reaching security-conscious users. We are eager for the publication to happen as soon as possible to fully leverage the synergy of our efforts.

Can we count on its release within the next 2–3 days? I would also appreciate a brief summary of how you plan to integrate the presentation of our new package, "SafeGuard Total Security"—we are hoping for a strong showcase of its advantages over competitors, as we discussed in our last conversation. Our team has prepared a few additional bullet points that might be helpful (attached).

Please let us know the status.

Best regards,  
Krzysztof Nowicki  
Brand Manager  
SafeGuard Antivirus`,
  preview: "I would like to gently inquire about the status of the sponsored video for SafeGuard Antivirus...",
  isRead: false,
  isNew: true,
  sentAt: "2023-11-15T10:45:20.000Z", // Fixed date for consistency
  recipients: [
    { type: 1, emailAddress: "mr.expert@securitychannel.com" }
  ],
  folder: "Inbox",
  isStatic: true,
  isHtml: false
},
{
  id: "static-email-8",
  senderName: "Law Office Wiercinski & Partners",
  senderEmail: "[email address removed]",
  subject: "PRE-LITIGATION NOTICE - Violation of Jan Kowalski's Personal Rights (Company 'Future Investments')",
  body: `Dear Sir,

Acting on behalf of our client, Mr. Jan Kowalski, conducting business under the company name 'Future Investments,' regarding the video material titled "[Expert's Video Title]" published on the 'Expert Truth' channel on [Publication Date], we hereby demand that you:

1. Immediately (within no more than 24 hours upon receiving this notice) remove the aforementioned video from YouTube and any other platforms where it has been shared.
2. Publish an apology on the 'Expert Truth' channel with content agreed upon with our law firm within 3 days of receiving this notice.
3. Pay our client the amount of 50,000 PLN (fifty thousand Polish zloty) as compensation for the harm caused by the violation of his personal rights, particularly his reputation and company goodwill, within 7 days of receiving this notice.

The statements made in your video are inaccurate, mislead the public, and constitute an unlawful violation of our client's personal rights, carrying elements of defamation (Article 212 of the Penal Code).

Failure to comply with this notice within the specified timeframes will result in immediate legal action without further warnings, exposing you to significant litigation costs.

Sincerely,  
[Signature of the Lawyer]  
Attorney Tomasz Wiercinski`,
  preview: "Acting on behalf of our client, Mr. Jan Kowalski...",
  isRead: false,
  isNew: true,
  sentAt: "2023-11-15T10:55:00.000Z", // Fixed date for consistency
  recipients: [
    { type: 1, emailAddress: "mr.expert@securitychannel.com" }
  ],
  folder: "Inbox",
  isStatic: true,
  isHtml: false
},
{
  id: "static-email-9",
  senderName: "UNKNOWN",
  senderEmail: "unknown@email.com",
  subject: "UNKNOWN",
  body: "You [vulgarism] lying piece of trash!!!! You think you're someone because you sit in front of your camera and ruin people's lives??? You showed my face, you told all those lies about my company!!! I lost everything because of you!!!!!! But it won't end like this, do you understand?????? You'll pay for what you did!!!!!!!!!!!!!!!!!! You think you're safe in your [fragment of the message is damaged - looks like an address or place name] ??? We've got our eyes on you. Every move you make. You better start looking behind you when you get into your ***[fragment illegible - looks like a car model or color]***. We'll see who has the last laugh. You'll regret the day you mentioned me!!!!!!!!!!!!! [End of message looks torn or damaged]",
  preview: "UNKNOWN",
  isRead: false,
  isNew: false,
  sentAt: "2023-11-15T11:05:00.000Z", // Fixed date for consistency
  recipients: [
    { type: 1, emailAddress: "mr.expert@securitychannel.com" }
  ],
  folder: "Inbox",
  isStatic: true,
  isHtml: false
},
{
  id: "static-email-9",
  senderName: "Elżbieta Gajewska",
  senderEmail: "[email address removed]",
  subject: "I Beg for Help - The 'Hope Loans' Video Is a Terrible Mistake!",
  body: `Dear Mr. Expert,

I am writing to you with tears in my eyes. I watched your video about the company 'Hope Loans,' where I worked as an ordinary office employee. I was portrayed as an accomplice to fraud, and parts of my conversation were taken out of context. I beg you, this is all a terrible mistake!

I myself was a victim of manipulation by my former boss! I had no idea about the full extent of his actions! In the attachments, I am sending you email correspondence between him and me, showing how I was deceived and that I myself raised concerns, which he ignored. I am also sending proof that I tried to warn some customers!

Since your video was published, my life has fallen apart. People point fingers at me, I have lost the chance to find a new job, and my children are being bullied at school. I beg you with all my heart, please verify this evidence and remove the video, or at least correct the information about me. You are destroying the life of an innocent person!

I plead for mercy and justice.

Desperate,  
Elżbieta Gajewska`,
  preview: "I am writing to you with tears in my eyes. I watched your video about the company 'Hope Loans,' where I worked...",
  isRead: false,
  isNew: true,
  sentAt: "2023-11-15T11:05:30.000Z", // Fixed date for consistency
  recipients: [
    { type: 1, emailAddress: "mr.expert@securitychannel.com" }
  ],
  folder: "Inbox",
  isStatic: true,
  isHtml: false
},
{
  id: "static-email-10",
  senderName: "Mediator",
  senderEmail: "[email address removed]",
  subject: "Meeting Proposal - EcoInvest Group Case",
  body: `Dear Sir,

I am writing in reference to your recent publication regarding the company "EcoInvest Group." While we appreciate your commitment to market transparency, we believe that in this case, some facts may have been unintentionally presented in a way that unfairly harms the company's reputation.

Instead of a public debate, which rarely serves either party well, we would like to propose a private meeting at a time and place convenient for you. We believe that in a calm discussion, we could clarify any inaccuracies.

We are also willing to discuss the possibility of… compensation for the negative consequences the company has unfortunately suffered due to your material. We understand that your work requires time and resources. Perhaps there is a way to find a solution that would be satisfactory for both sides and allow certain information to be… updated in the future. We are open to discussing a specific form of support for your work in exchange for, let’s say, a more nuanced presentation of the topic. We were considering an amount in the range of ***[fragment deliberately obscured or illegible - appears to be an attempt to conceal the exact sum]***, but we are flexible.

Please consider my proposal and provide feedback regarding the possibility of a meeting. We guarantee full discretion.

Sincerely,  
Mediator`,
  preview: "I am writing in reference to your recent publication regarding the company 'EcoInvest Group.'...",
  isRead: false,
  isNew: true,
  sentAt: "2023-11-15T11:15:40.000Z", // Fixed date for consistency
  recipients: [
    { type: 1, emailAddress: "mr.expert@securitychannel.com" }
  ],
  folder: "Inbox",
  isStatic: true,
  isHtml: false
},
{
  id: "static-email-11",
  senderName: "Expert Truth",
  senderEmail: "[email address removed]",
  subject: "Research - New Target: 'Finanse Maxima'",
  body: `Anna,

We're starting a new investigation. The target is 'Finanse Maxima' (internal link: search=finansemaxima.com). It looks like a classic get-rich-quick scheme, promising mountains of gold for nothing.

Please conduct standard OSINT research:

- Ownership connections and management (check KRS, LinkedIn, etc.).
- Company history, previous activities of key individuals.
- Customer reviews (forums, social media—look for complaints and negative feedback).
- Any publicly available financial data, regulator warnings (if any).

I need a preliminary report by the end of next week. Let me know how it's going.

Best,  
Expert Truth`,
  preview: "We're starting a new investigation. The target is 'Finanse Maxima'...",
  isRead: false,
  isNew: true,
  sentAt: "2023-11-15T11:25:50.000Z", // Fixed date for consistency
  recipients: [
    { type: 1, emailAddress: "anna.nowak@securitychannel.com" }
  ],
  folder: "Inbox",
  isStatic: true,
  isHtml: false
}









];

export default staticEmails; 