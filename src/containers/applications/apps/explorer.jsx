import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, Image, ToolBar } from "../../../utils/general";
import { dispatchAction, handleFileOpen } from "../../../actions";
import { sendToBackend } from "../../../reducers/files";
import "./assets/fileexpo.scss";

// Debug logger utility with toggle flag
const debugLogger = (componentName, action, data) => {
  // Set to true to enable logging, false to disable
  const enableLogging = false;
  
  if (enableLogging) {
    console.log(`[${componentName}] ${action}`, data || '');
  }
};

// Enhanced handleFileOpen helper to ensure proper data is passed
const enhancedHandleFileOpen = (fileId, fileData = {}) => {
  debugLogger('Explorer', 'enhancedHandleFileOpen', { fileId, ...fileData });
  
  // Check if this is a file that should trigger a backend action
  if (fileData.trigger === 'true') {
    try {
      const triggerData = fileData.triggerData ? JSON.parse(fileData.triggerData) : {};
      debugLogger('Explorer', 'triggerBackend', { 
        fileId, 
        fileName: fileData.name,
        triggerData 
      });
    } catch (error) {
      debugLogger('Explorer', 'triggerBackend ERROR', error);
    }
  }
  
  handleFileOpen(fileId);
};

const NavTitle = (props) => {
  var src = props.icon || "folder";

  return (
    <div
      className="navtitle flex prtclk"
      data-action={props.action}
      data-payload={props.payload}
      onClick={dispatchAction}
    >
      <Icon
        className="mr-1"
        src={"win/" + src + "-sm"}
        width={props.isize || 16}
      />
      <span>{props.title}</span>
    </div>
  );
};

const FolderDrop = ({ dir }) => {
  const files = useSelector((state) => state.files);
  const folder = files.data.getId(dir);
  
  debugLogger('FolderDrop', 'render', dir);

  return (
    <>
      {folder.data &&
        folder.data.map((item, i) => {
          if (item.type == "folder") {
            return (
              <Dropdown
                key={i}
                icon={item.info && item.info.icon}
                title={item.name}
                notoggle={item.data.length == 0}
                dir={item.id}
              />
            );
          }
        })}
    </>
  );
};

const Dropdown = (props) => {
  const [open, setOpen] = useState(props.isDropped != null);
  const special = useSelector((state) => state.files.data.special);
  const [fid, setFID] = useState(() => {
    if (props.spid) return special[props.spid];
    else return props.dir;
  });
  
  const toggle = () => {
    debugLogger('Dropdown', 'toggle', props.title);
    setOpen(!open);
  };

  debugLogger('Dropdown', 'render', props.title);

  return (
    <div className="dropdownmenu">
      <div className="droptitle">
        {!props.notoggle ? (
          <Icon
            className="arrUi"
            fafa={open ? "faChevronDown" : "faChevronRight"}
            width={10}
            onClick={toggle}
            pr
          />
        ) : (
          <Icon className="arrUi opacity-0" fafa="faCircle" width={10} />
        )}
        <NavTitle
          icon={props.icon}
          title={props.title}
          isize={props.isize}
          action={props.action != "" ? props.action || "FILEDIR" : null}
          payload={fid}
        />
        {props.pinned != null ? (
          <Icon className="pinUi" src="win/pinned" width={16} />
        ) : null}
      </div>
      {!props.notoggle ? (
        <div className="dropcontent">
          {open ? props.children : null}
          {open && fid != null ? <FolderDrop dir={fid} /> : null}
        </div>
      ) : null}
    </div>
  );
};

