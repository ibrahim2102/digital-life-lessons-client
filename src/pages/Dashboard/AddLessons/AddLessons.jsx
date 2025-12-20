import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import usePremium from '../../../hooks/usePremium';


const AddLessons = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { isPremium } = usePremium();
  const [isSubmitting, setIsSubmitting] = useState(false);
  


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

  const privacyOptions = [
    'Public',
    // 'Private'
  ];

  const handleAddLesson = async (data) => {
    if (!user?.email) {
      toast.error('Please login first');
      return;
    }

    setIsSubmitting(true);
    try {
      let imageURL = null;

      // Image upload (optional)
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

          const imageResponse = await axios.post(image_API_URL, formData);
          imageURL = imageResponse.data.data.url;
        } catch (imageError) {
          console.error('Image upload error:', imageError);
          toast.error('Failed to upload image. Lesson will be saved without image.');
        }

      }

      const lessonData = {
        title: data.title,
        category: data.category,
        emotionalTone: data.emotionalTone,
        description: data.description,
        privacy: data.privacy,
        accessLevel: data.accessLevel,
        image: imageURL,
        email: user.email,
        authorName: user.displayName || user.email,   // creator name
        authorPhoto: user.photoURL || null,           // creator photo
        createdAt: new Date(),
        views: 0,
        saves: 0,
        reactions: 0
      };

      const res = await axiosSecure.post('/dashboard/add-lessons', lessonData);

      if (res.data.insertedId || res.data.success) {
        toast.success('Lesson added successfully!');
        
        reset();
      } else {
        throw new Error('Failed to save lesson');
      }
    } catch (error) {
      console.error('Error adding lesson:', error);
      toast.error(error.response?.data?.message || 'Failed to add lesson. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  
  };

  return (

     

    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Add New Lesson</h2>
        <p className="text-gray-600">Share your life lesson with the community</p>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <form className="card-body" onSubmit={handleSubmit(handleAddLesson)} autoComplete="off">
          <fieldset className="fieldset space-y-6">
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
                disabled={isSubmitting}
              />
              {errors.title?.type === 'required' && (
                <p className="text-red-500 text-sm mt-1">Lesson title is required!</p>
              )}
              {errors.title?.type === 'minLength' && (
                <p className="text-red-500 text-sm mt-1">Title must be at least 5 characters long.</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Category</span>
              </label>
              <select
                {...register('category', { required: true })}
                className="select select-bordered w-full"
                disabled={isSubmitting}
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

            {/* Emotional Tone */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Emotional Tone</span>
              </label>
              <select
                {...register('emotionalTone', { required: true })}
                className="select select-bordered w-full"
                disabled={isSubmitting}
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

            {/* Description */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Full Description / Story / Insight</span>
              </label>
              <textarea
                {...register('description', { required: true, minLength: 50 })}
                className="textarea textarea-bordered w-full h-48"
                placeholder="Share your story, insights, and the lesson you learned. Be detailed and authentic..."
                autoComplete="off"
                disabled={isSubmitting}
              ></textarea>
              {errors.description?.type === 'required' && (
                <p className="text-red-500 text-sm mt-1">Description is required!</p>
              )}
              {errors.description?.type === 'minLength' && (
                <p className="text-red-500 text-sm mt-1">Description must be at least 50 characters long.</p>
              )}
            </div>

            {/* Image */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Image</span>
                <span className="label-text-alt text-gray-500">(Optional)</span>
              </label>
              <input
                type="file"
                {...register('image')}
                accept="image/*"
                className="file-input file-input-bordered w-full"
                disabled={isSubmitting}
              />
              <p className="text-gray-500 text-sm mt-1">
                Upload an image to accompany your lesson (Max 5MB, JPG/PNG/GIF)
              </p>
            </div>

            {/* Privacy */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Privacy</span>
              </label>
              <select
                {...register('privacy', { required: true })}
                className="select select-bordered w-full"
                disabled={isSubmitting}
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

            {/* Access Level */}
            <div>
              <label className="label">
                <span className="label-text font-semibold">Access Level</span>
              </label>
              {!isPremium ? (
                <>
                  <div
                    className="tooltip tooltip-right w-full"
                    data-tip="Upgrade to Premium to create paid lessons"
                  >
                    <select
                      {...register('accessLevel', { required: true })}
                      className="select select-bordered w-full"
                      disabled={true}
                      defaultValue="Free"
                    >
                      <option value="Free">Free</option>
                      <option value="Premium" disabled>Premium (Upgrade Required)</option>
                    </select>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    <span
                      className="text-blue-600 cursor-pointer hover:underline"
                      onClick={() => (window.location.href = '/pricing')}
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
                  defaultValue="Free"
                  disabled={isSubmitting}
                >
                  <option value="Free">Free</option>
                  <option value="Premium">Premium</option>
                </select>
              )}
              {errors.accessLevel?.type === 'required' && (
                <p className="text-red-500 text-sm mt-1">Please select an access level!</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                className="btn btn-primary flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Adding Lesson...
                  </>
                ) : (
                  'Add Lesson'
                )}
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => reset()}
                disabled={isSubmitting}
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

export default AddLessons;