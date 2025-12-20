import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const UpdateLesson = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Check if user is premium
    const isPremiumUser = user?.isPremium || user?.subscription === 'premium' || false;

    const categories = [
        'Personal Growth',
        'Career',
        'Relationships',
        'Mindset',
        'Mistakes Learned'
    ];

    const emotionalTones = [
        'Motivational',
        'Sad',
        'Realization',
        'Gratitude'
    ];

    const privacyOptions = ['Public', 'Private'];
    const accessLevels = ['Free', 'Premium'];

    // Fetch lesson data
    useEffect(() => {
        const fetchLesson = async () => {
            if (!id) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await axiosSecure.get(`/dashboard/add-lessons/${id}`);
                
                // ✅ Fix: Handle both response structures
                const lesson = response.data?.data || response.data;
                
                if (!lesson || !lesson.title) {
                    toast.error('Lesson not found');
                    navigate('/dashboard/my-lessons');
                    return;
                }

                // Populate form with existing data
                setValue('title', lesson.title || '');
                setValue('description', lesson.description || '');
                setValue('category', lesson.category || '');
                setValue('emotionalTone', lesson.emotionalTone || '');
                setValue('privacy', lesson.privacy || '');
                setValue('accessLevel', lesson.accessLevel || 'Free');
            } catch (error) {
                console.error('Error fetching lesson:', error);
                toast.error(error.response?.data?.message || 'Failed to load lesson');
                navigate('/dashboard/my-lessons');
            } finally {
                setLoading(false);
            }
        };

        fetchLesson();
    }, [id, axiosSecure, setValue, navigate]);

    // Handle update lesson
   // Handle update lesson
