"use client"

import { ArrowLeft, ArrowRight, RotateCcw, Star, Clock } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import browserReducer, { initialState } from "../../../reducers/browser";
import { useReducer } from 'react';
import React from "react";

export const NavigationBar = ({ onUrlChange, initialUrl = "", onHistoryClick }) => {
  const [state, dispatch] = useReducer(
        browserReducer,
        initialState
      );
  const [url, setUrl] = useState(initialUrl);
  const initialUrlRef = useRef(initialUrl);
  const isInitialRender = useRef(true);

  const activeTab = state.tabs.find((tab) => tab.isActive);

  // Update URL when active tab changes
  useEffect(() => {
    if (activeTab && activeTab.url && !isInitialRender.current) {
      setUrl(activeTab.url);
    }
  }, [activeTab]);

  // Handle initialUrl updates
  useEffect(() => {
    // Skip if initialUrl hasn't changed
    if (initialUrl === initialUrlRef.current && !isInitialRender.current) {
      return;
    }
    
    initialUrlRef.current = initialUrl;
    
    if (initialUrl) {
      setUrl(initialUrl);
      
      // Only dispatch if we have an active tab and this isn't the initial render
      if (activeTab && !isInitialRender.current) {
        dispatch({
          type: "UPDATE_TAB",
          tab: {
            id: activeTab.id,
            url: initialUrl,
            title: initialUrl,
            content: `Content for ${initialUrl}`,
          },
        });
      }
    }
    
    // Clear the initial render flag after first render
    if (isInitialRender.current) {
      isInitialRender.current = false;
    }
  }, [initialUrl, activeTab]);

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onUrlChange(url);
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (activeTab) {
      dispatch({
        type: "UPDATE_TAB",
        tab: {
          id: activeTab.id,
          url: url,
          title: url,
          content: `Content for ${url}`,
        },
      });
    }
    onUrlChange(url);
  }

  return (
    <div className="flex items-center gap-2 h-10 px-4 bg-[#202124] text-gray-300">
      <div className="flex items-center gap-1">
        <button className="p-1 hover:bg-gray-700 rounded-full">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <button className="p-1 hover:bg-gray-700 rounded-full">
          <ArrowRight className="h-4 w-4" />
        </button>
        <button className="p-1 hover:bg-gray-700 rounded-full">
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>
      <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center">
        <div className="flex-1 flex items-center h-8 px-4 bg-[#292b2f] rounded-lg">
          <input
            type="text"
            value={url}
            onChange={handleUrlChange}
            onKeyPress={handleKeyPress}
            placeholder="Search or type a URL"
            className="flex-1 bg-transparent outline-none"
          />
        </div>
      </form>
      <button 
        className="p-1 hover:bg-gray-700 rounded-full"
        onClick={onHistoryClick}
      >
        <Clock className="h-4 w-4" />
      </button>
      <button className="p-1 hover:bg-gray-700 rounded-full">
        <Star className="h-4 w-4" />
      </button>
    </div>
  )
}

