import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'react-toastify';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        toast.error('Invalid payment session');
        navigate('/pricing');
        return;
      }

      try {
        setProcessing(true);
        // Backend will verify session and update user premium status
        const res = await axiosSecure.post('/verify-payment', {
          sessionId,
          email: user?.email
        });

        if (res.data.success) {
          setSuccess(true);
          toast.success('Payment successful! You now have Premium access.');
          // Optionally refresh user data to reflect premium status
          setTimeout(() => {
            navigate('/dashboard/my-profile');
          }, 3000);
        } else {
          toast.error(res.data.message || 'Payment verification failed');
          navigate('/pricing');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        toast.error('Failed to verify payment. Please contact support.');
        navigate('/pricing');
      } finally {
        setProcessing(false);
      }
    };

    if (user?.email) {
      verifyPayment();
    }
  }, [searchParams, user, axiosSecure, navigate]);

  if (processing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow p-8 text-center">
          <div className="loading loading-spinner loading-lg mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Verifying Payment...</h2>
          <p className="text-gray-500">Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your Premium subscription has been activated.
            </p>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-indigo-800">
                <span className="font-semibold">⭐ Premium Access Enabled</span>
              </p>
              <p className="text-xs text-indigo-600 mt-1">
                You can now create premium lessons and enjoy all premium features.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard/my-profile')}
              className="w-full btn btn-primary"
            >
              Go to My Profile
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full btn btn-outline"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentSuccess;