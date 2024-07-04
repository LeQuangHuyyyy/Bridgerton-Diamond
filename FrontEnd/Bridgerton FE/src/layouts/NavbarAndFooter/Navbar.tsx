import {Button, Dropdown, Layout, Menu, Space} from 'antd';
import {NavLink} from 'react-router-dom';
import {UserOutlined} from '@ant-design/icons';
import React, {useEffect, useState} from 'react';
import {jwtDecode} from 'jwt-decode';
import CartIcon from './component/CartIcon';

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
        <div style={{marginBottom: '153px'}}>
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
                <Space size={60} className="nav-links" style={{justifyContent: 'center', flex: 1, marginLeft: '70px'}}>
                    <NavLink className="nav-link" to="/home">
                        Home
                    </NavLink>
                    <NavLink className="nav-link" to="/shop">
                        Shop
                    </NavLink>
                    <NavLink className="nav-link" to="/price">
                        Diamond Price
                    </NavLink>
                    <NavLink className="nav-link" to="/contactus">
                        Contact Us
                    </NavLink>
                    <NavLink className="nav-link" to="/order-success">
                        Order Success
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
                    <CartIcon/>
                </Space>
            </Header>
        </div>
    );
};
