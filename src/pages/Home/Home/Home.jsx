import React from 'react';
import Banner from '../Banner/Banner';
import FeaturedLifeLessons from '../FeaturedLifeLessons/FeaturedLifeLessons';
import WhyLearningMatters from '../WhyLearningMatters/WhyLearningMatters';
import TopContributors from '../TopContributors/TopContributors';
import MostSavedLessons from '../MostSavedLessons/MostSavedLessons';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <FeaturedLifeLessons></FeaturedLifeLessons>
            <WhyLearningMatters></WhyLearningMatters>
            <TopContributors></TopContributors>
            <MostSavedLessons></MostSavedLessons>

        </div>
    );
};

export default Home;