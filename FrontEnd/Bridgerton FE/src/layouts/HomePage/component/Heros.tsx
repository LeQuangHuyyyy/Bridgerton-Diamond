import React from "react";

export const Heros = () => {
    return (
        <div>
            <div className="d-none d-lg-block">
                <div className="row g-0 mt-5">
                    <div className="col-sm-6 col-md-6">
                        <div>
                            <img className="col-image-left" src={'https://physics.aps.org/assets/58434729-f278-4bc7-ad3c-faf98d3db26b/e40_1.png'} alt='hero1'></img>
                        </div>
                    </div>
                    <div
                        className="col-4 col-md-6 container d-flex justify-content-center align-items-center custom-container">
                        <div className="ml-2">
                            <h1 className="custom-heading">Unveiling the Brilliance of Diamonds</h1>
                            <p className="lead custom-paragraph">
                                Our diamonds are expertly crafted to showcase exceptional quality and timeless elegance.
                                Each piece, with its brilliant cuts and flawless clarity, reflects our commitment to
                                perfection.
                                Discover the refined beauty and sophistication of Bridgerton's diamonds, where every gem
                                tells a story of elegance and excellence.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="row g-0">
                    <div className="col-4 col-md-6 container d-flex justify-content-center align-items-center custom-container">
                        <div className="ml-2">
                            <h1 className="custom-heading">Explore Our Ever-Evolving Diamond Jewelry Collection</h1>
                            <p className="lead custom-paragraph">
                                At Bridgerton, we curate an exquisite collection of diamond jewelry that is constantly
                                updated to bring you the latest and most stunning designs. Each piece is meticulously
                                crafted and adorned with handpicked diamonds, ensuring unmatched quality and elegance.
                                Whether you're looking for a timeless necklace, a dazzling ring, or elegant earrings, our collection offers something for every occasion.
                            </p>
                        </div>
                    </div>
                    <div className="col-sm-6 col-md-6">
                        <div>
                            <img className="col-image-right" src={'https://lighthouse.mq.edu.au/__data/assets/image/0007/1274992/700x400_AdobeStock_DiamondCut_623238557.jpeg'} alt='hero2'></img>
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile Heros */}
            <div className="d-lg-none">
                <div className="container">
                    <div className="m-2">
                        <div className="col-image-left"></div>
                        <div className="mt-2">
                            <h1 className='custom-heading'>Unveiling the Brilliance of Diamonds</h1>
                            <p className="lead">
                                At Bridgerton, we curate an exquisite collection of diamond jewelry that is constantly
                                updated to bring you the latest and most stunning designs. Each piece is meticulously
                                crafted and adorned with handpicked diamonds, ensuring unmatched quality and elegance.
                                Whether you're looking for a timeless necklace, a dazzling ring, or elegant earrings, our collection offers something for every occasion.
                            </p>
                        </div>
                        <div className="m-2">
                            <div className="col-image-right"></div>
                            <div className="mt-2">
                                <h1 className='custom-heading'>Explore Our Ever-Evolving Diamond Jewelry Collection</h1>
                                <p className="lead">
                                    Our diamonds are expertly crafted to showcase exceptional quality and timeless elegance.
                                    Each piece, with its brilliant cuts and flawless clarity, reflects our commitment to
                                    perfection.
                                    Discover the refined beauty and sophistication of Bridgerton's diamonds, where every gem
                                    tells a story of elegance and excellence.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
