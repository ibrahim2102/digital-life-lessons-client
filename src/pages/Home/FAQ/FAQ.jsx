import React from 'react';

const FAQ = () => {
    const faqs = [
        {
            question: "Is Digital Life Lessons free to use?",
            answer: "Yes, you can browse and share lessons for free. We also offer premium features for advanced learning tools."
        },
        {
            question: "How can I become a contributor?",
            answer: "Simply sign up for an account and click on 'Add Lesson' in your dashboard to start sharing your wisdom."
        },
        {
            question: "Can I download lessons for offline reading?",
            answer: "Currently, lessons are available online. We are working on an offline mode for our mobile app."
        },
        {
            question: "Is my personal information safe?",
            answer: "Absolutely. We prioritize user privacy and use industry-standard encryption to protect your data."
        }
    ];

    return (
        <section className="py-16 bg-base-100">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                    <p className="text-base-content/70">Got questions? We have answers.</p>
                </div>
                <div className="join join-vertical w-full">
                    {faqs.map((faq, index) => (
                        <div key={index} className="collapse collapse-plus join-item border border-base-300">
                            <input type="radio" name="my-accordion-4" defaultChecked={index === 0} /> 
                            <div className="collapse-title text-xl font-medium">
                                {faq.question}
                            </div>
                            <div className="collapse-content"> 
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
