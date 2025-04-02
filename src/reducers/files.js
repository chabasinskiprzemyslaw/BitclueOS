import { Bin } from "../utils/bin";
import fdata from "./dir.json";

// Debug logger utility with toggle flag
const debugLogger = (action, state, payload) => {
  // Set to true to enable logging, false to disable
  const enableLogging = false;
  
  if (enableLogging) {
    console.log(`[FileReducer][reducers/files.js] ${action}`, payload || '', state ? { cdir: state.cdir, hid: state.hid } : '');
  }
};

// Function to send data to backend when triggered files are opened
const sendToBackend = (fileData) => {
  debugLogger('sendToBackend', null, fileData);
  const userInfo = JSON.parse(localStorage.getItem('user_info'));
  const scenarioId = localStorage.getItem('selected_scenario');

  const userIdentityId = userInfo?.id;
  if (!fileData) return;
  
  // Check if the file has the triggerBackend flag directly or in info
  const hasTrigger = 
    (fileData.triggerBackend === true) || 
    (fileData.trigger === true) || 
    (fileData.info && fileData.info.triggerBackend);

  debugLogger('hasTrigger', null, hasTrigger);
  
  if (hasTrigger) {
    debugLogger('hasTrigger true', null, fileData);
    // Collect all possible trigger data
    const triggerData = fileData.triggerData ? 
      (typeof fileData.triggerData === 'string' ? JSON.parse(fileData.triggerData) : fileData.triggerData) : 
      (fileData.info && fileData.info.triggerData ? fileData.info.triggerData : {});
    
    // Get file ID and name from the appropriate property
    const fileId = fileData.triggerData.id;
    const fileName = fileData.name || fileData.fileName;
    
    debugLogger('BACKEND_TRIGGER', null, { 
      fileId,
      fileName,
      triggerData,
      userIdentityId,
      scenarioId
    });
    
    // Actual backend request - replace URL with your API endpoint
    fetch('https://localhost:5001/storyengine/fileexplorer/files/trigger-action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileId,
        fileName,
        triggerData,
        userIdentityId,
        scenarioId
      })
    })
    .then(response => response.json())
    .then(data => {
      debugLogger('BACKEND_RESPONSE', null, data);
    })
    .catch(error => {
      debugLogger('BACKEND_ERROR', null, error);
    });
  }
};

const defState = {
  cdir: "%user%",
  hist: [],
  hid: 0,
  view: 1,
  fileView: {
    show: false,
    type: null,
    url: null,
    name: null
  }
};

defState.hist.push(defState.cdir);
defState.data = new Bin();
defState.data.parse(fdata);

const fileReducer = (state = defState, action) => {
  var tmp = { ...state };
  var navHist = false;

  debugLogger('RECEIVED_ACTION', state, action);

  if (action.type === "FILEDIR") {
    if (action.payload.id) {

      tmp.cdir = action.payload.id;

      if (action.payload.triggerBackend) {
        debugLogger('triggerBackend true', state, action);
        const fileData = {
          id: action.payload.id,
          name: action.payload.name,
          type: action.payload.type,
          trigger: action.payload.triggerBackend,
          triggerData: action.payload.triggerData
        };

        // Send the complete file data to the backend
        console.log("file trigger 1");
        sendToBackend(fileData);
      }
      
    } else {
      tmp.cdir = action.payload;
    }
    debugLogger('FILEDIR', tmp, action.payload);
  } else if (action.type === "FILEPATH") {
    var pathid = tmp.data.parsePath(action.payload);
    if (pathid) tmp.cdir = pathid;
    debugLogger('FILEPATH', tmp, { path: action.payload, resolved: pathid });
  } else if (action.type === "FILEBACK") {
    var item = tmp.data.getId(tmp.cdir);
    if (item.host) {
      tmp.cdir = item.host.id;
    }
    debugLogger('FILEBACK', tmp, { from: state.cdir, to: tmp.cdir });
  } else if (action.type === "FILEVIEW") {
    tmp.view = action.payload;
    debugLogger('FILEVIEW', tmp, action.payload);
  } else if (action.type === "FILEPREV") {
    tmp.hid--;
    if (tmp.hid < 0) tmp.hid = 0;
    navHist = true;
    debugLogger('FILEPREV', tmp, { newHid: tmp.hid });
  } else if (action.type === "FILENEXT") {
    tmp.hid++;
    if (tmp.hid > tmp.hist.length - 1) tmp.hid = tmp.hist.length - 1;
    navHist = true;
    debugLogger('FILENEXT', tmp, { newHid: tmp.hid });
  } else if (action.type === "NOTEPAD") {
    // Open the notepad application with the file data
    console.log("Opening notepad from file explorer", action.payload);
    
    // Don't dispatch here - this creates circular dependencies
    // The dispatch is already handled in handleFileOpen function
    
    // If this file should trigger a backend action
    if (action.payload && action.payload.id) {
      // Try to get file data from our system
      let fileData = tmp.data.getId(action.payload.id);
      
      if (fileData) {
        console.log("file trigger 2");
        sendToBackend(fileData);
      }
    }
    
    debugLogger('NOTEPAD', tmp, action.payload);
  } else if (action.type === "OPENFILEVIEW") {
    console.log("open file view", action.payload);
    tmp.fileView = {
      show: true,
      type: action.payload.type,
      url: action.payload.url,
      name: action.payload.name,
      triggerBackend: action.payload.triggerBackend,
      triggerData: action.payload.triggerData
    };

    // Check if this file should trigger a backend action
    if (action.payload.id) {
      // Try to get file data from our system first
      let fileData = tmp.data.getId(action.payload.id);
      
      // If we didn't find the file or want to send additional data
      if (!fileData || action.payload.triggerData) {
        // Use the payload as is or combine with the file data
        fileData = {
          ...fileData,
          id: action.payload.id,
          name: action.payload.name,
          type: action.payload.type,
          triggerData: action.payload.triggerData
        };
      }
      
      // Send the complete file data to the backend
      console.log("file trigger 3");
      sendToBackend(fileData);
    }
    
    debugLogger('OPENFILEVIEW', tmp, action.payload);
  } else if (action.type === "CLOSEFILEVIEW") {
    tmp.fileView = {
      show: false,
      type: null,
      url: null,
      name: null
    };
    debugLogger('CLOSEFILEVIEW', tmp);
  }

  if (!navHist && tmp.cdir != tmp.hist[tmp.hid]) {
    tmp.hist.splice(tmp.hid + 1);
    tmp.hist.push(tmp.cdir);
    tmp.hid = tmp.hist.length - 1;
  }

  tmp.cdir = tmp.hist[tmp.hid];
  if (tmp.cdir.includes("%")) {
    if (tmp.data.special[tmp.cdir] != null) {
      tmp.cdir = tmp.data.special[tmp.cdir];
      tmp[tmp.hid] = tmp.cdir;
    }
  }

  tmp.cpath = tmp.data.getPath(tmp.cdir);
  
  debugLogger('FINAL_STATE', tmp);
  
  return tmp;
};

export default fileReducer;
