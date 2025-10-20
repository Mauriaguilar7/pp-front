import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/lib/validations"

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  lastActivity: number
  sessionTimeout: number // in milliseconds
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  updateLastActivity: () => void
  isSessionExpired: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      lastActivity: Date.now(),
      sessionTimeout: 15 * 60 * 1000, // 15 minutes

      setAuth: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
          lastActivity: Date.now(),
        })
      },

      clearAuth: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          lastActivity: Date.now(),
        })
      },

      updateLastActivity: () => {
        set({ lastActivity: Date.now() })
      },

      isSessionExpired: () => {
        const { lastActivity, sessionTimeout } = get()
        return Date.now() - lastActivity > sessionTimeout
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        lastActivity: state.lastActivity,
      }),
    },
  ),
)