export const Explorer = () => {
  const apps = useSelector((state) => state.apps);
  const wnapp = useSelector((state) => state.apps.explorer);
  const files = useSelector((state) => state.files);
  const fdata = files.data.getId(files.cdir);
  const [cpath, setPath] = useState(files.cpath);
  const [searchtxt, setShText] = useState("");
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setPath(e.target.value);
    debugLogger('Explorer', 'handleChange', e.target.value);
  };
  
  const handleSearchChange = (e) => {
    setShText(e.target.value);
    debugLogger('Explorer', 'handleSearchChange', e.target.value);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      debugLogger('Explorer', 'handleEnter', cpath);
      dispatch({ type: "FILEPATH", payload: cpath });
    }
  };

  const DirCont = () => {
    var arr = [],
      curr = fdata,
      index = 0;

    while (curr) {
      arr.push(
        <div key={index++} className="dirCont flex items-center">
          <div
            className="dncont"
            onClick={dispatchAction}
            tabIndex="-1"
            data-action="FILEDIR"
            data-payload={curr.id}
          >
            {curr.name}
          </div>
          <Icon className="dirchev" fafa="faChevronRight" width={8} />
        </div>,
      );

      curr = curr.host;
    }

    arr.push(
      <div key={index++} className="dirCont flex items-center">
        <div className="dncont" tabIndex="-1">
          This PC
        </div>
        <Icon className="dirchev" fafa="faChevronRight" width={8} />
      </div>,
    );

    arr.push(
      <div key={index++} className="dirCont flex items-center">
        <Icon
          className="pr-1 pb-px"
          src={"win/" + fdata.info.icon + "-sm"}
          width={16}
        />
        <Icon className="dirchev" fafa="faChevronRight" width={8} />
      </div>,
    );

    return (
      <div key={index++} className="dirfbox h-full flex">
        {arr.reverse()}
      </div>
    );
  };

  useEffect(() => {
    debugLogger('Explorer', 'useEffect: path changed', files.cpath);
    setPath(files.cpath);
    setShText("");
  }, [files.cpath]);

  return (
    <div
      className="msfiles floatTab dpShad"
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
        name="File Explorer"
      />
      <div className="windowScreen flex flex-col">
        <Ribbon />
        <div className="restWindow flex-grow flex flex-col">
          <div className="sec1">
            <Icon
              className={
                "navIcon hvtheme" + (files.hid == 0 ? " disableIt" : "")
              }
              fafa="faArrowLeft"
              width={14}
              click="FILEPREV"
              pr
            />
            <Icon
              className={
                "navIcon hvtheme" +
                (files.hid + 1 == files.hist.length ? " disableIt" : "")
              }
              fafa="faArrowRight"
              width={14}
              click="FILENEXT"
              pr
            />
            <Icon
              className="navIcon hvtheme"
              fafa="faArrowUp"
              width={14}
              click="FILEBACK"
              pr
            />
            <div className="path-bar noscroll" tabIndex="-1">
              <input
                className="path-field"
                type="text"
                value={cpath}
                onChange={handleChange}
                onKeyDown={handleEnter}
              />
              <DirCont />
            </div>
            <div className="srchbar">
              <Icon className="searchIcon" src="search" width={12} />
              <input
                type="text"
                onChange={handleSearchChange}
                value={searchtxt}
                placeholder="Search"
              />
            </div>
          </div>
          <div className="sec2">
            <NavPane />
            <ContentArea searchtxt={searchtxt} />
          </div>
          <div className="sec3">
            <div className="item-count text-xs">{fdata.data.length} items</div>
            <div className="view-opts flex">
              <Icon
                className="viewicon hvtheme p-1"
                click="FILEVIEW"
                payload="5"
                open={files.view == 5}
                src="win/viewinfo"
                width={16}
              />
              <Icon
                className="viewicon hvtheme p-1"
                click="FILEVIEW"
                payload="1"
                open={files.view == 1}
                src="win/viewlarge"
                width={16}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Context Menu Component
const ContextMenu = ({ x, y, onClose, file, showProperties }) => {
  const menuRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div 
      ref={menuRef}
      className="context-menu" 
      style={{ 
        top: `${y}px`, 
        left: `${x}px`,
      }}
    >
      <div 
        className="context-menu-item"
        onClick={() => {
          showProperties(file);
          onClose();
        }}
      >
        <Icon className="mr-2" fafa="faInfoCircle" width={14} />
        <span>Properties</span>
      </div>
    </div>
  );
};

