import { allApps } from "../utils";

const debugLogger = (action, state, payload) => {
  // Set to true to enable logging, false to disable
  const enableLogging = true;
  
  if (enableLogging) {
    console.log(`[AppReducer][reducers/apps.js] ${action}`, payload || '', state ? { cdir: state.cdir, hid: state.hid } : '');
  }
};


var dev = "";
if (import.meta.env.MODE == "development") {
  dev = ""; // set the name (lowercase) of the app you are developing so that it will be opened on refresh
}

const defState = {};
for (var i = 0; i < allApps.length; i++) {
  defState[allApps[i].icon] = allApps[i];
  defState[allApps[i].icon].size = "full";
  defState[allApps[i].icon].hide = true;
  defState[allApps[i].icon].max = null;
  defState[allApps[i].icon].z = 0;

  if (allApps[i].icon == dev) {
    defState[allApps[i].icon].size = "mini";
    defState[allApps[i].icon].hide = false;
    defState[allApps[i].icon].max = true;
    defState[allApps[i].icon].z = 1;
  }
}

defState.hz = 2;

const appReducer = (state = defState, action) => {
  var tmpState = { ...state };
  debugLogger('RECEIVED_ACTION', state, action);                                          
  if (action.type == "SHOWDSK") {
    var keys = Object.keys(tmpState);

    for (var i = 0; i < keys.length; i++) {
      var obj = tmpState[keys[i]];
      if (obj.hide == false) {
        obj.max = false;
        if (obj.z == tmpState.hz) {
          tmpState.hz -= 1;
        }
        obj.z = -1;
        tmpState[keys[i]] = obj;
      }
    }
    debugLogger('SHOWDSK', tmpState);
    return tmpState;
  } else if (action.type == "EXTERNAL") {
    debugLogger('EXTERNAL', tmpState, action.payload);
    window.open(action.payload, "_blank");
  } else if (action.type == "OPENTERM") {
    debugLogger('OPENTERM', tmpState, action.payload);
    var obj = { ...tmpState["terminal"] };
    obj.dir = action.payload;

    obj.size = "full";
    obj.hide = false;
    obj.max = true;
    tmpState.hz += 1;
    obj.z = tmpState.hz;
    tmpState["terminal"] = obj;
    debugLogger('OPENTERM', tmpState);
    return tmpState;
  } else if (action.type == "ANTIVIRUS") {
    debugLogger('ANTIVIRUS', tmpState);
    var obj = { ...tmpState["defender"] };

    if (action.payload == "full" || action.payload == "togg") {
      obj.hide = false;
      obj.max = true;
      tmpState.hz += 1;
      obj.z = tmpState.hz;
    } else if (action.payload == "close") {
      obj.hide = true;
      obj.max = null;
      obj.z = -1;
      tmpState.hz -= 1;
    } else if (action.payload == "mxmz") {
      obj.size = ["mini", "full"][obj.size != "full" ? 1 : 0];
      obj.hide = false;
      obj.max = true;
      tmpState.hz += 1;
      obj.z = tmpState.hz;
    } else if (action.payload == "mnmz") {
      obj.max = false;
      obj.hide = false;
      if (obj.z == tmpState.hz) {
        tmpState.hz -= 1;
      }
      obj.z = -1; 
    }

    tmpState["defender"] = obj;
    return tmpState;
  } else if (action.type == "ADDAPP") {
    debugLogger('ADDAPP', tmpState, action.payload);
    tmpState[action.payload.icon] = action.payload;
    tmpState[action.payload.icon].size = "full";
    tmpState[action.payload.icon].hide = true;
    tmpState[action.payload.icon].max = null;
    tmpState[action.payload.icon].z = 0;

    return tmpState;
  } else if (action.type == "DELAPP") {
    debugLogger('DELAPP', tmpState, action.payload);
    delete tmpState[action.payload];
    return tmpState;
  } else if (action.type == "NOTEPAD") {
    var obj = { ...tmpState["notepad"] };

    debugLogger('NOTEPAD', tmpState, action.payload);
    
    // Handle our new payload format
    if (typeof action.payload === 'object') {
      // Store the file data in the app state
      obj.payload = action.payload;
      
      // If action is "show", make the app visible
      if (action.payload.action === "show") {
        obj.hide = false;
        obj.max = true;
        tmpState.hz += 1;
        obj.z = tmpState.hz;
      }
    } else if (action.payload === "togg" || action.payload === "full") {
      // Legacy support for older code that might still use string payloads
      obj.hide = false;
      obj.max = true;
      tmpState.hz += 1;
      obj.z = tmpState.hz;
    } else if (action.payload === "close") {
      obj.hide = true;
      obj.max = null;
      obj.z = -1;
      tmpState.hz -= 1;
    }
    
    tmpState["notepad"] = obj;
    return tmpState;
  } else if (action.type == "AUDIOPLAYER") {

    debugLogger('AUDIOPLAYER', tmpState, action.payload);
    
    var obj = { ...tmpState["mediaplay"] };
    
    if (typeof action.payload === 'object') {
      obj.data = action.payload;
      obj.hide = false;
      obj.max = true;
      tmpState.hz += 1;
      obj.z = tmpState.hz;
    } else if (action.payload === "full" || action.payload === "togg") {
      obj.hide = false;
      obj.max = true;
      tmpState.hz += 1;
      obj.z = tmpState.hz;
    } else if (action.payload === "close") {
      obj.hide = true;
      obj.max = null;
      obj.z = -1;
      tmpState.hz -= 1;
    } else if (action.payload == "mxmz") {
      obj.size = ["mini", "full"][obj.size != "full" ? 1 : 0];
      obj.hide = false;
      obj.max = true;
      tmpState.hz += 1;
      obj.z = tmpState.hz;
    } else if (action.payload == "mnmz") {
      obj.max = false;
      obj.hide = false;
      if (obj.z == tmpState.hz) {
        tmpState.hz -= 1;
      }
      obj.z = -1; 
    }
    
    tmpState["mediaplay"] = obj;
    return tmpState;
  } else {

    debugLogger('OTHER', tmpState, action.payload);
    var keys = Object.keys(state);
    for (var i = 0; i < keys.length; i++) {
      var obj = state[keys[i]];
      if (obj.action == action.type) {
        tmpState = { ...state };

        if (action.payload == "full") {
          obj.size = "full";
          obj.hide = false;
          obj.max = true;
          tmpState.hz += 1;
          obj.z = tmpState.hz;
        } else if (action.payload == "close") {
          obj.hide = true;
          obj.max = null;
          obj.z = -1;
          tmpState.hz -= 1;
        } else if (action.payload == "mxmz") {
          obj.size = ["mini", "full"][obj.size != "full" ? 1 : 0];
          obj.hide = false;
          obj.max = true;
          tmpState.hz += 1;
          obj.z = tmpState.hz;
        } else if (action.payload == "togg") {
          if (obj.z != tmpState.hz) {
            obj.hide = false;
            if (!obj.max) {
              tmpState.hz += 1;
              obj.z = tmpState.hz;
              obj.max = true;
            } else {
              obj.z = -1;
              obj.max = false;
            }
          } else {
            obj.max = !obj.max;
            obj.hide = false;
            if (obj.max) {
              tmpState.hz += 1;
              obj.z = tmpState.hz;
            } else {
              obj.z = -1;
              tmpState.hz -= 1;
            }
          }
        } else if (action.payload == "mnmz") {
          obj.max = false;
          obj.hide = false;
          if (obj.z == tmpState.hz) {
            tmpState.hz -= 1;
          }
          obj.z = -1;
        } else if (action.payload == "resize") {
          obj.size = "cstm";
          obj.hide = false;
          obj.max = true;
          if (obj.z != tmpState.hz) tmpState.hz += 1;
          obj.z = tmpState.hz;
          obj.dim = action.dim;
        } else if (action.payload == "front") {
          obj.hide = false;
          obj.max = true;
          if (obj.z != tmpState.hz) {
            tmpState.hz += 1;
            obj.z = tmpState.hz;
          }
        }

        tmpState[keys[i]] = obj;
        return tmpState;
      }
    }
    
  }

  return state;
};

export default appReducer;
