import React from 'react';
import { FaUserPlus, FaBookOpen, FaChalkboardTeacher } from 'react-icons/fa';

const HowItWorks = () => {
    const steps = [
        {
            id: 1,
            icon: <FaUserPlus className="text-4xl text-primary" />,
            title: 'Sign Up',
            description: 'Create your account in seconds and join our community.'
        },
        {
            id: 2,
            icon: <FaBookOpen className="text-4xl text-secondary" />,
            title: 'Browse Lessons',
            description: 'Explore thousands of life lessons shared by others.'
        },
        {
            id: 3,
            icon: <FaChalkboardTeacher className="text-4xl text-accent" />,
            title: 'Share & Learn',
            description: 'Share your own experiences or learn from experts.'
        }
    ];

    return (
        <section className="py-16 bg-base-100">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                    <p className="text-base-content/70 max-w-2xl mx-auto">Getting started with Digital Life Lessons is easy. Follow these simple steps to begin your journey.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map(step => (
                        <div key={step.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border border-base-200">
                            <div className="card-body items-center text-center">
                                <div className="mb-4 p-4 bg-base-200 rounded-full">
                                    {step.icon}
                                </div>
                                <h3 className="card-title mb-2">{step.title}</h3>
                                <p>{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
