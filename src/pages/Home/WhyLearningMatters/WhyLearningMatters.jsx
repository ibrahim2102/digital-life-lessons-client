import React from 'react';

const benefits = [
  { title: 'Actionable Wisdom', desc: 'Lessons tied to real scenarios you face every week.' },
  { title: 'Faster Growth', desc: 'Learn from others’ mistakes and compound your progress.' },
  { title: 'Community Insight', desc: 'Perspectives from diverse contributors worldwide.' },
  { title: 'Lasting Change', desc: 'Systems and habits, not just feel-good quotes.' },
];

const WhyLearningMatters = () => (
  <section className="py-16 bg-base-200">
    <div className="container mx-auto px-4 space-y-8">
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-4">Why Learning From Life Matters</h2>
      <p className="text-base-content/70">Four reasons our community keeps coming back.</p>
    </div>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {benefits.map((item) => (
        <div key={item.title} className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body">
            <h3 className="card-title text-lg">{item.title}</h3>
            <p className="text-sm text-base-content/70">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
    </div>
  </section>
);

export default WhyLearningMatters;