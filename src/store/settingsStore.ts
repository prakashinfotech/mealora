import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface NotificationPreferences {
  orderNotifications: boolean
  promotionalEmails: boolean
  smsAlerts: boolean
}

interface SettingsState {
  preferences: NotificationPreferences
  togglePreference: (key: keyof NotificationPreferences) => void
  setPreference: (key: keyof NotificationPreferences, value: boolean) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      preferences: {
        orderNotifications: true,
        promotionalEmails: false,
        smsAlerts: true,
      },
      togglePreference: (key) =>
        set({ preferences: { ...get().preferences, [key]: !get().preferences[key] } }),
      setPreference: (key, value) =>
        set({ preferences: { ...get().preferences, [key]: value } }),
    }),
    { name: 'mealora-settings' }
  )
)
