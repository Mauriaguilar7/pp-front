"use client"

import { useEffect, type ReactNode } from "react"
import { useAuth } from "../hooks/use-auth"

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { updateLastActivity, checkSession } = useAuth()

  useEffect(() => {
    // Check session on mount
    checkSession()

    // Set up activity listeners
    const handleActivity = () => {
      updateLastActivity()
    }

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"]
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true)
    })

    // Check session periodically
    const sessionCheckInterval = setInterval(() => {
      checkSession()
    }, 60000) // Check every minute

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true)
      })
      clearInterval(sessionCheckInterval)
    }
  }, [updateLastActivity, checkSession])

  return <>{children}</>
}
