import React from 'react';
import { useForm } from 'react-hook-form';
import useAuth from '../../../hooks/useAuth';
import { Link, useNavigate } from 'react-router';
import SocialLogin from '../SocialLogin/SocialLogin';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signInUser } = useAuth();
  const navigate = useNavigate();
  const handleLogin = (data) => {
    console.log(data);
    signInUser(data.email, data.password)
      .then(result => {
        console.log(result.user);
        navigate('/')
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="card bg-base-100 w-full max-w-sm shadow-2xl">
        <form
          className="card-body"
          onSubmit={handleSubmit(handleLogin)}
          autoComplete="off"
        >
          <fieldset className="fieldset">
            <label className="label">Email</label>
            <input
              type="email"
              {...register('email', { required: true })}
              className="input input-bordered w-full"
              placeholder="Email"
              autoComplete="off"
            />
            {errors.email?.type === 'required' && (
              <p className="text-red-500 text-sm mt-1">Email is required!</p>
            )}

            <label className="label mt-2">Password</label>
            <input
              type="password"
              {...register('password', { required: true, minLength: 6 })}
              className="input input-bordered w-full"
              placeholder="Password"
              autoComplete="new-password"
            />
            {errors.password?.type === 'required' && (
              <p className="text-red-500 text-sm mt-1">Password required.</p>
            )}
            {errors.password?.type === 'minLength' && (
              <p className="text-red-500 text-sm mt-1">
                Password must be at least 6 characters.
              </p>
            )}

            <div className="mt-2">
              <a className="link link-hover text-sm">Forgot password?</a>
            </div>

            <button className="btn btn-neutral mt-4 w-full">Login</button>
          </fieldset>

          <p className="mt-4 text-sm text-center">
            New to this website?{' '}
            <Link to="/register" className="text-blue-400 underline">
              Register
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

export default Login;
