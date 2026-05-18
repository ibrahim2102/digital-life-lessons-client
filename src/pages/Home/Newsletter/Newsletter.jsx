import React from 'react';

const Newsletter = () => {
    return (
        <section className="py-16 bg-primary text-primary-content">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold mb-4">Stay Inspired</h2>
                <p className="mb-8 max-w-2xl mx-auto opacity-90">Subscribe to our newsletter to receive the latest life lessons, updates, and community highlights directly in your inbox.</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
                    <input 
                        type="email" 
                        placeholder="Enter your email address" 
                        className="input input-bordered w-full text-base-content" 
                    />
                    <button className="btn btn-secondary">Subscribe Now</button>
                </div>
                <p className="mt-4 text-sm opacity-75">No spam, just wisdom. Unsubscribe anytime.</p>
            </div>
        </section>
    );
};

export default Newsletter;