const handleUpdateLesson = async (data) => {
    setIsSubmitting(true);
    try {
        // Handle image upload if new image is provided
        let imageURL = null;
        if (data.image && data.image.length > 0) {
            const lessonImage = data.image[0];

            if (!lessonImage.type.startsWith('image/')) {
                toast.error('Please upload a valid image file');
                setIsSubmitting(false);
                return;
            }

            if (lessonImage.size > 5 * 1024 * 1024) {
                toast.error('Image size must be less than 5MB');
                setIsSubmitting(false);
                return;
            }

            try {
                const formData = new FormData();
                formData.append('image', lessonImage);

                const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;
                const axios = (await import('axios')).default;
                const imageResponse = await axios.post(image_API_URL, formData);
                imageURL = imageResponse.data.data.url;
            } catch (imageError) {
                console.error('Image upload error:', imageError);
                toast.error('Failed to upload image. Please try again.');
                setIsSubmitting(false);
                return;
            }
        }

        // Prepare update data
        const updateData = {
            title: data.title,
            description: data.description,
            category: data.category,
            emotionalTone: data.emotionalTone,
            privacy: data.privacy,
            accessLevel: data.accessLevel,
        };

        // Add image URL if uploaded
        if (imageURL) {
            updateData.image = imageURL;
        }

        console.log('Sending update request:', { id, updateData });

        const response = await axiosSecure.patch(`/dashboard/add-lessons/${id}`, updateData);

        console.log('Update response:', response.data);

        if (response.data?.success) {
            toast.success('Lesson updated successfully!');
            // Small delay before navigation to ensure toast is visible
            setTimeout(() => {
                navigate('/dashboard/my-lessons');
            }, 500);
        } else {
            toast.error(response.data?.message || 'Failed to update lesson');
        }
    } catch (error) {
        console.error('Error updating lesson:', error);
        console.error('Error response:', error.response);
        
        // More detailed error handling
        if (error.response?.status === 401) {
            toast.error('Unauthorized. Please sign in again.');
            navigate('/login');
        } else if (error.response?.status === 403) {
            toast.error('You do not have permission to update this lesson.');
        } else if (error.response?.status === 404) {
            toast.error('Lesson not found.');
            navigate('/dashboard/my-lessons');
        } else {
            toast.error(error.response?.data?.message || 'Failed to update lesson. Please try again.');
        }
    } finally {
        setIsSubmitting(false);
    }
};

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center min-h-[400px]">
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Update Lesson</h2>
                <p className="text-gray-600">Edit your lesson details</p>
            </div>

            <div className="card bg-base-100 shadow-xl">
                <form className="card-body" onSubmit={handleSubmit(handleUpdateLesson)} autoComplete="off">
                    <fieldset className="fieldset space-y-6" disabled={isSubmitting}>
                        {/* Lesson Title */}
                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">Lesson Title</span>
                            </label>
                            <input
                                type="text"
                                {...register('title', { required: true, minLength: 5 })}
                                className="input input-bordered w-full"
                                placeholder="Enter a compelling title for your lesson"
                                autoComplete="off"
                            />
                            {errors.title?.type === 'required' && (
                                <p className="text-red-500 text-sm mt-1">Lesson title is required!</p>
                            )}
                            {errors.title?.type === 'minLength' && (
                                <p className="text-red-500 text-sm mt-1">Title must be at least 5 characters long.</p>
                            )}
                        </div>

                        {/* Category Dropdown */}
                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">Category</span>
                            </label>
                            <select
                                {...register('category', { required: true })}
                                className="select select-bordered w-full"
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            {errors.category?.type === 'required' && (
                                <p className="text-red-500 text-sm mt-1">Please select a category!</p>
                            )}
                        </div>

                        {/* Emotional Tone Dropdown */}
                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">Emotional Tone</span>
                            </label>
                            <select
                                {...register('emotionalTone', { required: true })}
                                className="select select-bordered w-full"
                            >
                                <option value="">Select an emotional tone</option>
                                {emotionalTones.map((tone) => (
                                    <option key={tone} value={tone}>
                                        {tone}
                                    </option>
                                ))}
                            </select>
                            {errors.emotionalTone?.type === 'required' && (
                                <p className="text-red-500 text-sm mt-1">Please select an emotional tone!</p>
                            )}
                        </div>

                        {/* Full Description / Story / Insight */}
                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">Full Description / Story / Insight</span>
                            </label>
                            <textarea
                                {...register('description', { required: true, minLength: 50 })}
                                className="textarea textarea-bordered w-full h-48"
                                placeholder="Share your story, insights, and the lesson you learned. Be detailed and authentic..."
                                autoComplete="off"
                            ></textarea>
                            {errors.description?.type === 'required' && (
                                <p className="text-red-500 text-sm mt-1">Description is required!</p>
                            )}
                            {errors.description?.type === 'minLength' && (
                                <p className="text-red-500 text-sm mt-1">Description must be at least 50 characters long.</p>
                            )}
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">Lesson Image</span>
                                <span className="label-text-alt text-gray-500">(Optional)</span>
                            </label>
                            <input
                                type="file"
                                {...register('image')}
                                accept="image/*"
                                className="file-input file-input-bordered w-full"
                            />
                            <p className="text-gray-500 text-sm mt-1">
                                Upload a new image. Leave empty to keep current image.
                            </p>
                        </div>

                        {/* Privacy Dropdown */}
                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">Privacy</span>
                            </label>
                            <select
                                {...register('privacy', { required: true })}
                                className="select select-bordered w-full"
                            >
                                <option value="">Select privacy setting</option>
                                {privacyOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            {errors.privacy?.type === 'required' && (
                                <p className="text-red-500 text-sm mt-1">Please select a privacy setting!</p>
                            )}
                        </div>

                        {/* Access Level Dropdown */}
                        <div>
                            <label className="label">
                                <span className="label-text font-semibold">Access Level</span>
                            </label>
                            {!isPremiumUser ? (
                                <>
                                    <select
                                        {...register('accessLevel', { required: true })}
                                        className="select select-bordered w-full"
                                        disabled
                                        defaultValue="Free"
                                    >
                                        <option value="Free">Free</option>
                                        <option value="Premium" disabled>Premium (Upgrade Required)</option>
                                    </select>
                                    <p className="text-gray-500 text-sm mt-1">
                                        <span
                                            className="text-blue-600 cursor-pointer hover:underline"
                                            onClick={() => navigate('/pricing')}
                                        >
                                            Upgrade to Premium
                                        </span>{' '}
                                        to create paid lessons
                                    </p>
                                </>
                            ) : (
                                <select
                                    {...register('accessLevel', { required: true })}
                                    className="select select-bordered w-full"
                                >
                                    {accessLevels.map((level) => (
                                        <option key={level} value={level}>
                                            {level}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {errors.accessLevel?.type === 'required' && (
                                <p className="text-red-500 text-sm mt-1">Please select an access level!</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-4 mt-6">
                            <button 
                                type="submit" 
                                className="btn btn-primary flex-1"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="loading loading-spinner loading-sm"></span>
                                        Updating...
                                    </>
                                ) : (
                                    'Update Lesson'
                                )}
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-outline"
                                disabled={isSubmitting}
                                onClick={() => navigate('/dashboard/my-lessons')}
                            >
                                Cancel
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    );
};

export default UpdateLesson;