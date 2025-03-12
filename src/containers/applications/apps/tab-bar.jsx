"use client"

import { Plus, X } from "lucide-react"
import browserReducer, { initialState } from "../../../reducers/browser";
import { useReducer } from 'react';

export function TabBar() {
  const [state, dispatch] = useReducer(
          browserReducer,
          initialState
        );

  const handleTabClick = (id) => {
    dispatch({ type: "SWITCH_TAB", id })
  }

  return (
    <div className="flex items-center h-10 bg-[#202124] text-gray-300">
      <div className="flex-1 flex items-center">
        {state.tabs.map((tab) => (
          <div
            key={tab.id}
            className={`group relative flex items-center min-w-[180px] max-w-[240px] h-8 px-4 rounded-t-lg cursor-pointer ${
              tab.isActive ? "bg-[#292b2f] text-white" : "bg-[#202124] hover:bg-[#292b2f]"
            }`}
            onClick={() => handleTabClick(tab.id)}
          >
            <span className="flex-1 truncate">{tab.title || "New Tab"}</span>
            <button
              onClick={(e) => {
                e.stopPropagation()
                dispatch({ type: "CLOSE_TAB", id: tab.id })
              }}
              className="opacity-0 group-hover:opacity-100 hover:bg-gray-700 rounded-full p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={() => dispatch({ type: "ADD_TAB" })}
        className="flex items-center justify-center w-8 h-8 hover:bg-gray-700 rounded-full"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}

