import React, { useState, useEffect } from 'react';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { NavLink } from 'react-router-dom';
import './CartIcon.css';
const CartIcon: React.FC = () => {
    const [cartCount, setCartCount] = useState<number>(0);

    useEffect(() => {
        const updateCartCount = () => {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            setCartCount(cart.length);
        };


        window.addEventListener('cartUpdated', updateCartCount);

        updateCartCount();


        return () => {
            window.removeEventListener('cartUpdated', updateCartCount);
        };
    }, []);

    return (
        <NavLink to="/cart">
            <div className="cart-icon-wrapper">
                <ShoppingCartOutlined className="cart-icon" />
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </div>
        </NavLink>
    );
};

export default CartIcon;
