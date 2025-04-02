import MyPage from "./myPage";
import GoogleClone from "./googleClone";
import Layout from "./mail/layout";
import AudioEditingGuide from "./audioEditingGuide";
import ExifGuide from "./exifGuide";
import ExifHidingGuide from "./exifHidingGuide";
import BuzzHub from "./buzzHub";
import QuickBite from "./quickBite";

// Helper function to get the selected scenario from localStorage
export const getSelectedScenario = () => {
  return localStorage.getItem("selected_scenario") || "";
};

// Helper functions for browser history
export const getBrowserHistory = () => {
  const savedHistory = localStorage.getItem("browser_history");
  return savedHistory ? JSON.parse(savedHistory) : [];
};

export const saveBrowserHistory = (url) => {
  if (!url) return;
  
  const history = getBrowserHistory();
  const timestamp = new Date();
  const newEntry = {
    url,
    timestamp: timestamp.toISOString(),
    displayDate: `${timestamp.toLocaleDateString()} ${timestamp.toLocaleTimeString()}`
  };
  
  // Add to the beginning, limit to 20 entries
  const updatedHistory = [newEntry, ...history].slice(0, 20);
  localStorage.setItem("browser_history", JSON.stringify(updatedHistory));
};

// Function to initialize history with sample entries
export const initializeHistoryWithSamples = () => {
  const history = getBrowserHistory();
  
  // Only add sample entries if history is empty
  if (history.length === 0) {
    const sampleEntries = Object.keys(internalDNS).map((url, index) => {
      // Create timestamps with different dates for each entry
      const date = new Date();
      date.setDate(date.getDate() - index); // Each entry is one day older
      
      return {
        url,
        timestamp: date.toISOString(),
        displayDate: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
      };
    });
    
    localStorage.setItem("browser_history", JSON.stringify(sampleEntries));
    return sampleEntries;
  }
  
  return history;
};

// Base internal DNS mapping
const internalDNS = {
  "mypage.com": MyPage,
  "google.com": GoogleClone,
  "google.com/mail": Layout,
  "audio-guide.com": AudioEditingGuide,
  "exif-guide.com": ExifGuide,
  "techxplorer.com/forums/exif-hiding": ExifHidingGuide,
  "buzzhub.com": BuzzHub,
  "quickbite.com": QuickBite
};

export default internalDNS;