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
      try {
        const response = await axiosAdmin.post("/warehouse/auth/deliveryhub/login", {
          email,
          password,
        })
        const data: AdminResponse = response.data

        const { token, admin } = data
        setAdminData(admin, token)

        return data
      } catch (error) {
        console.error("Login error:", error)
        throw error
      }
    },

    onMutate: () => {
      console.log("Logging in...")
    },

    onSettled: async (_, error) => {
      if (error) {
        toast.error((error as Error).message || "Login failed")
      } else {
        toast.success("Welcome")
        navigate("/dashboard")
      }
    },
  })
}


export const useBulkAddToCart = () => {
	return useGenericMutation<any>({
		apiCall: (data: any) => axiosAdmin.post('/user/cart/bulk-add', data),
		onSuccessMessage: 'Bulk Items added',
		queryKeyToInvalidate: 'getcarousel',
		// redirectTo: "/login",
	})
}

// export function useOtpMail() {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const { setUserData } = useAuthStore();

//   return useMutation({
//     mutationFn: async ({
//       email
//     }: {
//       email: string;
//     }) => {
//       try {
//         const response = await axiosAdmin.post("/user/auth/send-otp", {
//           email
//         });
//         const data = response.data;
//         const accessToken = response.data.accessToken;
//         setUserData(data, accessToken);
//         return data;
//       } catch (error) {
//         console.log("Login error:", error);
//         throw error;
//       }
//     },

//     onMutate: () => {
//       console.log("going to otp");
//     },

//     onSettled: async (_, error) => {
//       if (error) {
//         console.log(error);
//         toast.error(error.message || "User not existing");
//       } else {
//         toast.success("Login successfull");
//         navigate("/otplogin");
//         await queryClient.invalidateQueries({ queryKey: ["getAgent"] });
//       }
//     },
//   });
// }

// export function useOtpVerification() {
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const { setUserData } = useAuthStore();
//   const { items: guestCartItems, clearCart } = useCartStore(); // get guest cart here

//   return useMutation({
//     mutationFn: async ({
//       email,
//       otp,
//     }: {
//       email: string;
//       otp: number;
//     }) => {
//       try {
//         const response = await axiosAdmin.post("/user/auth/login-otp", {
//           email,
//           otp,
//         });
//         const data = response.data;
//         const accessToken = response.data.accessToken;
//         setUserData(data, accessToken);

//         // Bulk add guest cart items if any
//         if (guestCartItems.length > 0) {
//           const payload = {
//             items: guestCartItems.map((i: { product: { productId: any; }; variant: any; quantity: any; }) => ({
//               productId: i.product.productId,
//               variantId: i.variant || null,
//               quantity: i.quantity,
//             })),
//           };

//           try {
//             await axiosAdmin.post("/user/cart/bulk-add", payload);
//             clearCart();
//           } catch (bulkError) {
//             console.error("Bulk cart transfer failed:", bulkError);
//           }
//         }

//         return data;
//       } catch (error) {
//         console.log("Login error:", error);
//         throw error;
//       }
//     },

//     onMutate: () => {
//       console.log("Otp successfully verified");
//     },

//     onSettled: async (_, error) => {
//       if (error) {
//         console.log(error);
//         toast.error(error.message || "Otp is incorrect");
//       } else {
//         toast.success("Otp successfully verified");
//         await queryClient.invalidateQueries({ queryKey: ["getcart"] }); // refresh cart after bulk add
//         await queryClient.invalidateQueries({ queryKey: ["getAgent"] });
//         navigate("/");
//       }
//     },
//   });
// }

export const useCreateUser = () => {
	return useGenericMutation<any>({
		apiCall: (data: any) => axiosAdmin.post('/user/auth/signup', data),
		onSuccessMessage: 'User Registered ,please login',
		queryKeyToInvalidate: 'getcarousel',
		redirectTo: '/login',
	})
}

export const useUpdateOtp = () => {
	return useGenericMutation<string>({
		apiCall: (data: any) => axiosAdmin.post('user/verify', data),
		onSuccessMessage: 'Otp verified',
		queryKeyToInvalidate: 'getcarousel',
		redirectTo: '/login',
	})
}

export const useForgotPassword = () => {
	return useGenericMutation<string>({
		apiCall: (data: any) => axiosAdmin.post('user/forgot-password', data),
		onSuccessMessage: 'Mail sent ,check your email',
		queryKeyToInvalidate: 'getcarouselllll',
		// redirectTo: "/login"
	})
}

export const useResetPassword = () => {
	return useGenericMutation<string>({
		apiCall: (data: any) => axiosAdmin.post('user/reset-password', data),
		onSuccessMessage: 'Password reset done ,please relogin',
		queryKeyToInvalidate: 'getcarouselllll',
		redirectTo: '/login',
	})
}
