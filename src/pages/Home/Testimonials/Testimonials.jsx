import React from 'react';

const Testimonials = () => {
    const testimonials = [
        {
            id: 1,
            name: 'Sarah Johnson',
            role: 'Student',
            text: 'This platform has completely changed how I approach learning. The community is incredibly supportive!',
            avatar: 'https://i.pravatar.cc/150?img=1'
        },
        {
            id: 2,
            name: 'Michael Chen',
            role: 'Content Creator',
            text: 'Sharing my life lessons here has been a rewarding experience. I love connecting with eager learners.',
            avatar: 'https://i.pravatar.cc/150?img=11'
        },
        {
            id: 3,
            name: 'Emily Davis',
            role: 'Lifelong Learner',
            text: 'The quality of content is unmatched. I find something new and inspiring every single day.',
            avatar: 'https://i.pravatar.cc/150?img=5'
        }
    ];

    return (
        <section className="py-16 bg-base-200">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
                    <p className="text-base-content/70">Hear from our community members about their experiences.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map(testimonial => (
                        <div key={testimonial.id} className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="avatar">
                                        <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                            <img src={testimonial.avatar} alt={testimonial.name} />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold">{testimonial.name}</h4>
                                        <p className="text-xs text-base-content/60">{testimonial.role}</p>
                                    </div>
                                </div>
                                <p className="italic">"{testimonial.text}"</p>
                                <div className="card-actions justify-end mt-4">
                                    <div className="rating rating-sm">
                                        <input type="radio" name={`rating-${testimonial.id}`} className="mask mask-star-2 bg-orange-400" checked readOnly />
                                        <input type="radio" name={`rating-${testimonial.id}`} className="mask mask-star-2 bg-orange-400" checked readOnly />
                                        <input type="radio" name={`rating-${testimonial.id}`} className="mask mask-star-2 bg-orange-400" checked readOnly />
                                        <input type="radio" name={`rating-${testimonial.id}`} className="mask mask-star-2 bg-orange-400" checked readOnly />
                                        <input type="radio" name={`rating-${testimonial.id}`} className="mask mask-star-2 bg-orange-400" checked readOnly />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
