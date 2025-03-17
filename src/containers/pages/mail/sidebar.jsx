"use client"

import { Button } from "../../../components/ui/button"
import { PenSquare, Inbox, Star, Clock, Send, File, Tag, Trash, Loader2 } from "lucide-react"
import { cn } from "../../../lib/utils";

// Map folder names to icons
const folderIconMap = {
  "Inbox": Inbox,
  "Drafts": File,
  "Sent": Send,
  "Bin": Trash,
  // Add more mappings as needed
  "default": Tag // Default icon for unknown folder types
};

export function Sidebar({ isCollapsed, onCompose, onFolderSelect, currentFolder, folders = [], isLoading = false }) {
  // Get the appropriate icon for a folder
  const getFolderIcon = (folderName) => {
    return folderIconMap[folderName] || folderIconMap.default;
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-1 p-2 border-r transition-all duration-300",
        isCollapsed ? "w-[4.5rem]" : "w-64",
      )}
    >
      <Button className="justify-start gap-2 mb-2" size={isCollapsed ? "icon" : "default"} onClick={onCompose}>
        <PenSquare className="h-4 w-4" />
        {!isCollapsed && <span>Compose</span>}
      </Button>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          {!isCollapsed && <span className="ml-2 text-sm text-muted-foreground">Loading folders...</span>}
        </div>
      ) : (
        <>
          {folders.map((folder) => {
            const FolderIcon = getFolderIcon(folder.name);
            return (
              <Button 
                key={folder.id} 
                variant="ghost" 
                className={cn(
                  "justify-start gap-2", 
                  isCollapsed && "justify-center",
                  currentFolder === folder.name && "bg-secondary"
                )}
                onClick={() => onFolderSelect(folder.name, folder.id)}
              >
                <FolderIcon className="h-4 w-4" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{folder.name}</span>
                    {folder.unreadCount > 0 && (
                      <span className="text-xs font-medium bg-blue-500 text-white px-1.5 py-0.5 rounded-full">
                        {folder.unreadCount}
                      </span>
                    )}
                  </>
                )}
              </Button>
            );
          })}
          
          {/* Additional standard items that might not be in the folders list */}
          <Button 
            variant="ghost" 
            className={cn(
              "justify-start gap-2", 
              isCollapsed && "justify-center",
              currentFolder === "Starred" && "bg-secondary"
            )}
            onClick={() => onFolderSelect("Starred")}
          >
            <Star className="h-4 w-4" />
            {!isCollapsed && <span className="flex-1 text-left">Starred</span>}
          </Button>
          
          <Button 
            variant="ghost" 
            className={cn(
              "justify-start gap-2", 
              isCollapsed && "justify-center",
              currentFolder === "Snoozed" && "bg-secondary"
            )}
            onClick={() => onFolderSelect("Snoozed")}
          >
            <Clock className="h-4 w-4" />
            {!isCollapsed && <span className="flex-1 text-left">Snoozed</span>}
          </Button>
          
          <Button 
            variant="ghost" 
            className={cn(
              "justify-start gap-2", 
              isCollapsed && "justify-center",
              currentFolder === "Categories" && "bg-secondary"
            )}
            onClick={() => onFolderSelect("Categories")}
          >
            <Tag className="h-4 w-4" />
            {!isCollapsed && <span className="flex-1 text-left">Categories</span>}
          </Button>
        </>
      )}
    </div>
  )
}

