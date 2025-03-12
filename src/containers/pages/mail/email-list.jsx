"use client"

import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { sampleEmails } from "./data/emails";
import { cn } from "../../../lib/utils";

export function EmailList({ activeTab, setActiveTab, onEmailSelect }) {
  const filteredEmails = sampleEmails.filter((email) => email.category === activeTab)

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-auto p-0">
          <TabsTrigger
            value="primary"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
          >
            Primary
          </TabsTrigger>
          <TabsTrigger
            value="promotions"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
          >
            Promotions
          </TabsTrigger>
          <TabsTrigger
            value="social"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
          >
            Social
          </TabsTrigger>
          <TabsTrigger
            value="updates"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent"
          >
            Updates
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="overflow-auto flex-1">
        {filteredEmails.map((email) => (
          <div
            key={email.id}
            onClick={() => onEmailSelect(email)}
            className={cn(
              "flex items-center gap-4 px-4 py-2 hover:bg-secondary/50 cursor-pointer",
              !email.read && "font-medium",
            )}
          >
            <input type="checkbox" className="h-4 w-4" onClick={(e) => e.stopPropagation()} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate">{email.sender}</span>
                <span className="text-sm text-muted-foreground ml-auto">{email.timestamp}</span>
              </div>
              <div className="text-sm text-muted-foreground truncate">
                {email.subject} - {email.preview}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

