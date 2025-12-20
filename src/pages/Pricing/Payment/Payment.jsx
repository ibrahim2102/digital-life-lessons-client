import React, { useState } from 'react';
import { useNavigate } from 'react-router'; 
import { toast } from 'react-toastify';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import useAuth from '../../../hooks/useAuth';

// --- Define the Fixed Price for the Subscription ---
const FIXED_SUBSCRIPTION_PRICE = 500; // $500.00

const Payment = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  // We no longer need useLocation() or location.state as no lesson data is used.

  const [loading, setLoading] = useState(false);
  
  const displayCost = FIXED_SUBSCRIPTION_PRICE.toFixed(2); // $500.00

  const handlePayment = async () => {
    if (!user?.email) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);

      // --- 1. CHANGE: Only send the fixed cost and senderEmail ---
      const res = await axiosSecure.post('/create-checkout-session', {
        
        cost: FIXED_SUBSCRIPTION_PRICE, 
        senderEmail: user.email,
      });

      // 🔥 Redirect to Stripe Checkout
      window.location.href = res.data.url;

    } catch (error) {
      console.error(error);
      window.location.href = '/payment-cancel?reason=User cancelled the payment';
      toast.error('Failed to start payment');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow p-6 space-y-6">

        <h2 className="text-2xl font-semibold text-center">
          Complete Payment for Premium Access
        </h2>

        <div className="rounded-xl border bg-gray-50 p-4 space-y-2">
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Access Type:</span>
            <span className="font-medium">Full Premium Subscription</span>
          </div>

          <div className="flex justify-between text-lg font-semibold border-t pt-3">
            <span>Total</span>
            {/* Display the FIXED price */}
            <span>${displayCost}</span> 
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 py-3 text-white font-medium hover:bg-indigo-700 disabled:opacity-60"
        >
          {/* Display the FIXED price in the button */}
          {loading ? 'Redirecting...' : `Pay $${displayCost} for Subscription`}
        </button>

        <button
          onClick={() => navigate(-1)}
          className="w-full text-sm text-gray-500 hover:text-gray-700"
        >
          ← Go back
        </button>
      </div>
    </div>
  );
};

export default Payment;