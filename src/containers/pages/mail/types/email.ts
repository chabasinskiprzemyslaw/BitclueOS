import type React from "react"

export interface Email {
  id: string
  sender: string
  subject: string
  preview: string
  timestamp: string
  read: boolean
  category: "primary" | "promotions" | "social" | "updates"
}

export interface SidebarItem {
  icon: React.ComponentType
  label: string
  count?: number
}

