import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {jwtDecode} from "jwt-decode";
import './SideBar.css';
import { Layout, Menu} from 'antd';
import {
    DashboardOutlined,
    GiftOutlined,
    ShoppingOutlined,
    LogoutOutlined,
    SketchOutlined
} from '@ant-design/icons';
const { Sider, Content, Header } = Layout;

export const SideBar: React.FC<{children: any}> = (props) => {
    const [userName, setUserName] = useState('');

useEffect(() => {
    const data = localStorage.getItem('token');

    if (data) {
        const decodedToken = jwtDecode(data) as { name: string};
        setUserName(decodedToken.name)
    } else {
        console.log("No token found");
    }
}, []);


const logOut = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                style={{ backgroundColor: 'white', position: 'fixed', height: '100vh', left: 0 }}
                width={250}
            >
                <div className="custom-heading" style={{ color: 'black', textAlign: 'center', padding: '20px' }}>
                    Bridgerton
                </div>
                <Menu theme={"light"} mode="inline">
                    <Menu.Item key="1" icon={<DashboardOutlined />}>
                        <NavLink to="/dashboard" style={{ textDecoration: 'none', fontSize: '18px'}}>Dashboard</NavLink>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<GiftOutlined />}>
                        <NavLink to="/promotion" style={{ textDecoration: 'none', fontSize: '18px' }}>Promotion</NavLink>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<ShoppingOutlined />}>
                        <NavLink to="/product" style={{ textDecoration: 'none', fontSize: '18px' }}>Product</NavLink>
                    </Menu.Item>
                    <Menu.Item key="4" icon={<SketchOutlined />}>
                        <NavLink to="/diamond" style={{ textDecoration: 'none', fontSize: '18px' }}>Diamond</NavLink>
                    </Menu.Item>
                    <Menu.Item key="5" icon={<LogoutOutlined />} onClick={logOut}>
                        <h5>Logout</h5>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout style={{ marginLeft: 250 }}>
                <Header style={{ background: '#fff', padding: 0 }} >
                    <div style={{ float: 'right', marginRight: '30px' }}>
                        <h4 style={{fontSize: '20px', marginTop: '20px'}} className='custom-heading'>Welcome back, {userName}!!</h4>
                    </div>
                </Header>
                <Content style={{ margin: '24px 16px 0' }}>
                    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                        {props.children}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};
