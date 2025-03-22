import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon } from "../utils/general";

export const MediaViewer = () => {
  const dispatch = useDispatch();
  const fileView = useSelector((state) => state.files.fileView);
  const [zoom, setZoom] = useState(1);
  const [showInfo, setShowInfo] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showInstructions, setShowInstructions] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const videoRef = useRef(null);
  const imageRef = useRef(null);
  const files = useSelector(state => state.files);
  
  // Get full file data
  const fileData = fileView.id ? files.data.getId(fileView.id) : null;
  
  // Show instructions briefly when an image is opened
  useEffect(() => {
    if (fileView.show && fileView.type === 'image') {
      setShowInstructions(true);
      const timer = setTimeout(() => {
        setShowInstructions(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [fileView.show, fileView.type]);

  const closeViewer = () => {
    dispatch({ type: "CLOSEFILEVIEW" });
  };

  const handleZoomIn = (e) => {
    e.stopPropagation();
    
    // Calculate how much the position should change to maintain the same view center
    const zoomChange = 0.1;
    const newZoom = zoom + zoomChange;
    
    // Only adjust position if already zoomed in
    if (zoom > 1) {
      // Scale the position based on zoom change
      const scaleFactor = newZoom / zoom;
      setPosition({
        x: position.x * scaleFactor,
        y: position.y * scaleFactor
      });
    }
    
    setZoom(newZoom);
  };

  const handleZoomOut = (e) => {
    e.stopPropagation();
    if (zoom > 0.3) {
      const zoomChange = 0.1;
      const newZoom = zoom - zoomChange;
      
      // Only adjust position if staying zoomed in
      if (newZoom > 1) {
        // Scale the position based on zoom change
        const scaleFactor = newZoom / zoom;
        setPosition({
          x: position.x * scaleFactor,
          y: position.y * scaleFactor
        });
      } else if (newZoom <= 1) {
        // Reset position when returning to normal size
        setPosition({ x: 0, y: 0 });
      }
      
      setZoom(newZoom);
    }
  };

  const handleResetZoom = (e) => {
    e.stopPropagation();
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };
  
  const toggleInfo = (e) => {
    e.stopPropagation();
    setShowInfo(!showInfo);
  };

  const toggleKeyboardShortcuts = (e) => {
    e.stopPropagation();
    setShowKeyboardShortcuts(!showKeyboardShortcuts);
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e) => {
    if (zoom > 1) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    }
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners for mouse move and up events
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  // Reset position when zoom changes to 1 or less
  useEffect(() => {
    if (zoom <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [zoom]);

  // Handle mouse wheel for zooming
  const handleWheel = (e) => {
    e.preventDefault();
    
    // Get the original dimensions
    const rect = imageRef.current.getBoundingClientRect();
    
    // Calculate where in the image the cursor is pointing (as a fraction of the image dimensions)
    const relativeX = (e.clientX - rect.left) / rect.width;
    const relativeY = (e.clientY - rect.top) / rect.height;
    
    // Previous center position (center of the viewport in image coordinates)
    const prevImgCenterX = -position.x / zoom + rect.width / (2 * zoom);
    const prevImgCenterY = -position.y / zoom + rect.height / (2 * zoom);
    
    // Calculate new zoom level
    let newZoom = zoom;
    if (e.deltaY < 0) {
      // Zoom in on scroll up
      newZoom = Math.min(zoom + 0.1, 3);
    } else {
      // Zoom out on scroll down
      newZoom = Math.max(zoom - 0.1, 0.3);
    }
    
    // If new zoom level is 1 or less, reset position and zoom
    if (newZoom <= 1) {
      setZoom(newZoom);
      setPosition({ x: 0, y: 0 });
      return;
    }

    // Calculate new center position to zoom toward cursor
    // This is where the math happens to ensure the point under the cursor stays there
    const newImgCenterX = prevImgCenterX + (relativeX - 0.5) * (1/zoom - 1/newZoom) * rect.width;
    const newImgCenterY = prevImgCenterY + (relativeY - 0.5) * (1/zoom - 1/newZoom) * rect.height;
    
    // Convert back to screen coordinates
    const newPositionX = -(newImgCenterX - rect.width / (2 * newZoom)) * newZoom;
    const newPositionY = -(newImgCenterY - rect.height / (2 * newZoom)) * newZoom;
    
    // Apply the new position and zoom
    setZoom(newZoom);
    setPosition({ x: newPositionX, y: newPositionY });
  };

  // Add mouse wheel event listener
  useEffect(() => {
    const imageContainer = document.querySelector('.media-viewer-image-container');
    if (imageContainer && fileView.type === 'image') {
      imageContainer.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    return () => {
      if (imageContainer) {
        imageContainer.removeEventListener('wheel', handleWheel);
      }
    };
  }, [fileView]);

  // Handle double-click to toggle zoom
  const handleDoubleClick = (e) => {
    e.preventDefault();
    if (zoom > 1) {
      // Reset zoom if already zoomed in
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    } else {
      // Zoom to 2x if currently at normal size
      setZoom(2);
      
      // Try to center the zoom on the click position
      const rect = imageRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      // Calculate center offset
      const offsetX = (clickX - rect.width / 2) * 0.5;
      const offsetY = (clickY - rect.height / 2) * 0.5;
      
      setPosition({ x: -offsetX, y: -offsetY });
    }
  };

  // Handle keyboard navigation and controls
  const handleKeyDown = (e) => {
    // Don't do anything if info panel input fields are focused
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      return;
    }
    
    switch (e.key) {
      case 'Escape':
        closeViewer();
        break;
      case 'ArrowLeft':
        // Pan left when zoomed
        if (zoom > 1) {
          setPosition({ x: position.x + 20, y: position.y });
        }
        break;
      case 'ArrowRight':
        // Pan right when zoomed
        if (zoom > 1) {
          setPosition({ x: position.x - 20, y: position.y });
        }
        break;
      case 'ArrowUp':
        // Pan up when zoomed
        if (zoom > 1) {
          setPosition({ x: position.x, y: position.y + 20 });
        }
        break;
      case 'ArrowDown':
        // Pan down when zoomed
        if (zoom > 1) {
          setPosition({ x: position.x, y: position.y - 20 });
        }
        break;
      case '+':
        // Zoom in
        if (fileView.type === 'image') {
          handleZoomIn(e);
        }
        break;
      case '-':
        // Zoom out
        if (fileView.type === 'image') {
          handleZoomOut(e);
        }
        break;
      case '0':
        // Reset zoom
        if (fileView.type === 'image') {
          handleResetZoom(e);
        }
        break;
      case 'i':
        // Toggle info panel
        toggleInfo(e);
        break;
      case '?':
        // Show keyboard shortcuts help
        toggleKeyboardShortcuts(e);
        break;
      default:
        break;
    }
  };
  
  // Add keyboard event listener
  useEffect(() => {
    if (fileView.show) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fileView.show, zoom, position]);

  // If the viewer is not shown, don't render anything
  if (!fileView.show) return null;

  return (
    <div 
      className="media-viewer-overlay"
      onClick={closeViewer}
    >
      <div 
        className="media-viewer-container"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="media-viewer-header">
          <div className="media-viewer-title">{fileView.name}</div>
          <div className="media-viewer-controls">
            <button className="media-viewer-btn" onClick={toggleInfo}>
              <Icon fafa="faInfoCircle" />
            </button>
            <button className="media-viewer-btn" onClick={toggleKeyboardShortcuts}>
              <Icon fafa="faKeyboard" />
            </button>
            {fileView.type === "image" && (
              <>
                <button className="media-viewer-btn" onClick={handleZoomOut}>
                  <Icon fafa="faSearchMinus" />
                </button>
                <span className="media-viewer-zoom-level">
                  {Math.round(zoom * 100)}%
                </span>
                <button className="media-viewer-btn" onClick={handleResetZoom}>
                  <Icon fafa="faSync" />
                </button>
                <button className="media-viewer-btn" onClick={handleZoomIn}>
                  <Icon fafa="faSearchPlus" />
                </button>
              </>
            )}
            {fileView.type === "video" && (
              <button className="media-viewer-btn" onClick={toggleFullscreen}>
                <Icon fafa="faExpand" />
              </button>
            )}
            <div className="media-viewer-close" onClick={closeViewer}>
              <Icon fafa="faTimes" />
            </div>
          </div>
        </div>
        
        {showKeyboardShortcuts && (
          <div className="media-viewer-keyboard-shortcuts">
            <div className="shortcuts-header">
              <h3>Keyboard Shortcuts</h3>
              <button className="close-shortcuts" onClick={toggleKeyboardShortcuts}>
                <Icon fafa="faTimes" />
              </button>
            </div>
            <div className="shortcuts-grid">
              <div className="shortcut-group">
                <h4>Navigation</h4>
                <div className="shortcut-item">
                  <div className="shortcut-key">Esc</div>
                  <div className="shortcut-desc">Close viewer</div>
                </div>
                <div className="shortcut-item">
                  <div className="shortcut-key">Arrow keys</div>
                  <div className="shortcut-desc">Move image when zoomed</div>
                </div>
              </div>
              
              <div className="shortcut-group">
                <h4>Zoom Controls</h4>
                <div className="shortcut-item">
                  <div className="shortcut-key">+</div>
                  <div className="shortcut-desc">Zoom in</div>
                </div>
                <div className="shortcut-item">
                  <div className="shortcut-key">-</div>
                  <div className="shortcut-desc">Zoom out</div>
                </div>
                <div className="shortcut-item">
                  <div className="shortcut-key">0</div>
                  <div className="shortcut-desc">Reset zoom</div>
                </div>
                <div className="shortcut-item">
                  <div className="shortcut-key">Mouse wheel</div>
                  <div className="shortcut-desc">Zoom in/out</div>
                </div>
                <div className="shortcut-item">
                  <div className="shortcut-key">Double-click</div>
                  <div className="shortcut-desc">Toggle zoom</div>
                </div>
              </div>
              
              <div className="shortcut-group">
                <h4>Other Controls</h4>
                <div className="shortcut-item">
                  <div className="shortcut-key">i</div>
                  <div className="shortcut-desc">Toggle file info panel</div>
                </div>
                <div className="shortcut-item">
                  <div className="shortcut-key">?</div>
                  <div className="shortcut-desc">Show this help</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="media-viewer-content">
          <div className={`media-viewer-main ${showInfo ? 'with-info' : ''}`}>
            {fileView.type === "image" && (
              <div 
                className="media-viewer-image-container"
                style={{ cursor: zoom > 1 ? 'move' : 'default' }}
              >
                {showInstructions && (
                  <div className="media-viewer-instructions">
                    <p>
                      <Icon fafa="faMousePointer" className="mr-1" />
                      Scroll to zoom, double-click to toggle zoom, drag to move when zoomed
                    </p>
                  </div>
                )}
                <img 
                  ref={imageRef}
                  src={fileView.url} 
                  alt={fileView.name}
                  className="media-viewer-image"
                  style={{ 
                    transform: `scale(${zoom})`,
                    transformOrigin: 'center',
                    transition: isDragging ? 'none' : 'transform 0.2s ease-in-out',
                    position: 'relative',
                    left: `${position.x}px`,
                    top: `${position.y}px`
                  }}
                  draggable="false"
                  onMouseDown={handleMouseDown}
                  onDoubleClick={handleDoubleClick}
                />
              </div>
            )}
            {fileView.type === "video" && (
              <video 
                ref={videoRef}
                src={fileView.url} 
                controls 
                autoPlay
                className="media-viewer-video"
              />
            )}
          </div>
          
          {showInfo && fileData && fileData.info && (
            <div className="media-viewer-info">
              <h3>File Information</h3>
              <div className="media-viewer-info-grid">
                <div className="info-label">Name:</div>
                <div className="info-value">{fileData.name}</div>
                
                <div className="info-label">Type:</div>
                <div className="info-value">{fileData.type}</div>
                
                <div className="info-label">Size:</div>
                <div className="info-value">{fileData.info.size || "Unknown"}</div>
                
                {fileData.type === "image" && (
                  <>
                    <div className="info-label">Dimensions:</div>
                    <div className="info-value">{fileData.info.dimensions || "Unknown"}</div>
                  </>
                )}
                
                {fileData.type === "video" && (
                  <>
                    <div className="info-label">Duration:</div>
                    <div className="info-value">{fileData.info.duration || "Unknown"}</div>
                    
                    <div className="info-label">Resolution:</div>
                    <div className="info-value">{fileData.info.resolution || "Unknown"}</div>
                  </>
                )}
                
                <div className="info-label">Created:</div>
                <div className="info-value">{fileData.info.dateCreated || "Unknown"}</div>
                
                <div className="info-label">Modified:</div>
                <div className="info-value">{fileData.info.dateModified || "Unknown"}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 