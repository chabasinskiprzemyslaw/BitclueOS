"use client"

import {
  BookMarked,
  Download,
  History,
  Layout,
  LogOut,
  Monitor,
  Moon,
  Plus,
  Settings,
  Sun,
  Trash2,
  ZoomIn,
} from "lucide-react"
import browserReducer, { initialState } from "../../../reducers/browser";
import { useReducer } from 'react';

export function DropdownMenu() {
  const [state, dispatch] = useReducer(
      browserReducer,
      initialState
    );

  if (!state.isMenuOpen) return null

  return (
    <div className="absolute top-0 right-0 w-80 mt-12 mr-4 bg-[#292b2f] rounded-lg shadow-lg text-gray-300">
      <div className="p-2">
        <button
          onClick={() => dispatch({ type: "ADD_TAB" })}
          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-700 rounded-lg"
        >
          <Plus className="h-4 w-4" />
          <span>New Tab</span>
          <span className="ml-auto text-sm text-gray-500">⌘T</span>
        </button>
        <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-700 rounded-lg">
          <Layout className="h-4 w-4" />
          <span>New Window</span>
          <span className="ml-auto text-sm text-gray-500">⌘N</span>
        </button>
      </div>
      <div className="border-t border-gray-700" />
      <div className="p-2">
        <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-700 rounded-lg">
          <History className="h-4 w-4" />
          <span>History</span>
        </button>
        <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-700 rounded-lg">
          <Download className="h-4 w-4" />
          <span>Downloads</span>
        </button>
        <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-700 rounded-lg">
          <BookMarked className="h-4 w-4" />
          <span>Bookmarks</span>
        </button>
      </div>
      <div className="border-t border-gray-700" />
      <div className="p-2">
        <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-700 rounded-lg">
          <ZoomIn className="h-4 w-4" />
          <span>Zoom</span>
          <span className="ml-auto">{state.zoom}%</span>
        </button>
        <button
          onClick={() => dispatch({ type: "TOGGLE_THEME" })}
          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-700 rounded-lg"
        >
          {state.isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span>Theme</span>
        </button>
      </div>
      <div className="border-t border-gray-700" />
      <div className="p-2">
        <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-700 rounded-lg">
          <Monitor className="h-4 w-4" />
          <span>Extensions</span>
        </button>
        <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-700 rounded-lg">
          <Trash2 className="h-4 w-4" />
          <span>Clear Browsing Data...</span>
        </button>
        <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-700 rounded-lg">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
      </div>
      <div className="border-t border-gray-700" />
      <div className="p-2">
        <button className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-700 rounded-lg">
          <LogOut className="h-4 w-4" />
          <span>Exit</span>
        </button>
      </div>
    </div>
  )
}

