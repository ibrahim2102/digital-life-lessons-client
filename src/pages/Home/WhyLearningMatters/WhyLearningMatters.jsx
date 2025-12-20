import React from 'react';

const benefits = [
  { title: 'Actionable Wisdom', desc: 'Lessons tied to real scenarios you face every week.' },
  { title: 'Faster Growth', desc: 'Learn from others’ mistakes and compound your progress.' },
  { title: 'Community Insight', desc: 'Perspectives from diverse contributors worldwide.' },
  { title: 'Lasting Change', desc: 'Systems and habits, not just feel-good quotes.' },
];

const WhyLearningMatters = () => (
  <section className="space-y-4">
    <div>
      <h2 className="text-2xl font-semibold">Why Learning From Life Matters</h2>
      <p className="text-sm text-gray-500">Four reasons our community keeps coming back.</p>
    </div>
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {benefits.map((item) => (
        <div key={item.title} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
        </div>
      ))}
    </div>
  </section>
);

export default WhyLearningMatters;