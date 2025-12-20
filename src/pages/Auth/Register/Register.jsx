import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { Link, useNavigate } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';
import axios from 'axios';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { registerUser, updateUserProfile } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const handleRegistration = (data) => {
    console.log(data);
    const profileImg = data.photo[0];

    registerUser(data.email, data.password)
      .then(result => {
        console.log(result.user);

        const formData = new FormData();
        formData.append('image', profileImg);
        const image_API_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;

        axios.post(image_API_URL, formData)
          .then(res => {
            const photoURL = res.data.data.url;

            // Save user to database
            const userInfo = {
              email: data.email,
              displayName: data.name,
              photoURL: photoURL
            };

            axiosSecure.post('/users', userInfo)
              .then(res => {
                if (res.data.insertedId) {
                  console.log('User created.');
                  // Redirect after DB save
                  navigate('/'); // ← Redirect to root
                }
              });

            // Update Firebase profile
            updateUserProfile({ displayName: data.name, photoURL })
              .then(() => console.log('User profile updated'))
              .catch(console.log);
          });
      })
      .catch(console.log);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
        <form
          onSubmit={handleSubmit(handleRegistration)}
          className="card-body"
          autoComplete="off"
        >
          <fieldset className="fieldset">
            <label className="label">Name</label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="input input-bordered w-full"
              placeholder="Your name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">Name is required!</p>
            )}

            <label className="label mt-2">Profile Photo</label>
            <input
              type="file"
              {...register("photo", { required: true })}
              className="file-input w-full"
            />
            {errors.photo && (
              <p className="text-red-500 text-sm mt-1">Photo is required!</p>
            )}

            <label className="label mt-2">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="input input-bordered w-full"
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">Email is required!</p>
            )}

            <label className="label mt-2">Password</label>
            <input
              type="password"
              {...register("password", {
                required: true,
                minLength: 6,
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/
              })}
              className="input input-bordered w-full"
              placeholder="Password"
              autoComplete="new-password"
            />
            {errors.password?.type === 'required' && (
              <p className="text-red-500 text-sm mt-1">Password is required.</p>
            )}
            {errors.password?.type === 'minLength' && (
              <p className="text-red-500 text-sm mt-1">
                Password must be at least 6 characters.
              </p>
            )}
            {errors.password?.type === 'pattern' && (
              <p className="text-red-500 text-sm mt-1">
                Password must include at least one uppercase letter, one lowercase letter, and one number.
              </p>
            )}

            <div className="mt-2">
              <a className="link link-hover text-sm">Forgot password?</a>
            </div>

            <button className="btn btn-neutral mt-4 w-full">Register</button>
          </fieldset>

          <p className="mt-4 text-sm text-center">
            Already have an account?{' '}
            <Link to='/login' className='text-blue-400 underline'>
              Login
            </Link>
          </p>
        </form>

        {/* Social login buttons */}
        <div className="px-6 pb-6 pt-2">
          <SocialLogin />
        </div>
      </div>
    </div>
  );
};

export default Register;
