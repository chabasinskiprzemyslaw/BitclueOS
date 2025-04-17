import { desktopApps } from "../utils";

const defState = {
  apps: desktopApps,
  hide: false,
  size: 1,
  sort: "none",
  abOpen: false,
  debugMode: true,
};

const deskReducer = (state = defState, action) => {
  switch (action.type) {
    case "DESKREM":
      var arr = state.apps.filter((x) => x.name != action.payload);
      if (state.debugMode) {
        console.log("[Desktop Debug] Removing app:", action.payload);
        console.log("[Desktop Debug] Remaining apps:", arr);
      }
      localStorage.setItem("desktop", JSON.stringify(arr.map((x) => x.name)));
      return { ...state, apps: arr };
    case "DESKADD":
      var arr = [...state.apps];
      arr.push(action.payload);
      if (state.debugMode) {
        console.log("[Desktop Debug] Adding app:", action.payload);
        console.log("[Desktop Debug] Updated apps:", arr);
      }
      localStorage.setItem("desktop", JSON.stringify(arr.map((x) => x.name)));
      return { ...state, apps: arr };
    case "DESKHIDE":
      if (state.debugMode) {
        console.log("[Desktop Debug] Hiding desktop");
      }
      return {
        ...state,
        hide: true,
      };
    case "DESKSHOW":
      if (state.debugMode) {
        console.log("[Desktop Debug] Showing desktop");
      }
      return {
        ...state,
        hide: false,
      };
    case "DESKTOGG":
      if (state.debugMode) {
        console.log("[Desktop Debug] Toggling desktop visibility");
      }
      return {
        ...state,
        hide: !state.hide,
      };
    case "DESKSIZE":
      if (state.debugMode) {
        console.log("[Desktop Debug] Changing size to:", action.payload);
      }
      return {
        ...state,
        size: action.payload,
      };
    case "DESKSORT":
      if (state.debugMode) {
        console.log("[Desktop Debug] Changing sort to:", action.payload || "none");
      }
      return {
        ...state,
        sort: action.payload || "none",
      };
    case "DESKABOUT":
      if (state.debugMode) {
        console.log("[Desktop Debug] Toggling about panel:", action.payload);
      }
      return {
        ...state,
        abOpen: action.payload,
      };
    case "DESKDEBUG":
      const newDebugMode = action.payload;
      if (newDebugMode) {
        console.log("[Desktop Debug] Debug mode enabled");
      } else {
        console.log("[Desktop Debug] Debug mode disabled");
      }
      localStorage.setItem("desktopDebugMode", newDebugMode);
      return {
        ...state,
        debugMode: newDebugMode,
      };
    default:
      return state;
  }
};

export default deskReducer;
