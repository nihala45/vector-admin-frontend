/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { axiosAdmin } from '../../lib/axios'
import { useGenericMutation } from '../../../components/mutation/useGenericMutation'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useNavigate } from 'react-router'
import { useAuthStore } from '../../store/AuthStore'
import { AdminLoginPayload, AdminResponse } from '../../types/Admin'

export function useLoginUser() {
  const setAdminData = useAuthStore(state => state.setAdminData)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async ({ email, password }: AdminLoginPayload) => {
      const response = await axiosAdmin.post("/api/admin/login/", {
        email,
        password,
      })

      return response.data as AdminResponse
    },

    onSuccess: (data: AdminResponse) => {
      setAdminData(
        {
          email: data.email,
          is_superuser: data.is_superuser,
          user_id: data.user,      // ✅ correct key
        },
        data.access,
        data.refresh
      )

      navigate("/dashboard")
    }
  })
}

