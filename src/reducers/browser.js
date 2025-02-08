"use client";

export const initialState = {
  tabs: [
    {
      id: "1",
      url: "",
      title: "New Tab",
      isActive: true,
      content: "Welcome to the new tab!",
    },
  ],
  isMenuOpen: false,
  isDarkMode: true,
  zoom: 100,
};

export default function browserReducer(state = initialState, action) {
  if (state === undefined) {
    return initialState;
  }

  switch (action.type) {
    case "ADD_TAB":
      return {
        ...state,
        tabs: [
          ...state.tabs.map((tab) => ({ ...tab, isActive: false })),
          {
            id: Math.random().toString(36).substr(2, 9),
            url: "",
            title: "New Tab",
            isActive: true,
            content: "Welcome to the new tab!",
          },
        ],
      };
    case "CLOSE_TAB":
      return {
        ...state,
        tabs: state.tabs.filter((tab) => tab.id !== action.id),
      };
    case "UPDATE_TAB":
      return {
        ...state,
        tabs: state.tabs.map((tab) =>
          tab.id === action.tab.id ? { ...tab, ...action.tab } : tab
        ),
      };
    case "SWITCH_TAB":
      return {
        ...state,
        tabs: state.tabs.map((tab) =>
          tab.id === action.id
            ? { ...tab, isActive: true }
            : { ...tab, isActive: false }
        ),
      };
    case "TOGGLE_MENU":
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen,
      };
    case "TOGGLE_THEME":
      return {
        ...state,
        isDarkMode: !state.isDarkMode,
      };
    case "SET_ZOOM":
      return {
        ...state,
        zoom: action.zoom,
      };
    default:
      return state;
  }
}
