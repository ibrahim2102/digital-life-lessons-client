import React from 'react';
import Banner from '../Banner/Banner';
import FeaturedLifeLessons from '../FeaturedLifeLessons/FeaturedLifeLessons';
import WhyLearningMatters from '../WhyLearningMatters/WhyLearningMatters';
import TopContributors from '../TopContributors/TopContributors';
import MostSavedLessons from '../MostSavedLessons/MostSavedLessons';
import Stats from '../Stats/Stats';
import HowItWorks from '../HowItWorks/HowItWorks';
import Testimonials from '../Testimonials/Testimonials';
import FAQ from '../FAQ/FAQ';
import Newsletter from '../Newsletter/Newsletter';

const Home = () => {
    return (
        <div className="min-h-screen bg-base-100">
            <Banner></Banner>
            <Stats></Stats>
            <FeaturedLifeLessons></FeaturedLifeLessons>
            <HowItWorks></HowItWorks>
            <WhyLearningMatters></WhyLearningMatters>
            <MostSavedLessons></MostSavedLessons>
            <TopContributors></TopContributors>
            <Testimonials></Testimonials>
            <FAQ></FAQ>
            <Newsletter></Newsletter>
        </div>
    );
};

export default Home;