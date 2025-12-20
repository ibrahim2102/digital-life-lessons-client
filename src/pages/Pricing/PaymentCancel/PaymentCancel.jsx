import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'react-toastify';

const PaymentCancel = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reason = searchParams.get('reason') || 'Payment was cancelled';

  useEffect(() => {
    toast.warning('Payment cancelled. Please try again or contact support if you need help.');
  }, []);

  const handleRetry = () => {
    navigate('/pricing');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const handleContactSupport = () => {
    // You can replace this with actual support contact info
    window.location.href = 'mailto:support@digitallifelessons.com';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center space-y-6">
        {/* Error Icon */}
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h2>
          <p className="text-gray-600">
            Your payment was not completed. Your account remains on the free plan.
          </p>
        </div>

        {/* Reason Box */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">Reason:</span>
          </p>
          <p className="text-xs text-yellow-700 mt-1">
            {reason}
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 mb-2">
            <span className="font-semibold">💡 What's Next?</span>
          </p>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• You can try purchasing again</li>
            <li>• Your free account is still active</li>
            <li>• No charges were made to your account</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleRetry}
            className="w-full btn btn-primary"
          >
            Try Again
          </button>
          
          <button
            onClick={handleContactSupport}
            className="w-full btn btn-outline btn-warning"
          >
            Contact Support
          </button>

          <button
            onClick={handleGoHome}
            className="w-full btn btn-ghost"
          >
            Go Back Home
          </button>
        </div>

        {/* FAQ Link */}
        <div className="border-t pt-4">
          <p className="text-xs text-gray-500 mb-2">
            Having trouble?
          </p>
          <a
            href="/faq#payment"
            className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            View Payment FAQ →
          </a>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;