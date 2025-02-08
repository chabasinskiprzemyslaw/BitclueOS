"use client"

import { ArrowLeft, ArrowRight, RotateCcw, Star } from "lucide-react"
import { useState, useEffect } from "react"
import browserReducer, { initialState } from "../../../reducers/browser";
import { useReducer } from 'react';
import React from "react";

export const NavigationBar = ({ onUrlChange }) => {
  const [state, dispatch] = useReducer(
        browserReducer,
        initialState
      );
  const [url, setUrl] = useState("");

  const activeTab = state.tabs.find((tab) => tab.isActive)

  useEffect(() => {
    if (activeTab) {
      setUrl(activeTab.url)
    }
  }, [activeTab])

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onUrlChange(url);
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault()
    dispatch({
      type: "UPDATE_TAB",
      tab: {
        id: activeTab.id,
        url: url,
        title: url,
        content: `Content for ${url}`,
      },
    })
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
            placeholder="Search Google or type a URL"
            className="flex-1 bg-transparent outline-none"
          />
        </div>
      </form>
      <button className="p-1 hover:bg-gray-700 rounded-full">
        <Star className="h-4 w-4" />
      </button>
    </div>
  )
}

