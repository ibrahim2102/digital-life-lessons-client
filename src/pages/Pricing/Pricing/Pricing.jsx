import React from 'react';
import { Link } from 'react-router';
import usePremium from '../../../hooks/usePremium';
import useAuth from '../../../hooks/useAuth';

const Pricing = () => {
    const { user } = useAuth();
    const { isPremium } = usePremium();
    
    const pricingFeatures = [
        { feature: 'Number of Lessons', free: 'Up to 5 lessons', premium: 'Unlimited lessons' },
        { feature: 'Premium Lesson Creation', free: '❌', premium: '✅' },
        { feature: 'Ad-Free Experience', free: '❌', premium: '✅' },
        { feature: 'Priority Listing', free: '❌', premium: '✅' },
        { feature: 'Advanced Analytics', free: '❌', premium: '✅' },
        { feature: 'Custom Branding', free: '❌', premium: '✅' },
        { feature: 'Priority Support', free: '❌', premium: '✅' },
        { feature: 'Export Lessons', free: 'Basic export', premium: 'Full export with analytics' },
    ];

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold mb-4">Pricing Plans</h1>
                <p className="text-gray-600">Choose the plan that's right for you</p>
            </div>

            <div className="max-w-4xl mx-auto">
                <div className="overflow-x-auto">
                    <table className="table table-zebra w-full">
                        <thead>
                            <tr>
                                <th className="text-lg font-semibold">Features</th>
                                <th className="text-center text-lg font-semibold">Free</th>
                                <th className="text-center text-lg font-semibold">Premium</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pricingFeatures.map((item, index) => (
                                <tr key={index}>
                                    <td className="font-semibold">{item.feature}</td>
                                    <td className="text-center">{item.free}</td>
                                    <td className="text-center">{item.premium}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Premium Status Message */}
                {user && isPremium && (
                    <div className="mt-8 flex justify-center">
                        <div className="alert alert-success max-w-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <h3 className="font-bold">You already have Premium! ⭐</h3>
                                <div className="text-xs">Enjoy all premium features and benefits.</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Upgrade Button - Disabled if premium */}
                <div className="mt-8 flex justify-center gap-4">
                    {user ? (
                        <Link to={isPremium ? '#' : '/payment'}>
                            <button 
                                className={`btn btn-primary ${isPremium ? 'btn-disabled' : ''}`}
                                disabled={isPremium}
                            >
                                {isPremium ? (
                                    <>
                                        <span>⭐</span>
                                        Already Premium
                                    </>
                                ) : (
                                    'Upgrade to Premium'
                                )}
                            </button>
                        </Link>
                    ) : (
                        <Link to="/login">
                            <button className="btn btn-primary">
                                Sign In to Upgrade
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Pricing;