import React from 'react';
import {Link} from 'react-router-dom';
import { Row, Col } from 'antd';
import { MailOutlined, PhoneOutlined } from '@ant-design/icons';
import './Footer.css';

export const Footer = () => {
    return (
        <div className='footer main-color'>
            <Row className='footer-container justify-content-center'>
                <Col span={6} className='footer-section'>
                    <h2 className='custom-heading text-white mb-4'>Bridgerton</h2>
                    <p><PhoneOutlined /> 091 827 0903</p>
                    <p><MailOutlined />  bridgertondiamond@gmail.com</p>
                    <div className='footer-social'>
                        <a href="https://facebook.com" className='social-link'>Facebook</a>
                        <a href="https://twitter.com" className='social-link'>Twitter</a>
                        <a href="https://instagram.com" className='social-link'>Instagram</a>
                        <a href="https://pinterest.com" className='social-link'>Pinterest</a>
                    </div>
                </Col>
                <Col span={4} className='footer-section'>
                    <h3>COMPANY</h3>
                    <ul>
                        <li><Link to='/home'>Home</Link></li>
                        <li><Link to='/shop'>Shop</Link></li>
                        <li><Link to='/contactus'>Contact us</Link></li>
                        <li><Link to='/price'>Diamond Price</Link></li>
                    </ul>
                </Col>
                <Col span={4} className='footer-section'>
                    <h3>LINKS</h3>
                    <ul>
                        <li><Link to='/products'>Products</Link></li>
                        <li><Link to='/events'>Events</Link></li>
                        <li><Link to='/gallery'>Gallery</Link></li>
                        <li><Link to='/faq'>FAQs</Link></li>
                    </ul>
                </Col>
                <Col span={4} className='footer-section'>
                    <h3>SUPPORT</h3>
                    <ul>
                        <li><Link to='/documentation'>Documentation</Link></li>
                        <li><Link to='/forums'>Forums</Link></li>
                        <li><Link to='/language-packs'>Language Packs</Link></li>
                        <li><Link to='/release-status'>Release Status</Link></li>
                    </ul>
                </Col>
                <Col span={4} className='footer-section'>
                    <h3>RECOMMEND</h3>
                    <ul>
                        <li><Link to='/wordpress'>WordPress</Link></li>
                        <li><Link to='/learnpress'>LearnPress</Link></li>
                        <li><Link to='/woocommerce'>WooCommerce</Link></li>
                        <li><Link to='/bbpress'>bbPress</Link></li>
                    </ul>
                </Col>
            </Row>
            <div className='footer-bottom'>
                <p>Bridgerton Store, Inc &copy; 2023. All Rights Reserved. | Privacy | Terms | Sitemap | Purchase</p>
            </div>
        </div>
    );
};

export default Footer;
