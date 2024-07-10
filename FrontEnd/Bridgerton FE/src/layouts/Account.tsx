import React, { useState } from 'react';
import { Layout, Menu, Card, Form, Input, Button } from 'antd';
import { UserOutlined, MailOutlined, BookOutlined, SettingOutlined, LogoutOutlined } from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const AccountPage = () => {
    const [userInfo, setUserInfo] = useState({
        firstName: 'James',
        lastName: 'Grey',
        email: 'james@getfitfits.com',
        birthdate: '',
    });

    const onFinish = (values: any) => {
        setUserInfo(values);
        console.log('Success:', values);
    };

    return (
        <Layout>
            <Header style={{ background: '#fff', padding: 0 }}>
                <h2 className='custom-heading' style={{ marginTop: 20,marginLeft: 16, textAlign: 'right' }}>Hello {userInfo.firstName}!!</h2>
            </Header>
            <Layout>
                <Sider width={200} className="site-layout-background">
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        style={{ height: '100%', borderRight: 0 }}
                    >
                        <Menu.Item key="1" icon={<UserOutlined />}>
                            Account Information
                        </Menu.Item>
                        <Menu.Item key="2" icon={<BookOutlined />}>
                            My Orders
                        </Menu.Item>
                        <Menu.Item key="5" icon={<SettingOutlined />}>
                            Change Password
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout style={{ padding: '24px' }}>
                    <Content>
                        <Card title="Account Information" extra={<span style={{ color: 'red' }}>*Required Fields</span>} style={{ width: '100%' }}>
                            <Form
                                name="account"
                                initialValues={userInfo}
                                onFinish={onFinish}
                            >
                                <Form.Item
                                    label="First Name"
                                    name="firstName"
                                    rules={[{ required: true, message: 'Please enter your first name!' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Last Name"
                                    name="lastName"
                                    rules={[{ required: true, message: 'Please enter your last name!' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[{ required: true, message: 'Please enter your email!' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Birthdate"
                                    name="birthdate"
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        Edit
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default AccountPage;
