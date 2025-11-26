import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  admin: {
    email: string
    is_superuser: boolean
  } | null
  access: string | null
  refresh: string | null
  setAdminData: (
    admin: { email: string; is_superuser: boolean },
    access: string,
    refresh: string,
	 user_id: string | number
  ) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      admin: null,
      access: null,
      refresh: null,

      setAdminData: (admin, access, refresh) =>
        set({ admin, access, refresh }),

      logout: () => set({ admin: null, access: null, refresh: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
)