// API service for file properties
const FilePropertiesService = {
  // Get properties for a file or folder
  getProperties: async (fileId, filePath, fileInfo) => {
    // This will be replaced with an actual API call in the future
    debugLogger('FilePropertiesService', 'getProperties', fileId);
    
    // Check if the file already has properties in fileInfo
    if (fileInfo && fileInfo.properties) {
      debugLogger('FilePropertiesService', 'using properties from dir.json', fileInfo.properties);
      return Promise.resolve(fileInfo.properties);
    }
    
    // Simulate backend API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Get location from the file path if available
        let location = "This PC";
        if (filePath && Array.isArray(filePath)) {
          location = "This PC > " + filePath.join(" > ");
        }
        
        // Create default properties
        const defaultProps = {
          id: fileId,
          name: fileInfo ? fileInfo.name : "File or Folder Name",
          type: fileInfo ? fileInfo.type || "Unknown" : "Unknown",
          location: location,
          size: fileInfo && fileInfo.size ? fileInfo.size : "0 bytes",
          created: fileInfo && fileInfo.dateCreated ? fileInfo.dateCreated : "Unknown",
          modified: fileInfo && fileInfo.dateModified ? fileInfo.dateModified : "Unknown",
          accessed: "Unknown",
          attributes: []
        };
        
        resolve(defaultProps);
      }, 500);
    });
  },
  getTriggerProperties: async (fileId, filePath, fileInfo) => {
    // This will be replaced with an actual API call in the future
    debugLogger('FilePropertiesService', 'getTriggerProperties', fileId);
    
    
    return Promise.resolve(fileInfo.triggerProperties);
  }
};

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    
    // Format: Today, 10:30 AM or MM/DD/YYYY, 10:30 AM
    const today = new Date();
    const isToday = date.getDate() === today.getDate() && 
                   date.getMonth() === today.getMonth() && 
                   date.getFullYear() === today.getFullYear();
    
    const timeOptions = { hour: 'numeric', minute: '2-digit', hour12: true };
    const timeString = date.toLocaleTimeString('en-US', timeOptions);
    
    if (isToday) {
      return `Today, ${timeString}`;
    } else {
      const dateOptions = { month: 'numeric', day: 'numeric', year: 'numeric' };
      const dateString = date.toLocaleDateString('en-US', dateOptions);
      return `${dateString}, ${timeString}`;
    }
  } catch (e) {
    console.error('Date formatting error:', e);
    return dateString;
  }
};

// Add this function to format property values for display
const formatPropertyValue = (key, value) => {
  if (value === undefined || value === null) return 'Unknown';
  
  // Format dates
  if (['created', 'modified', 'accessed', 'recoveryDate'].includes(key) && typeof value === 'string') {
    return formatDate(value) || value;
  }
  
  // Format arrays
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  
  return value;
};

