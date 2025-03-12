"use client"

import { useState } from "react"
import { Menu, Search, Settings, HelpCircle, Grid } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Sidebar } from "./sidebar"
import { EmailList } from "./email-list"
import { EmailView } from "./email-view"
import { ComposeEmail } from "./compose-email"

export default function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("primary");
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [isComposing, setIsComposing] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="flex items-center px-4 py-2 border-b">
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(!isCollapsed)} className="mr-2">
          <Menu className="h-5 w-5" />
        </Button>
        <img
          src="https://www.google.com/gmail/about/static-2.0/images/logo-gmail.png?fingerprint=c2eaf4aae389c3f885e97081bb197b97"
          alt="Gmail"
          className="h-8 mr-4"
        />
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search mail" className="pl-10 bg-secondary" />
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button variant="ghost" size="icon">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Grid className="h-5 w-5" />
          </Button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isCollapsed={isCollapsed} onCompose={() => setIsComposing(true)} />
        {selectedEmail ? (
          <EmailView email={selectedEmail} onClose={() => setSelectedEmail(null)} />
        ) : (
          <EmailList activeTab={activeTab} setActiveTab={setActiveTab} onEmailSelect={setSelectedEmail} />
        )}
      </div>
      {isComposing && <ComposeEmail onClose={() => setIsComposing(false)} />}
    </div>
  )
}

