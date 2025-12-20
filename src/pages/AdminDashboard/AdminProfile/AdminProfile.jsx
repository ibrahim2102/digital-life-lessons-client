import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import useAuth from '../../../hooks/useAuth';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useRole from '../../../hooks/useRole';

const AdminProfile = () => {
  const { user, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { role, roleLoading } = useRole();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [adminData, setAdminData] = useState(null);

  // Fetch admin data from MongoDB
  useEffect(() => {
    const fetchAdminData = async () => {
      if (!user?.email) return;

      try {
        setLoading(true);
        const res = await axiosSecure.get('/users/profile', {
          params: { email: user.email }
        });

        if (res.data) {
          setAdminData(res.data);
          setValue('displayName', res.data.displayName || user.displayName || '');
          setValue('email', res.data.email || user.email || '');
          setValue('role', res.data.role || 'admin');
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
        // Set defaults from Firebase user
        setValue('displayName', user.displayName || '');
        setValue('email', user.email || '');
        setValue('role', role || 'admin');
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) {
      fetchAdminData();
    }
  }, [user, axiosSecure, setValue, role]);

  // Handle profile update
  const handleUpdateProfile = async (data) => {
    setIsUpdating(true);
    try {
      let photoURL = user.photoURL || adminData?.photoURL;

      // Handle image upload if new image is provided
      if (data.photo && data.photo.length > 0) {
        const profileImg = data.photo[0];
        
        if (!profileImg.type.startsWith('image/')) {
          toast.error('Please upload a valid image file');
          setIsUpdating(false);
          return;
        }

        if (profileImg.size > 5 * 1024 * 1024) {
          toast.error('Image size must be less than 5MB');
          setIsUpdating(false);
          return;
        }

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

      // Update MongoDB user profile
      const updateData = {
        displayName: data.displayName,
        photoURL: photoURL,
        role: data.role || 'admin' // Only admins can update role
      };

      const updateRes = await axiosSecure.patch(`/admin/users/${adminData?._id || user.email}`, updateData);

      if (updateRes.data?.success) {
        toast.success('Profile updated successfully!');
        // Refresh admin data
        const refreshRes = await axiosSecure.get('/users/profile', {
          params: { email: user.email }
        });
        if (refreshRes.data) {
          setAdminData(refreshRes.data);
        }
      } else {
        toast.error('Failed to update profile in database');
      }

    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading || roleLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Admin Profile</h2>
        <p className="text-gray-600">Manage your admin profile information</p>
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
                    src={user?.photoURL || adminData?.photoURL || 'https://via.placeholder.com/150'} 
                    alt="Admin Profile" 
                  />
                </div>
              </div>

              {/* Display Name */}
              <h3 className="text-2xl font-bold">
                {user?.displayName || adminData?.displayName || 'Admin'}
              </h3>

              {/* Admin Badge */}
              <div className="badge badge-warning gap-2 mt-2 text-base">
                <span>👑</span>
                <span>Administrator</span>
              </div>

              {/* Email */}
              <p className="text-gray-500 mt-2">{user?.email || adminData?.email}</p>

              {/* Role */}
              <div className="mt-4">
                <p className="text-sm text-gray-500">Current Role</p>
                <p className="text-lg font-semibold text-primary">
                  {role || adminData?.role || 'admin'}
                </p>
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
                      defaultValue={user?.displayName || adminData?.displayName || ''}
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
                      value={user?.email || adminData?.email || ''}
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

                  {/* User Role (Admin can change their own role) */}
                  <div>
                    <label className="label">
                      <span className="label-text font-semibold">User Role</span>
                    </label>
                    <select
                      {...register('role', { required: true })}
                      className="select select-bordered w-full"
                      defaultValue={role || adminData?.role || 'admin'}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    <p className="text-gray-500 text-sm mt-1">
                      Change your role. Be careful - changing to 'user' will remove admin access!
                    </p>
                    {errors.role?.type === 'required' && (
                      <p className="text-red-500 text-sm mt-1">Role is required!</p>
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

export default AdminProfile;