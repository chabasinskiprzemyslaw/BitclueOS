import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Icon, ToolBar } from "../../../utils/general";
import "./assets/recyclebin.scss";

export const RecycleBin = () => {
  const dispatch = useDispatch();
  const wnapp = useSelector((state) => state.apps.bin0) || {
    hide: true,
    size: "full",
    max: true,
    z: 0
  };

  const [selectedItems, setSelectedItems] = useState([]);
  const [deletedItems] = useState([
    {
      id: "del-1",
      name: "Report.docx",
      type: "file",
      icon: "docx",
      size: "2.4 MB",
      dateDeleted: "2023-05-15 09:23:45"
    },
    {
      id: "del-2",
      name: "Budget.xlsx",
      type: "file",
      icon: "xlsx",
      size: "1.8 MB",
      dateDeleted: "2023-06-02 14:17:22"
    },
    {
      id: "del-3",
      name: "Vacation Photos",
      type: "folder",
      icon: "folder",
      size: "156 MB",
      dateDeleted: "2023-06-28 22:09:11"
    },
    {
      id: "del-4",
      name: "Presentation.pptx",
      type: "file",
      icon: "pptx",
      size: "5.7 MB",
      dateDeleted: "2023-07-10 16:45:33"
    }
  ]);

  // Window resize/drag functionality
  var posP = [0, 0],
    dimP = [0, 0],
    posM = [0, 0],
    trgWindow = {},
    op = 0,
    vec = [0, 0];

  const toolDrag = (e) => {
    e = e || window.event;
    e.preventDefault();
    posM = [e.clientY, e.clientX];
    op = e.currentTarget.dataset.op;

    if (op == 0) {
      trgWindow =
        e.currentTarget.parentElement &&
        e.currentTarget.parentElement.parentElement;
    } else {
      vec = e.currentTarget.dataset.vec.split(",");
      trgWindow =
        e.currentTarget.parentElement &&
        e.currentTarget.parentElement.parentElement &&
        e.currentTarget.parentElement.parentElement.parentElement;
    }

    if (trgWindow) {
      trgWindow.classList.add("notrans");
      trgWindow.classList.add("z9900");
      posP = [trgWindow.offsetTop, trgWindow.offsetLeft];
      dimP = [
        parseFloat(getComputedStyle(trgWindow).height.replaceAll("px", "")),
        parseFloat(getComputedStyle(trgWindow).width.replaceAll("px", "")),
      ];
    }

    document.onmouseup = closeDrag;
    document.onmousemove = eleDrag;
  };

  const setPos = (pos0, pos1) => {
    trgWindow.style.top = pos0 + "px";
    trgWindow.style.left = pos1 + "px";
  };

  const setDim = (dim0, dim1) => {
    trgWindow.style.height = dim0 + "px";
    trgWindow.style.width = dim1 + "px";
  };

  const eleDrag = (e) => {
    e = e || window.event;
    e.preventDefault();

    var pos0 = posP[0] + e.clientY - posM[0],
      pos1 = posP[1] + e.clientX - posM[1],
      dim0 = dimP[0] + vec[0] * (e.clientY - posM[0]),
      dim1 = dimP[1] + vec[1] * (e.clientX - posM[1]);

    if (op == 0) setPos(pos0, pos1);
    else {
      dim0 = Math.max(dim0, 320);
      dim1 = Math.max(dim1, 320);
      pos0 = posP[0] + Math.min(vec[0], 0) * (dim0 - dimP[0]);
      pos1 = posP[1] + Math.min(vec[1], 0) * (dim1 - dimP[1]);
      setPos(pos0, pos1);
      setDim(dim0, dim1);
    }
  };

  const closeDrag = () => {
    document.onmouseup = null;
    document.onmousemove = null;

    trgWindow.classList.remove("notrans");
    trgWindow.classList.remove("z9900");

    var action = {
      type: wnapp.action,
      payload: "resize",
      dim: {
        width: getComputedStyle(trgWindow).width,
        height: getComputedStyle(trgWindow).height,
        top: getComputedStyle(trgWindow).top,
        left: getComputedStyle(trgWindow).left,
      },
    };

    dispatch(action);
  };
  
  // Handlers for Recycle Bin functionality
  const handleItemClick = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleEmptyBin = () => {
    // In a real application, this would delete all items
    setSelectedItems([]);
  };

  const handleRestore = () => {
    // In a real application, this would restore selected items
    setSelectedItems([]);
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div
      className="recyclebinApp floatTab dpShad dark"
      data-size={wnapp.size}
      id={wnapp.icon + "App"}
      data-max={wnapp.max}
      style={{
        ...(wnapp.size === "cstm" ? wnapp.dim : null),
        zIndex: wnapp.z,
      }}
      data-hide={wnapp.hide}
    >
      <ToolBar
        app={wnapp.action}
        icon={wnapp.icon}
        size={wnapp.size}
        name="Recycle Bin"
      />
      <div className="windowScreen bg-[var(--bg1)] text-[var(--dark-txt)] backdrop-blur-xl overflow-hidden h-full" data-dock="true">
        <div className="flex flex-col h-full w-full">
          {/* Toolbar */}
          <div className="p-2 border-b border-[var(--bg3)]">
            <div className="flex gap-3">
              <button 
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-[var(--bg2)] transition-colors ${selectedItems.length === 0 ? 'opacity-50 cursor-default hover:bg-transparent' : 'cursor-pointer'}`}
                onClick={handleRestore}
                disabled={selectedItems.length === 0}
              >
                <Icon src="restore" width={16} />
                <span>Restore</span>
              </button>
              <button 
                className="flex items-center gap-1.5 px-3 py-1.5 rounded hover:bg-[var(--bg2)] transition-colors cursor-pointer"
                onClick={handleEmptyBin}
              >
                <Icon src="bin0" width={16} />
                <span>Empty Recycle Bin</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex px-4 py-2 border-b border-[var(--bg3)] font-medium select-none">
              <div className="flex-[3]">Name</div>
              <div className="flex-[2]">Date deleted</div>
              <div className="flex-1">Size</div>
            </div>
            
            {/* Items */}
            <div className="flex-1 overflow-y-auto win11Scroll">
              {deletedItems.length === 0 ? (
                <div className="flex justify-center items-center h-full italic text-[var(--gray-txt)]">
                  Recycle Bin is empty
                </div>
              ) : (
                deletedItems.map((item) => (
                  <div 
                    key={item.id}
                    className={`flex px-4 py-2 border-b border-[var(--bg2)] cursor-pointer ${
                      selectedItems.includes(item.id) 
                        ? 'bg-[var(--hlight)] text-[var(--light-txt)] hover:bg-[var(--hlight)]' 
                        : 'hover:bg-[var(--bg2)]'
                    }`}
                    onClick={() => handleItemClick(item.id)}
                  >
                    <div className="flex-[3] flex items-center gap-2">
                      <Icon src={item.icon} width={20} />
                      <span>{item.name}</span>
                    </div>
                    <div className="flex-[2] flex items-center">
                      {formatDate(item.dateDeleted)}
                    </div>
                    <div className="flex-1 flex items-center">
                      {item.size}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="resizecont topone">
        <div className="flex">
          <div
            className="conrsz cursor-nw-resize"
            data-op="1"
            onMouseDown={toolDrag}
            data-vec="-1,-1"
          ></div>
          <div
            className="edgrsz cursor-n-resize wdws"
            data-op="1"
            onMouseDown={toolDrag}
            data-vec="-1,0"
          ></div>
        </div>
      </div>
      <div className="resizecont leftone">
        <div className="h-full">
          <div
            className="edgrsz cursor-w-resize hdws"
            data-op="1"
            onMouseDown={toolDrag}
            data-vec="0,-1"
          ></div>
        </div>
      </div>
      <div className="resizecont rightone">
        <div className="h-full">
          <div
            className="edgrsz cursor-w-resize hdws"
            data-op="1"
            onMouseDown={toolDrag}
            data-vec="0,1"
          ></div>
        </div>
      </div>
      <div className="resizecont bottomone">
        <div className="flex">
          <div
            className="conrsz cursor-ne-resize"
            data-op="1"
            onMouseDown={toolDrag}
            data-vec="1,-1"
          ></div>
          <div
            className="edgrsz cursor-n-resize wdws"
            data-op="1"
            onMouseDown={toolDrag}
            data-vec="1,0"
          ></div>
          <div
            className="conrsz cursor-nw-resize"
            data-op="1"
            onMouseDown={toolDrag}
            data-vec="1,1"
          ></div>
        </div>
      </div>
    </div>
  );
}; 