// Enhance the PropertiesPanel component
const PropertiesPanel = ({ file, onClose }) => {
  const [properties, setProperties] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        // Call the API service
        const data = await FilePropertiesService.getProperties(file.id, file.path, file.info);

        const triggerData = await FilePropertiesService.getTriggerProperties(file.id, file.path, file.info);

        if (triggerData) {
          sendToBackend({
            fileName: file.name,
            triggerBackend: true,
            triggerData: triggerData
          });
        }
        
        // Combine backend data with file data we already have
        const combinedData = {
          ...data,
          id: file.id || data.id,
          name: file.name || data.name,
          type: file.type || data.type,
          location: file.path || data.location,
          // Format the dates nicely if they exist
          created: formatDate(data.created) || data.created,
          modified: formatDate(data.modified) || data.modified,
          accessed: formatDate(data.accessed) || data.accessed,
          // Additional attributes
          attributes: file.attributes || data.attributes || ['Read-only']
        };
        setProperties(combinedData);
      } catch (err) {
        console.error('Error fetching file properties:', err);
        setError('Failed to load file properties');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [file]);

  // Custom properties are any properties not in this standard list
  const standardProps = ['id', 'name', 'type', 'location', 'size', 'created', 'modified', 'accessed', 'attributes'];
  
  const getCustomProperties = (props) => {
    if (!props) return {};
    
    return Object.keys(props)
      .filter(key => !standardProps.includes(key))
      .reduce((obj, key) => {
        obj[key] = props[key];
        return obj;
      }, {});
  };

  return (
    <div className="properties-panel">
      <div className="properties-header">
        <div className="properties-title">
          {file.name} Properties
        </div>
        <div className="properties-close" onClick={onClose}>
          <Icon fafa="faTimes" width={12} />
        </div>
      </div>
      
      <div className="properties-content win11Scroll">
        {loading ? (
          <div className="properties-loading">Loading properties...</div>
        ) : error ? (
          <div className="properties-error">{error}</div>
        ) : properties ? (
          <>
            <div className="properties-section">
              <h3>General</h3>
              <div className="properties-row">
                <div className="properties-label">Name:</div>
                <div className="properties-value">{properties.name}</div>
              </div>
              <div className="properties-row">
                <div className="properties-label">Type:</div>
                <div className="properties-value">{properties.type}</div>
              </div>
              <div className="properties-row">
                <div className="properties-label">Location:</div>
                <div className="properties-value">{properties.location}</div>
              </div>
              <div className="properties-row">
                <div className="properties-label">Size:</div>
                <div className="properties-value">{properties.size}</div>
              </div>
            </div>
            
            <div className="properties-section">
              <h3>Date Information</h3>
              <div className="properties-row">
                <div className="properties-label">Created:</div>
                <div className="properties-value">{properties.created}</div>
              </div>
              <div className="properties-row">
                <div className="properties-label">Modified:</div>
                <div className="properties-value">{properties.modified}</div>
              </div>
              <div className="properties-row">
                <div className="properties-label">Accessed:</div>
                <div className="properties-value">{properties.accessed}</div>
              </div>
            </div>
            
            <div className="properties-section">
              <h3>Comments</h3>
              <div className="properties-row">
                <div className="properties-value">{Array.isArray(properties.attributes) ? properties.attributes.join(', ') : properties.attributes}</div>
              </div>
            </div>
            
            {/* Display any custom properties */}
            {Object.keys(getCustomProperties(properties)).length > 0 && (
              <div className="properties-section">
                <h3>Additional Information</h3>
                {Object.entries(getCustomProperties(properties)).map(([key, value]) => (
                  <div className="properties-row" key={key}>
                    <div className="properties-label">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}:</div>
                    <div className="properties-value">{formatPropertyValue(key, value)}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="properties-not-found">No properties found</div>
        )}
      </div>
      
      <div className="properties-footer">
        <button className="properties-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

// Content Context Menu Component for empty area
const ContentContextMenu = ({ x, y, onClose }) => {
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  const handleViewChange = (view) => {
    debugLogger('ContentContextMenu', 'handleViewChange', view);
    dispatch({ type: "FILEVIEW", payload: view });
    onClose();
  };
  
  const handleRefresh = () => {
    debugLogger('ContentContextMenu', 'handleRefresh');
    // In a real app, this would trigger a refresh of the current directory
    // For now, we'll just close the menu
    onClose();
  };

  return (
    <div 
      ref={menuRef}
      className="context-menu" 
      style={{ 
        top: `${y}px`, 
        left: `${x}px`,
      }}
    >
      <div className="context-menu-item" onClick={() => handleViewChange("1")}>
        <Icon className="mr-2" fafa="faThLarge" width={14} />
        <span>Large icons</span>
      </div>
      <div className="context-menu-item" onClick={() => handleViewChange("5")}>
        <Icon className="mr-2" fafa="faList" width={14} />
        <span>Details</span>
      </div>
      <div className="context-menu-separator"></div>
      <div className="context-menu-item" onClick={handleRefresh}>
        <Icon className="mr-2" fafa="faSyncAlt" width={14} />
        <span>Refresh</span>
      </div>
    </div>
  );
};

const ContentArea = ({ searchtxt }) => {
  const files = useSelector((state) => state.files);
  const special = useSelector((state) => state.files.data.special);
  const [selected, setSelect] = useState(null);
  const fdata = files.data.getId(files.cdir);
  const dispatch = useDispatch();
  
  // Add state for context menu
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    file: null
  });
  
  // Add state for content context menu (right-click on empty space)
  const [contentContextMenu, setContentContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0
  });
  
  // Add state for properties dialog
  const [showProperties, setShowProperties] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDouble = (e) => {
    e.stopPropagation();
    const dataset = e.target.dataset;
    debugLogger('ContentArea', 'handleDouble', dataset);
    
    // Pass all available data from dataset
    enhancedHandleFileOpen(dataset.id, {
      name: dataset.name,
      type: dataset.type,
      trigger: dataset.trigger,
      triggerData: dataset.triggerData
    });
  };
  
  // Handle right click to show context menu
  const handleContextMenu = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    debugLogger('ContentArea', 'handleContextMenu', item);
    setContentContextMenu({
      visible: false,
      x: 0,
      y: 0
    });
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      file: item
    });
  };
  
  // Handle right click on empty space
  const handleContentContextMenu = (e) => {
    e.preventDefault();
    debugLogger('ContentArea', 'handleContentContextMenu');
    // Close file context menu if open
    setContextMenu({
      visible: false,
      x: 0,
      y: 0,
      file: null
    });
    // Open content context menu
    setContentContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY
    });
  };
  
  // Close context menu
  const closeContextMenu = () => {
    setContextMenu({
      visible: false,
      x: 0,
      y: 0,
      file: null
    });
  };
  
  // Close content context menu
  const closeContentContextMenu = () => {
    setContentContextMenu({
      visible: false,
      x: 0,
      y: 0
    });
  };
  
  // Open properties dialog
  const openProperties = (file) => {
    debugLogger('ContentArea', 'openProperties', file);
    setSelectedFile(file);
    setShowProperties(true);
  };
  
  // Close properties dialog
  const closeProperties = () => {
    setShowProperties(false);
    setSelectedFile(null);
  };
  
  const emptyClick = (e) => {
    debugLogger('ContentArea', 'emptyClick');
    setSelect(null);
    closeContextMenu();
    closeContentContextMenu();
  };

  const handleKey = (e) => {
    if (e.key == "Backspace") {
      debugLogger('ContentArea', 'handleKey', 'Backspace');
      dispatch({ type: "FILEPREV" });
    }
  };

  // Helper to get appropriate icon based on file type
  const getFileIcon = (item) => {
    if (item.type === "folder") {
      return `icon/win/${item.info && item.info.icon || "folder"}`;
    } else if (item.type === "image") {
      return `icon/win/image`;
    } else if (item.type === "video") {
      return `icon/win/video`;
    } else {
      return `icon/win/${item.info && item.info.icon || "file"}`;
    }
  };

  return (
    <div
      className="contentarea"
      onClick={emptyClick}
      onContextMenu={handleContentContextMenu}
      onKeyDown={handleKey}
      tabIndex="-1"
    >
      <div className="contentwrap win11Scroll">
        <div className="gridshow" data-size="lg">
          {fdata.data.map((item, i) => {
            return (
              item.name.includes(searchtxt) && (
                <div
                  key={i}
                  className="conticon hvtheme flex flex-col items-center prtclk"
                  data-id={item.id}
                  data-focus={selected == item.id}
                  data-type={item.type}
                  data-name={item.name}
                  data-trigger={item.info && item.info.triggerBackend ? "true" : "false"}
                  data-trigger-data={item.info && item.info.triggerData ? JSON.stringify(item.info.triggerData) : ""}
                  onDoubleClick={handleDouble}
                  onContextMenu={(e) => handleContextMenu(e, item)}
                  onClick={() => setSelect(item.id)}
                >
                  <Image src={getFileIcon(item)} />
                  <span>{item.name}</span>
                  {item.type === "folder" && item.data && item.data.length === 0 && (
                    <span className="empty-folder-indicator">(No data)</span>
                  )}
                </div>
              )
            );
          })}
        </div>
        {fdata.data.length == 0 ? (
          <span className="text-xs mx-auto">This folder is empty.</span>
        ) : null}
      </div>
      
      {/* File Context Menu */}
      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          file={contextMenu.file}
          onClose={closeContextMenu}
          showProperties={openProperties}
        />
      )}
      
      {/* Content Context Menu (for empty space) */}
      {contentContextMenu.visible && (
        <ContentContextMenu
          x={contentContextMenu.x}
          y={contentContextMenu.y}
          onClose={closeContentContextMenu}
        />
      )}
      
      {/* Properties Dialog */}
      {showProperties && selectedFile && (
        <PropertiesPanel 
          file={selectedFile}
          onClose={closeProperties}
        />
      )}
    </div>
  );
};

