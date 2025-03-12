"use client"

import { Button } from "../../../components/ui/button"
import { PenSquare, Inbox, Star, Clock, Send, File, Tag, Trash } from "lucide-react"
import { cn } from "../../../lib/utils";

const sidebarItems = [
  { icon: Inbox, label: "Inbox", count: 14356 },
  { icon: Star, label: "Starred" },
  { icon: Clock, label: "Snoozed" },
  { icon: Send, label: "Sent" },
  { icon: File, label: "Drafts", count: 38 },
  { icon: Tag, label: "Categories" },
  { icon: Trash, label: "Trash" },
]

export function Sidebar({ isCollapsed, onCompose }) {
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
      {sidebarItems.map((item, index) => (
        <Button key={index} variant="ghost" className={cn("justify-start gap-2", isCollapsed && "justify-center")}>
          <item.icon className="h-4 w-4" />
          {!isCollapsed && <span className="flex-1 text-left">{item.label}</span>}
          {!isCollapsed && item.count && <span className="text-xs text-muted-foreground">{item.count}</span>}
        </Button>
      ))}
    </div>
  )
}

