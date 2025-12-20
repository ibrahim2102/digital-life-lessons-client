import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const CreatorProfile = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosSecure.get('/users/profile', {
          params: { email }
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [email, axiosSecure, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <span className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-10 max-w-xl">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body items-center text-center space-y-3">

          {/* Avatar */}
          <div className="avatar">
            <div className="w-24 rounded-full ring ring-primary ring-offset-2">
              <img
                src={user.photoURL}
                alt={user.displayName}
                onError={(e) => {
                  e.target.src = 'https://i.ibb.co/2d0ZLzP/avatar.png';
                }}
              />
            </div>
          </div>

          {/* Name */}
          <h2 className="text-2xl font-bold">
            {user.displayName}
          </h2>

          {/* Email */}
          <p className="text-sm text-gray-500">
            {user.email}
          </p>

          {/* Role */}
          <span className="badge badge-outline">
            {user.role}
          </span>

          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-sm mt-4"
          >
            ← Go back
          </button>

        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;
