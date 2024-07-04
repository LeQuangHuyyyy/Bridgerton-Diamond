import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './BannerHomePage.css'
import {Link} from "react-router-dom";

export const ExploreTopProducts = () => {
    return (
        <Carousel>
            <Carousel.Item>
                <img className='header' src='./assets/banner/banner1.png'/>
                <Carousel.Caption style={{marginBottom: '20px'}}>
                    <h1 className='custom-heading' style={{color: '#FFD700', fontSize: '65px', fontWeight: 'bold'}}>Eternal Beauty</h1>
                    <p style={{color: '#FFFFFF', fontSize: '25px'}}>Discover our dazzling, exquisite diamond collection for every special moment</p>
                    <Link to="/shop" className="cta-button">Shop Now</Link>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img className='header'
                     src='./assets/banner/banner3.jpg'/>
                <Carousel.Caption>
                    <div className='banner-content'>
                        <h2>Bridgerton</h2>
                        <h5>Diamond</h5>
                    </div>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}