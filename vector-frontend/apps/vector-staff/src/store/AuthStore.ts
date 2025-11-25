import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { IAdmin } from '../types/Admin'

interface AuthState {
	admin: IAdmin | null
	token: string | null
	setAdminData: (admin: IAdmin, token: string) => void
	logout: () => void
}

export const useAuthStore = create<AuthState>()(
	persist(
		set => ({
			admin: null,
			token: null,
			setAdminData: (admin, token) => set({ admin, token }),
			logout: () => set({ admin: null, token: null }),
		}),
		{
			name: 'auth-storage',
		}
	)
)
