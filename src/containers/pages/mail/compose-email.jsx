"use client"

import { useState } from "react"
import { X, Minimize2, Maximize2, Minus } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { cn } from "../../../lib/utils";

export function ComposeEmail({ onClose }) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)

  return (
    <div
      className={cn(
        "absolute bottom-0 right-4 flex flex-col bg-background rounded-t-lg shadow-2xl border",
        isMinimized ? "h-[48px]" : isMaximized ? "w-full h-full top-0 right-0 rounded-none" : "w-[500px] h-[500px]",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-secondary rounded-t-lg cursor-move">
        <span className="text-sm font-medium">New Message</span>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsMinimized(!isMinimized)}>
            <Minus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsMaximized(!isMaximized)}>
            {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Email Form */}
      {!isMinimized && (
        <div className="flex-1 flex flex-col">
          <div className="p-4 space-y-3 border-b">
            <Input type="text" placeholder="Recipients" className="border-0 focus-visible:ring-0 px-0 py-1 text-sm" />
            <Input type="text" placeholder="Subject" className="border-0 focus-visible:ring-0 px-0 py-1 text-sm" />
          </div>

          {/* Email Body */}
          <div className="flex-1 p-4">
            <Textarea
              placeholder="Write your email here..."
              className="w-full h-full resize-none border-0 focus-visible:ring-0"
            />
          </div>

          {/* Toolbar */}
          <div className="p-4 border-t flex items-center justify-between">
            <Button>Send</Button>
            <div className="flex items-center gap-2">{/* Format buttons would go here */}</div>
          </div>
        </div>
      )}
    </div>
  )
}

