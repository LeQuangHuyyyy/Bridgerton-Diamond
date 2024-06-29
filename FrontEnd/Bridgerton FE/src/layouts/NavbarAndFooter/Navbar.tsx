import {Space, Layout, Menu, Dropdown, Button} from 'antd';
import {Link, NavLink} from 'react-router-dom';
import {ShoppingCartOutlined, UserOutlined} from '@ant-design/icons';
import React, {useEffect, useState} from 'react';
import {jwtDecode} from 'jwt-decode';

const {Header} = Layout;

const menu = (handleLogout: any) => (
    <Menu>
        <Menu.Item key="0">
            <NavLink to="/myAccount">Account</NavLink>
        </Menu.Item>
        <Menu.Item key="1" onClick={handleLogout}>
            Log out
        </Menu.Item>
    </Menu>
);

export const Navbar = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [token, setToken] = useState('');
    const [showNavbar, setShowNavbar] = useState(true);
    let lastScrollY = window.scrollY;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token != null) {
            const enCrypt = jwtDecode(token);
            setIsLogin(true);
            setToken(token);
        }

        const handleScroll = () => {
            if (window.scrollY > lastScrollY) {
                setShowNavbar(false);
            } else {
                setShowNavbar(true);
            }
            lastScrollY = window.scrollY;
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleLogout = () => {
        setIsLogin(false);
        localStorage.removeItem('token');
    };

    return (
        <div style={{marginBottom: '130px'}}>
            <div className="logo-container">
                <NavLink to="/home"
                         style={{
                             fontFamily: 'Petit Formal Script, cursive',
                             textDecoration: 'none',
                             fontSize: '40px',
                             color: 'white',
                         }}>
                    Bridgerton
                </NavLink>
            </div>
            <Header className={`custom-header ${showNavbar ? 'visible' : 'hidden'}`}>
                <Space size={60} className="nav-links">
                    <NavLink className="nav-link" to="/home">
                        Home
                    </NavLink>
                    <NavLink className="nav-link" to="/shop">
                        Shop
                    </NavLink>
                    <NavLink className="nav-link" to="/price">
                        Diamond Price
                    </NavLink>
                </Space>
                <Space>
                    {isLogin ? (
                        <Dropdown overlay={menu(handleLogout)} trigger={['click']}>
                            <Button shape="circle" icon={<UserOutlined/>} className="user-icon"/>
                        </Dropdown>
                    ) : (
                        <NavLink className="login-link" to="/login">
                            Sign in
                        </NavLink>
                    )}
                    <NavLink to="/cart">
                        <ShoppingCartOutlined className="cart-icon"/>
                    </NavLink>

                </Space>
            </Header>
        </div>
    );
};
