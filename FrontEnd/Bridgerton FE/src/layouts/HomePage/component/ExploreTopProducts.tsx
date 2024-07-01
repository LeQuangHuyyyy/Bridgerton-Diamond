import React from 'react';
import Carousel from 'react-bootstrap/Carousel';

export const ExploreTopProducts = () => {
    return (
        <Carousel>
            <Carousel.Item>
                <img className='header' src="https://images3.alphacoders.com/689/689047.jpg"/>
                <Carousel.Caption>
                    <h3>First slide label</h3>
                    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img className='header'
                     src="https://lh3.googleusercontent.com/GwX-K-sJjYTiMjqtSAkzMZe7T46AetUnDopGK1ci2Lt-Y2BicBsBmw4UMIszNoS-duWmGHicnq_m5kofx8vUXvUoXfS8KKPJTVK4=s750"/>
                <Carousel.Caption>
                    <h3>Second slide label</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
                <img className='header'
                     src="https://www.taylorcustomrings.com/cdn/shop/collections/EngagementRings.jpg?v=1706045265&width=2400"/>
                <Carousel.Caption>
                    <h3>Third slide label</h3>
                    <p>
                        Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                    </p>
                </Carousel.Caption>
            </Carousel.Item>
        </Carousel>
    );
}