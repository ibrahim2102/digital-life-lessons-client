import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import bannerImg1 from '../../../assets/banner1.jpg'
import bannerImg2 from '../../../assets/banner2.jpg'
import bannerImg3 from '../../../assets/banner3.jpg'

const Banner = () => {
    const imgStyle = { width: '100%', height: '60vh', objectFit: 'cover', display: 'block' }; 

    return (
        <div className="relative">
           <Carousel
               className="banner-carousel"
               dynamicHeight={false}
               showThumbs={false}
               thumbHeight={120}       
               showStatus={false}
               showIndicators={true}
               autoPlay={true}
               infiniteLoop={true}
               showArrows={false}
           >
                <div>
                    <img src={bannerImg1} alt="banner 1" style={imgStyle}/>
                </div>
                <div>
                    <img src={bannerImg2} alt="banner 2" style={imgStyle}/>
                </div>
                <div>
                    <img src={bannerImg3} alt="banner 3" style={imgStyle}/>
                </div>
            </Carousel>
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                <div className="text-center text-white max-w-2xl px-4">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Share Wisdom, Inspire Growth</h1>
                    <p className="mb-8 text-lg md:text-xl drop-shadow-md">Join a community dedicated to sharing life lessons and learning from each other's experiences.</p>
                    <button className="btn btn-primary btn-lg shadow-lg border-none hover:scale-105 transition-transform">Start Learning</button>
                </div>
            </div>
        </div>
    );
};

export default Banner;