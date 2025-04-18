import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ToolBar } from "../../../utils/general";

export const Notepad = () => {
  const wnapp = useSelector((state) => state.apps.notepad);
  const [fileName, setFileName] = useState("Untitled");
  const [fileContent, setFileContent] = useState("");
  const dispatch = useDispatch();

  // Listen for changes to notepad file data
  useEffect(() => {
    // Get file data if it was opened from file explorer
    if (wnapp.payload && typeof wnapp.payload === 'object') {
      // Set the file name if available
      if (wnapp.payload.name) {
        setFileName(wnapp.payload.name);
      }
      
      // Set the file content if available
      if (wnapp.payload.content) {
        setFileContent(wnapp.payload.content);
      }
    }
  }, [wnapp.payload]);

  return (
    <div
      className="notepad floatTab dpShad"
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
        name={`${fileName} - Notepad`}
      />
      <div className="windowScreen flex flex-col" data-dock="true">
        <div className="flex text-xs py-2 topBar">
          <div className="mx-2">File</div>
          <div className="mx-4">Edit</div>
          <div className="mx-4">View</div>
        </div>
        <div className="restWindow h-full flex-grow">
          <div className="w-full h-full overflow-hidden">
            <textarea 
              className="noteText win11Scroll" 
              id="textpad" 
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
