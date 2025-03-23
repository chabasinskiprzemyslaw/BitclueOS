"use client";

import React, { useState, useEffect, useRef, useReducer, useCallback } from "react";
import { MoreVertical, Bookmark } from "lucide-react";
import { useSelector } from "react-redux";
import browserReducer, { initialState } from "../../../reducers/browser";
import { DropdownMenu } from "./dropdown-menu";
import { NavigationBar } from "./navigation-bar";
import { TabBar } from "./tab-bar";
import { ToolBar } from "../../../utils/general";
import internalDNS, { getSelectedScenario } from "../../pages/internalDNS";

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

export const Chrome = () => {
  const [state, dispatch] = useReducer(browserReducer, initialState);
  const wnapp = useSelector((state) => state.apps.chrome);
  const menuRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(null);
  const [currentUrl, setCurrentUrl] = useState("");
  const { history, addToHistory } = useHistory();
  const loadingTimeoutRef = useRef(null);

  // Inject custom styles on mount
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = scrollbarStyles;
    document.head.appendChild(styleEl);
    
    return () => {
      document.head.removeChild(styleEl);
    };
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

  // Memoize the URL change handler to prevent unnecessary re-renders
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
    
    // Use a ref to store the timeout
    loadingTimeoutRef.current = setTimeout(() => {
      setLoading(false);
      const page = internalDNS[url] || NotFoundPage;
      setActiveTab(() => page);
      loadingTimeoutRef.current = null;
    }, 2000);
  }, [currentUrl, loading, addToHistory]);

  return (
    <div
      className="chrome floatTab dpShad dark"
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
        name="Chrome"
      />
      <TabBar />
      <NavigationBar onUrlChange={handleUrlChange} initialUrl={currentUrl} />
      <BookmarksBar onNavigate={handleUrlChange} recentHistory={history} />
      <div className="flex-1 bg-white dark:bg-[#202124] text-black dark:text-white p-4 overflow-auto">
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
        {state.isMenuOpen && <DropdownMenu />}
      </div>
    </div>
  );
};
