"use client"

import {
  ArrowLeft,
  Archive,
  Trash2,
  Mail,
  Clock,
  TagIcon as Label,
  MoreVertical,
  Reply,
  ReplyAll,
  Forward,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"

export function EmailView({ email, onClose }) {
  if (!email) return null

  return (
    <div className="flex-1 overflow-auto bg-background">
      {/* Email Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center p-4">
          <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Archive className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Mail className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Clock className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Label className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Email Content */}
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">{email.subject}</h1>

        <div className="flex items-start gap-4 mb-6">
          <Avatar>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-semibold">{email.sender[0]}</span>
            </div>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="font-semibold">{email.sender}</span>
                <span className="text-muted-foreground ml-2">&lt;{email.senderEmail}&gt;</span>
              </div>
              <span className="text-sm text-muted-foreground">{email.timestamp}</span>
            </div>
            <div className="text-sm text-muted-foreground">to me</div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: email.content }} />

        <div className="flex gap-2 mt-6">
          <Button variant="secondary">
            <Reply className="h-4 w-4 mr-2" />
            Reply
          </Button>
          <Button variant="secondary">
            <ReplyAll className="h-4 w-4 mr-2" />
            Reply all
          </Button>
          <Button variant="secondary">
            <Forward className="h-4 w-4 mr-2" />
            Forward
          </Button>
        </div>
      </div>
    </div>
  )
}

