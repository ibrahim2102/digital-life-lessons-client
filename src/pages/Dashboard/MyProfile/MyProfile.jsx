import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import usePremium from '../../../hooks/usePremium';

const MyProfile = () => {
    const { user, updateUserProfile } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { isPremium, loading: premiumLoading, refresh: refreshPremium } = usePremium();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [stats, setStats] = useState({
        lessonsCreated: 0,
        lessonsSaved: 0
    });

    // Fetch user stats
    useEffect(() => {
        const fetchUserStats = async () => {
            try {
                setLoading(true);
                // Fetch lessons created by user
                const lessonsRes = await axiosSecure.get('/dashboard/my-lessons', {
                    params: { email: user.email }
                });
                const lessonsCreated = lessonsRes.data.data?.length || lessonsRes.data?.length || 0;

                // Fetch saved lessons count
                            try {
                                const savedRes = await axiosSecure.get('/dashboard/user-stats', {
                                    params: { email: user.email }
                                });
                                const lessonsSaved = savedRes.data.totalSaved || 0;
                                setStats({
                                    lessonsCreated,
                                    lessonsSaved
                                });
                            } catch (error) {
                                // If saved lessons endpoint doesn't exist yet, just use lessons created
                                console.debug('Saved lessons endpoint error:', error);
                                setStats({
                                    lessonsCreated,
                                    lessonsSaved: 0
                                });
                            }
            } catch (error) {
                console.error('Error fetching stats:', error);
                toast.error('Failed to load profile statistics');
            } finally {
                setLoading(false);
            }
        };

        if (user?.email) {
            fetchUserStats();
            // Set form values
            setValue('displayName', user.displayName || '');
        }
    }, [user, setValue, axiosSecure]);

    // Handle profile update
    const handleUpdateProfile = async (data) => {
        setIsUpdating(true);
        try {
            let photoURL = user.photoURL;

            // Handle image upload if new image is provided
            if (data.photo && data.photo.length > 0) {
                const profileImg = data.photo[0];
                const formData = new FormData();
                formData.append('image', profileImg);

                const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;

                const imageResponse = await axios.post(image_API_URL, formData);
                photoURL = imageResponse.data.data.url;
            }

            // Update Firebase profile
            const profileUpdate = {
                displayName: data.displayName || user.displayName,
                photoURL: photoURL
            };

            await updateUserProfile(profileUpdate);

            toast.success('Profile updated successfully!');
            
            // Refresh premium status in case it changed
            if (refreshPremium) {
                refreshPremium();
            }
            
            // Reload page to reflect changes
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    // Show loading state while fetching premium status or stats
    if (loading || premiumLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center min-h-[400px]">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">My Profile</h2>
                <p className="text-gray-600">Manage your profile information</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Info Card */}
                <div className="lg:col-span-1">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body items-center text-center">
                            {/* Profile Photo */}
                            <div className="avatar mb-4">
                                <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img 
                                        src={user?.photoURL || 'https://via.placeholder.com/150'} 
                                        alt="Profile" 
                                    />
                                </div>
                            </div>

                            {/* Display Name */}
                            <h3 className="text-2xl font-bold">
                                {user?.displayName || 'No Name'}
                            </h3>

                            {/* Premium Badge */}
                            {isPremium && (
                                <div className="badge badge-warning gap-2 mt-2 text-base">
                                    <span>⭐</span>
                                    <span>Premium</span>
                                </div>
                            )}

                            {/* Free Badge (if not premium) */}
                            {!isPremium && (
                                <div className="badge badge-ghost gap-2 mt-2">
                                    <span>Free</span>
                                </div>
                            )}

                            {/* Email (Read-only) */}
                            <p className="text-gray-500 mt-2">{user?.email}</p>

                            {/* Stats */}
                            <div className="stats stats-vertical shadow mt-6 w-full">
                                <div className="stat">
                                    <div className="stat-title">Lessons Created</div>
                                    <div className="stat-value text-primary">{stats.lessonsCreated}</div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title">Lessons Saved</div>
                                    <div className="stat-value text-secondary">{stats.lessonsSaved}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Update Profile Form */}
                <div className="lg:col-span-2">
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h3 className="text-2xl font-bold mb-4">Update Profile</h3>
                            
                            <form onSubmit={handleSubmit(handleUpdateProfile)}>
                                <div className="space-y-4">
                                    {/* Display Name */}
                                    <div>
                                        <label className="label">
                                            <span className="label-text font-semibold">Display Name</span>
                                        </label>
                                        <input
                                            type="text"
                                            {...register('displayName', { 
                                                required: true,
                                                minLength: 2
                                            })}
                                            className="input input-bordered w-full"
                                            placeholder="Enter your display name"
                                            defaultValue={user?.displayName || ''}
                                        />
                                        {errors.displayName?.type === 'required' && (
                                            <p className="text-red-500 text-sm mt-1">Display name is required!</p>
                                        )}
                                        {errors.displayName?.type === 'minLength' && (
                                            <p className="text-red-500 text-sm mt-1">Display name must be at least 2 characters.</p>
                                        )}
                                    </div>

                                    {/* Email (Read-only) */}
                                    <div>
                                        <label className="label">
                                            <span className="label-text font-semibold">Email</span>
                                            <span className="label-text-alt text-gray-500">(Cannot be changed)</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={user?.email || ''}
                                            className="input input-bordered w-full bg-gray-100"
                                            disabled
                                            readOnly
                                        />
                                        <p className="text-gray-500 text-sm mt-1">
                                            Email cannot be changed for security reasons.
                                        </p>
                                    </div>

                                    {/* Profile Photo */}
                                    <div>
                                        <label className="label">
                                            <span className="label-text font-semibold">Profile Photo</span>
                                            <span className="label-text-alt text-gray-500">(Optional)</span>
                                        </label>
                                        <input
                                            type="file"
                                            {...register('photo')}
                                            accept="image/*"
                                            className="file-input file-input-bordered w-full"
                                        />
                                        <p className="text-gray-500 text-sm mt-1">
                                            Upload a new profile photo. Leave empty to keep current photo.
                                        </p>
                                    </div>

                                    {/* Premium Status (Read-only) */}
                                    <div>
                                        <label className="label">
                                            <span className="label-text font-semibold">Account Type</span>
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={isPremium ? 'Premium ⭐' : 'Free'}
                                                className={`input input-bordered w-full ${
                                                    isPremium 
                                                        ? 'bg-yellow-50 border-yellow-300 text-yellow-800' 
                                                        : 'bg-gray-100'
                                                }`}
                                                disabled
                                                readOnly
                                            />
                                            {!isPremium && (
                                                <a 
                                                    href="/pricing" 
                                                    className="btn btn-sm btn-primary"
                                                >
                                                    Upgrade
                                                </a>
                                            )}
                                            {isPremium && (
                                                <div className="badge badge-warning gap-1">
                                                    <span>⭐</span>
                                                    <span>Active</span>
                                                </div>
                                            )}
                                        </div>
                                        {isPremium && (
                                            <p className="text-yellow-600 text-sm mt-1">
                                                You have full access to all premium features!
                                            </p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex gap-4 mt-6">
                                        <button
                                            type="submit"
                                            className="btn btn-primary flex-1"
                                            disabled={isUpdating}
                                        >
                                            {isUpdating ? (
                                                <>
                                                    <span className="loading loading-spinner loading-sm"></span>
                                                    Updating...
                                                </>
                                            ) : (
                                                'Update Profile'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;