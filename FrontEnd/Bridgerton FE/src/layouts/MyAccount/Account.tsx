import React, {useEffect, useState} from 'react';
import { Layout, Menu, Card, Form, Input, Button } from 'antd';
import { UserOutlined, MailOutlined, BookOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';
import {NavLink} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const { Header, Sider, Content } = Layout;

const Account : React.FC<{children: any}> = (props) => {
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
    return (
        <Layout>
            <Header style={{ background: '#fff', padding: 0 }}>
                <h2 className='custom-heading' style={{ marginTop: 20,marginLeft: 180, textAlign: 'center' }}>Hello {userName}!!</h2>
            </Header>
            <Layout>
                <Sider width={200} className="site-layout-background">
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        style={{ height: '100%', borderRight: 0 }}
                    >
                        <Menu.Item key="1" icon={<UserOutlined />}>
                            <NavLink style={{textDecoration: 'none'}} to={'/myaccount'}>
                                Account Information
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key="2" icon={<BookOutlined />}>
                            <NavLink style={{textDecoration: 'none'}} to={'/myorders'}>
                                My Orders
                            </NavLink>
                        </Menu.Item>
                        <Menu.Item key="5" icon={<SettingOutlined />}>
                            <NavLink style={{textDecoration: 'none'}} to={'/changepassword'}>
                                Change Password
                            </NavLink>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout style={{ padding: '24px' }}>
                    <Content>
                        {props.children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default Account;
