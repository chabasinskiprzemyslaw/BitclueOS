"use client";

export const initialState = {
  tabs: [],
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
        tabs: [],
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
