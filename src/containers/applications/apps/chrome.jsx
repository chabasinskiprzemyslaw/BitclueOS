"use client";

import React, { useState, useEffect, useRef, useReducer } from "react";
import { MoreVertical } from "lucide-react";
import { useSelector } from "react-redux";
import browserReducer, { initialState } from "../../../reducers/browser";
import { DropdownMenu } from "./dropdown-menu";
import { NavigationBar } from "./navigation-bar";
import { TabBar } from "./tab-bar";
import { ToolBar } from "../../../utils/general";
import internalDNS from "../../pages/internalDNS";

const NotFoundPage = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">404</h1>
    <p>Page not found</p>
  </div>
);

export const Chrome = () => {
  const [state, dispatch] = useReducer(browserReducer, initialState);
  const wnapp = useSelector((state) => state.apps.chrome);
  const menuRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(null);

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

  const handleUrlChange = (url) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const page = internalDNS[url] || NotFoundPage;
      setActiveTab(() => page);
    }, 2000);
  };

  return (
    <div
      className="chrome floatTab dpShad dark"
      data-size={wnapp.size}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size == "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
      id={wnapp.icon + "App"}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name="Chrome"
      />
      <TabBar />
      <NavigationBar onUrlChange={handleUrlChange} />
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
