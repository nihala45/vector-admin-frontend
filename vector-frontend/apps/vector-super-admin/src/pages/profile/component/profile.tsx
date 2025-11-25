import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/ui/components/card';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';

// Zod validation schema
const profileSchema = z.object({
    fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    mobileNumber: z.string().min(10, { message: 'Mobile number must be at least 10 digits' }),
    notes: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface Role {
  _id: string;
  name: string;
}

interface User {
    _id: string;
    fullName: string;
    email: string;
    mobileNumber: string;
    notes: string;
    role: Role;
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface UserProfileProps {
    user: User;
    onUpdate: (data: ProfileFormData) => Promise<void>;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: user?.fullName,
            email: user?.email,
            mobileNumber: user?.mobileNumber,
            notes: user?.notes || '',
        },
    });

    // Get first letter for avatar fallback
    const getInitials = (name: string) => {
        return name?.charAt(0)?.toUpperCase();
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        reset({
            fullName: user?.fullName,
            email: user?.email,
            mobileNumber: user?.mobileNumber,
            notes: user?.notes || '',
        });
        setIsEditing(false);
    };

    const onSubmit = async (data: ProfileFormData) => {
        setIsLoading(true);
        try {
            await onUpdate(data);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="">
            <div className="max-w-4xl ">
                <Card className="w-full border shadow-lg">
                    <CardHeader className="bg-gradient-to-r text-white">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl font-bold text-gray-900">Admin Profile</CardTitle>
                            
                        </div>
                    </CardHeader>

                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            {/* Avatar and Basic Info */}
                            <div className="flex items-center space-x-6 p-4 bg-gray-50 rounded-lg border">
                                <div className="w-24 h-24 rounded-full bg-red-500 flex items-center justify-center text-white text-3xl font-bold shadow-md">
                                    {getInitials(user?.fullName)}
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-gray-900">{user?.fullName}</h2>
                                    <p className="text-gray-600 text-lg">{user?.email}</p>
                                    <div className="flex items-center gap-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                            user?.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {user?.status}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {user?.role?.name?.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Form Fields Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Full Name */}
                                <div className="space-y-3">
                                    <Label htmlFor="fullName" className="text-base font-semibold text-gray-700">
                                        Full Name
                                    </Label>
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <Input
                                                id="fullName"
                                                {...register('fullName')}
                                                className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500 h-12 text-base"
                                                placeholder="Enter your full name"
                                            />
                                            {errors.fullName && (
                                                <p className="text-red-600 text-sm font-medium">{errors.fullName.message}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-900 p-3 bg-white rounded-md border border-gray-200 text-base">
                                            {user?.fullName}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="space-y-3">
                                    <Label htmlFor="email" className="text-base font-semibold text-gray-700">
                                        Email Address
                                    </Label>
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <Input
                                                id="email"
                                                type="email"
                                                {...register('email')}
                                                className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500 h-12 text-base"
                                                placeholder="Enter your email"
                                            />
                                            {errors.email && (
                                                <p className="text-red-600 text-sm font-medium">{errors.email.message}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-900 p-3 bg-white rounded-md border border-gray-200 text-base">
                                            {user?.email}
                                        </p>
                                    )}
                                </div>

                                {/* Mobile Number */}
                                <div className="space-y-3">
                                    <Label htmlFor="mobileNumber" className="text-base font-semibold text-gray-700">
                                        Mobile Number
                                    </Label>
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <Input
                                                id="mobileNumber"
                                                {...register('mobileNumber')}
                                                className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500 h-12 text-base"
                                                placeholder="Enter your mobile number"
                                            />
                                            {errors.mobileNumber && (
                                                <p className="text-red-600 text-sm font-medium">{errors.mobileNumber.message}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-900 p-3 bg-white rounded-md border border-gray-200 text-base">
                                            {user?.mobileNumber}
                                        </p>
                                    )}
                                </div>

                                {/* Role Display */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold text-gray-700">
                                        Role
                                    </Label>
                                    <p className="text-gray-900 p-3 bg-white rounded-md border border-gray-200 text-base capitalize">
                                        {user?.role?.name?.replace(/([A-Z])/g, ' $1').trim().toLowerCase()}
                                    </p>
                                </div>

                                {/* Notes - Full Width */}
                                <div className="space-y-3 lg:col-span-2">
                                    <Label htmlFor="notes" className="text-base font-semibold text-gray-700">
                                        Notes
                                    </Label>
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <Input
                                                id="notes"
                                                {...register('notes')}
                                                className="rounded-md border-gray-300 focus:border-red-500 focus:ring-red-500 h-12 text-base"
                                                placeholder="Add any notes (optional)"
                                            />
                                            {errors.notes && (
                                                <p className="text-red-600 text-sm font-medium">{errors.notes.message}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-900 p-3 bg-white rounded-md border border-gray-200 text-base min-h-12">
                                            {user?.notes || 'No notes added'}
                                        </p>
                                    )}
                                </div>

                                {/* Read-only Information */}
                                <div className="space-y-3">
                                    <Label className="text-base font-semibold text-gray-700">
                                        Member Since
                                    </Label>
                                    <p className="text-gray-600 p-3 bg-gray-50 rounded-md border border-gray-200 text-base">
                                        {formatDate(user?.createdAt)}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-base font-semibold text-gray-700">
                                        Last Updated
                                    </Label>
                                    <p className="text-gray-600 p-3 bg-gray-50 rounded-md border border-gray-200 text-base">
                                        {formatDate(user?.updatedAt)}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {isEditing && (
                                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCancel}
                                        disabled={isLoading}
                                        className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md px-6 py-2 font-medium"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="bg-red-600 hover:bg-red-700 text-white rounded-md px-6 py-2 font-medium shadow-sm"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Updating...
                                            </span>
                                        ) : (
                                            'Update Profile'
                                        )}
                                    </Button>
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default UserProfile;