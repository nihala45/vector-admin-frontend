'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { Button } from '@repo/ui/components/button'
import { TextInput } from '@repo/ui/custom-inputs/TextInput.js'
import { SelectInput } from '@repo/ui/custom-inputs/SelectInput.js'
import { ImageUploadInput } from '@repo/ui/custom-inputs/ImageUpload.js'
import { useUpdateStaff } from '../../../apis/staff/Mutations'

const userSchema = z
	.object({
		fullName: z.string().min(2, 'Full name is required'),
		email: z.string().email('Enter a valid email'),
		mobileNo: z.string().min(10, 'Enter valid mobile number'),
		password: z.string().min(6, 'Password must be at least 6 characters'),
		confirmPassword: z.string().min(6, 'Confirm your password'),
		status: z.enum(['active', 'blocked'], 'Status is required'),
		avatar: z.string().optional(),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})

type UserFormValues = z.infer<typeof userSchema>

export default function StaffEditForm() {
	const methods = useForm<UserFormValues>({
		resolver: zodResolver(userSchema),
		defaultValues: {
			fullName: '',
			email: '',
			mobileNo: '',
			password: '',
			confirmPassword: '',
			status: 'active',
			avatar: '',
		},
	})

	const onSubmit = (data: UserFormValues) => {
		console.log('User Data:', data)
	}

	return (
		<FormProvider {...methods}>
			<form
				onSubmit={methods.handleSubmit(onSubmit)}
				className='space-y-6 bg-white p-6 rounded-xl shadow'
			>
				{/* Header Section */}
				<div>
					<h1 className='text-2xl font-bold text-gray-900'>Create New User</h1>
					<p className='text-sm text-gray-600 mt-1'>
						Fill in the details below to add a new user
					</p>
				</div>

				{/* User Info */}
				<div className='grid grid-cols-2 gap-4'>
					{/* Avatar Upload */}
					<ImageUploadInput name='avatar' label='Upload Avatar' mode='avatar' />
					<ImageUploadInput name='avatar' label='Upload Avatar' mode='multi' />
					<ImageUploadInput name='avatar' label='Upload Avatar' mode='single' />

					<TextInput
						name='fullName'
						label='Full Name'
						placeholder='Enter full name'
					/>
					<TextInput
						name='email'
						label='Email'
						type='email'
						placeholder='example@mail.com'
					/>
					<TextInput
						name='mobileNo'
						label='Mobile Number'
						type='text'
						placeholder='Enter mobile number'
					/>
					<TextInput
						name='password'
						label='Password'
						type='password'
						placeholder='Enter password'
					/>
					<TextInput
						name='confirmPassword'
						label='Confirm Password'
						type='password'
						placeholder='Confirm password'
					/>

					<SelectInput
						name='status'
						label='Status'
						options={[
							{ label: 'Active', value: 'active' },
							{ label: 'Blocked', value: 'blocked' },
						]}
					/>
				</div>

				<div className='flex justify-end items-end   '>
					<Button
						type='submit'
						className='min-w-[200px] h-12 text-md cursor-pointer'
					>
						Create User
					</Button>
				</div>
			</form>
		</FormProvider>
	)
}
