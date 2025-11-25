import React from 'react'
import UserProfile from './component/profile'
import { useGetMe } from '../../apis/auth/Queries'
// import { useEditAdminProfile } from '../../apis/auth/Mutations'

const Profile = () => {
    const { data: response } = useGetMe()
    // const updateMutate = useEditAdminProfile()
    const userData = response?.user
    const handleUpdateProfile = async (data: any) => {
        // Simulate API call
        console.log('Updating profile with:', data);
        updateMutate.mutate(data)
    };
    return (
        <div>
            <UserProfile user={userData} onUpdate={handleUpdateProfile} />
        </div>
    )
}

export default Profile
