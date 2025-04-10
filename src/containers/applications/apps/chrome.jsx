"use client";

import React, { useState, useEffect, useRef, useReducer, useCallback } from "react";
import { MoreVertical, Bookmark, Clock, X } from "lucide-react";
import { useSelector } from "react-redux";
import browserReducer, { initialState } from "../../../reducers/browser";
import { DropdownMenu } from "./dropdown-menu";
import { NavigationBar } from "./navigation-bar";
import { TabBar } from "./tab-bar";
import { ToolBar } from "../../../utils/general";
import internalDNS, { 
  getSelectedScenario, 
  getBrowserHistory, 
  saveBrowserHistory,
  initializeHistoryWithSamples 
} from "../../pages/internalDNS";

// Custom styles for hiding scrollbars but keeping functionality
const scrollbarStyles = `
  .hide-scrollbar::-webkit-scrollbar {
    height: 3px;
    width: 3px;
  }
  
  .hide-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .hide-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 20px;
  }
  
  .hide-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
  }
`;

const NotFoundPage = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">404</h1>
    <p>Page not found</p>
  </div>
);

// History tracking for recently visited sites
const useHistory = () => {
  const [history, setHistory] = useState([]);
  const maxHistoryItems = 5;
  
  const addToHistory = useCallback((url) => {
    if (!url) return;
    
    setHistory(prev => {
      // Remove if already exists
      const filtered = prev.filter(item => item !== url);
      // Add to the beginning
      const updated = [url, ...filtered];
      // Limit to max items
      return updated.slice(0, maxHistoryItems);
    });
  }, []);
  
  return { history, addToHistory };
};

// Bookmarks bar component
const BookmarksBar = React.memo(({ onNavigate, recentHistory = [] }) => {
  const bookmarkSites = Object.keys(internalDNS);
  const [selectedScenario, setSelectedScenario] = useState("");
  
  useEffect(() => {
    // Get the selected scenario from localStorage
    const scenario = getSelectedScenario();
    setSelectedScenario(scenario);
  }, []);
  
  // Combine bookmarked sites with recent history for quick access
  const displayedSites = [...new Set([...recentHistory, ...bookmarkSites])];

  return (
    <div className="flex items-center px-2 py-1 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
      <Bookmark className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
      <div className="flex space-x-1 overflow-x-auto hide-scrollbar">
        {displayedSites.map((site) => (
          <button
            key={site}
            onClick={() => onNavigate(site)}
            className="px-3 py-1 text-xs rounded hover:bg-gray-200 dark:hover:bg-gray-700 whitespace-nowrap text-gray-800 dark:text-gray-200"
            title={site}
          >
            {site}
          </button>
        ))}
      </div>
      {selectedScenario && (
        <div className="ml-auto px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
          Scenario: {selectedScenario}
        </div>
      )}
    </div>
  );
});

// Add displayName for React.memo component
BookmarksBar.displayName = "BookmarksBar";

// History Panel component
const HistoryPanel = React.memo(({ isOpen, onClose, onNavigate }) => {
  const [historyItems, setHistoryItems] = useState([]);
  
  useEffect(() => {
    if (isOpen) {
      // Load history when panel opens
      const history = getBrowserHistory();
      setHistoryItems(history);
      
      // If history is empty, initialize with samples
      if (history.length === 0) {
        const samples = initializeHistoryWithSamples();
        setHistoryItems(samples);
      }
    }
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="absolute top-0 right-0 w-96 h-full bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 z-10 shadow-lg overflow-auto">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
          <h2 className="text-lg font-semibold">History</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
        >
          <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>
      </div>
      
      <div className="p-4">
        {historyItems.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-10 w-10 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No browsing history yet</p>
            <button 
              onClick={() => {
                const samples = initializeHistoryWithSamples();
                setHistoryItems(samples);
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Load example history
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {historyItems.map((item, index) => (
              <li 
                key={index} 
                className="py-2"
              >
                <button
                  onClick={() => {
                    onNavigate(item.url);
                    onClose();
                  }}
                  className="w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded"
                >
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.displayDate}</p>
                  <p className="text-gray-800 dark:text-gray-200">{item.url}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
});

HistoryPanel.displayName = "HistoryPanel";

export const Chrome = () => {
  const [state, dispatch] = useReducer(browserReducer, initialState);
  const wnapp = useSelector((state) => state.apps.chrome);
  const menuRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const { history, addToHistory } = useHistory();
  const loadingTimeoutRef = useRef(null);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);

  // Inject custom styles on mount
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = scrollbarStyles;
    document.head.appendChild(styleEl);
    
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // Initialize history with sample entries
  useEffect(() => {
    // Initialize history with sample entries from internalDNS
    initializeHistoryWithSamples();
  }, []);

  // Handle outside clicks for menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        dispatch({ type: "TOGGLE_MENU" });
      }
    }

    if (state.isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [state.isMenuOpen, dispatch]);

  // Clean up any active timeouts on unmount
  useEffect(() => {
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  // Updated URL change handler to save to browser history
  const handleUrlChange = useCallback((url) => {
    if (url === currentUrl && !loading) return;
    
    // Clear any existing timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    setLoading(true);
    setCurrentUrl(url);
    
    // Add to history
    addToHistory(url);
    
    // Save to browser history
    saveBrowserHistory(url);
    
    // Use a ref to store the timeout
    loadingTimeoutRef.current = setTimeout(() => {
      setLoading(false);
      const page = internalDNS[url] || NotFoundPage;
      setActiveTab(() => page);
      loadingTimeoutRef.current = null;
    }, 2000);
  }, [currentUrl, loading, addToHistory]);

  // Toggle history panel
  const toggleHistoryPanel = useCallback(() => {
    setIsHistoryPanelOpen(prev => !prev);
  }, []);

  return (
    <div
      className="chrome floatTab dpShad dark relative"
      data-size={wnapp.size}
      data-max={wnapp.max}
      id={wnapp.icon + "App"}
      style={{
        ...(wnapp.size == "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name="Web browser"
      />
      <TabBar />
      <NavigationBar 
        onUrlChange={handleUrlChange} 
        initialUrl={currentUrl} 
        onHistoryClick={toggleHistoryPanel}
      />
      <BookmarksBar onNavigate={handleUrlChange} recentHistory={history} />
      <div className="flex-1 bg-white text-black dark:text-white overflow-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="loader">Loading...</div>
          </div>
        ) : (
          activeTab && (typeof activeTab === 'function') ? (
            React.createElement(activeTab)
          ) : null
        )}
      </div>
      <div ref={menuRef} className="relative">
        <button
          onClick={() => dispatch({ type: "TOGGLE_MENU" })}
          className="absolute top-[-2.5rem] right-4 p-2 hover:bg-gray-700 rounded-full"
        >
          <MoreVertical className="h-4 w-4 text-gray-300" />
        </button>
        {state.isMenuOpen && <DropdownMenu onHistoryClick={toggleHistoryPanel} />}
      </div>
      
      <HistoryPanel 
        isOpen={isHistoryPanelOpen} 
        onClose={() => setIsHistoryPanelOpen(false)} 
        onNavigate={handleUrlChange}
      />
    </div>
  );
};
