import React from 'react';

const Stats = () => {
    return (
        <section className="py-12 bg-base-200">
            <div className="container mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
                    <p className="text-base-content/70">Growing community of learners and creators</p>
                </div>
                <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
                    <div className="stat place-items-center">
                        <div className="stat-title">Total Users</div>
                        <div className="stat-value text-primary">31K</div>
                        <div className="stat-desc">Jan 1st - Feb 1st</div>
                    </div>
                    <div className="stat place-items-center">
                        <div className="stat-title">Lessons Shared</div>
                        <div className="stat-value text-secondary">4,200</div>
                        <div className="stat-desc">↗︎ 400 (22%)</div>
                    </div>
                    <div className="stat place-items-center">
                        <div className="stat-title">New Registers</div>
                        <div className="stat-value">1,200</div>
                        <div className="stat-desc">↘︎ 90 (14%)</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Stats;
