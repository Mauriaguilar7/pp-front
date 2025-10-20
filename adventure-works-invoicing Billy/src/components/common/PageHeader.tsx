"use client"

import type { ReactNode } from "react"
import { Button } from "@/components/ui/button"

interface PageHeaderProps {
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    icon?: ReactNode
  }
  children?: ReactNode
}

export function PageHeader({ title, description, action, children }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-6 border-b">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground mt-2">{description}</p>}
      </div>
      <div className="flex items-center space-x-2">
        {children}
        {action && (
          <Button onClick={action.onClick}>
            {action.icon}
            {action.label}
          </Button>
        )}
      </div>
    </div>
  )
}
