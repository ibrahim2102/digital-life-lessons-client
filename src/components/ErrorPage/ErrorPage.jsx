import React from 'react';
import { Link, useRouteError } from 'react-router';

const ErrorPage = () => {
  // useRouteError is optional if you want route-specific info
  const error = useRouteError?.() || {};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="text-center max-w-lg">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Oops! Page not found.
        </h2>
        {error.status && (
          <p className="text-gray-500 mb-4">
            {error.status}: {error.statusText || error.message}
          </p>
        )}
        <p className="text-gray-500 mb-6">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/" className="btn btn-primary">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
