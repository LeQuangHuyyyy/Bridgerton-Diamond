import React from 'react';
import {Link} from 'react-router-dom';
import './OrderSuccessPage.css';
import Lottie from "lottie-react";

const OrderSuccessPage: React.FC = () => {
    return (
        <div style={{paddingTop: '30px'}} className="order-success-container">
            <Lottie animationData={require('./Animation.json')} style={{width: '280px', height: '280px'}}/>
            <h1 className="order-success-title">Order Success</h1>
            <p className="order-success-message">Thank you for your purchase! Your order has been successfully
                placed.</p>
            <Link style={{marginBottom: "40px"}} to="/home" className="order-success-link">Go to Home</Link>
        </div>
    );
};

export default OrderSuccessPage;
