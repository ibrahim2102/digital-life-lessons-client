import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import bannerImg1 from '../../../assets/banner1.jpg'
import bannerImg2 from '../../../assets/banner2.jpg'
import bannerImg3 from '../../../assets/banner3.jpg'

const Banner = () => {
    const imgStyle = { width: '100%', height: '320px', objectFit: 'cover', display: 'block' }; 

    return (
           <Carousel
               className="banner-carousel"
               dynamicHeight={false}
               showThumbs={false}
               thumbHeight={120}       
               showStatus={false}
               showIndicators={true}
               autoPlay={true}
               infiniteLoop={true}
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
    );
};

export default Banner;