const NavPane = ({}) => {
  const files = useSelector((state) => state.files);
  const special = useSelector((state) => state.files.data.special);

  debugLogger('NavPane', 'render');

  return (
    <div className="navpane win11Scroll">
      <div className="extcont">
        <Dropdown icon="star" title="Quick access" action="" isDropped>
          <Dropdown
            icon="down"
            title="Downloads"
            spid="%downloads%"
            notoggle
            pinned
          />
          <Dropdown icon="user" title="PC" spid="%user%" notoggle pinned />
          <Dropdown
            icon="docs"
            title="Documents"
            spid="%documents%"
            notoggle
            pinned
          />
          <Dropdown title="Github" spid="%github%" notoggle />
          <Dropdown icon="pics" title="Pictures" spid="%pictures%" notoggle />
        </Dropdown>
        <Dropdown icon="onedrive" title="OneDrive" spid="%onedrive%" />
        <Dropdown icon="thispc" title="This PC" action="" isDropped>
          <Dropdown icon="desk" title="Desktop" spid="%desktop%" />
          <Dropdown icon="docs" title="Documents" spid="%documents%" />
          <Dropdown icon="down" title="Downloads" spid="%downloads%" />
          <Dropdown icon="music" title="Music" spid="%music%" />
          <Dropdown icon="pics" title="Pictures" spid="%pictures%" />
          <Dropdown icon="vid" title="Videos" spid="%videos%" />
          <Dropdown icon="disc" title="OS (C:)" spid="%cdrive%" />
          <Dropdown icon="disk" title="PC (D:)" spid="%ddrive%" />
        </Dropdown>
      </div>
    </div>
  );
};

const Ribbon = ({}) => {
  debugLogger('Ribbon', 'render');
  
  return (
    <div className="msribbon flex">
      <div className="ribsec">
        <div className="drdwcont flex">
          <Icon src="new" ui width={18} margin="0 6px" />
          <span>New</span>
        </div>
      </div>
      <div className="ribsec">
        <Icon src="cut" ui width={18} margin="0 6px" />
        <Icon src="copy" ui width={18} margin="0 6px" />
        <Icon src="paste" ui width={18} margin="0 6px" />
        <Icon src="rename" ui width={18} margin="0 6px" />
        <Icon src="share" ui width={18} margin="0 6px" />
      </div>
      <div className="ribsec">
        <div className="drdwcont flex">
          <Icon src="sort" ui width={18} margin="0 6px" />
          <span>Sort</span>
        </div>
        <div className="drdwcont flex">
          <Icon src="view" ui width={18} margin="0 6px" />
          <span>View</span>
        </div>
      </div>
    </div>
  );
};
