import React from "react";
import {jwtDecode} from "jwt-decode";
import {NavLink} from "react-router-dom";
import UserModel from "../models/UserModel";
import {Button, Form, Input, message, Tabs} from "antd";
import './Login.css';
import TabPane from "antd/es/tabs/TabPane";

export const Login = () => {
    const [showRegister, setShowRegister] = React.useState(false);
    const [email, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [registerUsername, setRegisterUsername] = React.useState('');
    const [registerPassword, setRegisterPassword] = React.useState('');
    const [registerPhoneNumber, setRegisterPhoneNumber] = React.useState('');
    const [registerEmail, setRegisterEmail] = React.useState('');
    const [registerAddress, setRegisterAddress] = React.useState('');
    const [form] = Form.useForm();

    const handleSubmit = async (e: React.FormEvent) => {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        fetch(`https://deploy-be-b176a8ceb318.herokuapp.com/login/signin`, {
                method: "POST",
                body: formData
            }
        ).then(
            response => response.json()
        ).then(
                data => {
                    if (data !== false){

                        localStorage.setItem('token', data.data);
                        const token = data.data;
                        const enCrypt = jwtDecode(token) as {
                            id: number;
                            name: string;
                            phone: string;
                            role: string;
                            address: string;
                        };

                        if (enCrypt.role === 'CUSTOMER') {
                            window.location.href = "/home"
                            message.success("Login successfully!")
                        } else if (enCrypt.role === 'ADMIN') {
                            window.location.href = '/admin'
                            message.success("Login successfully!")
                        } else if (enCrypt.role === 'MANAGER') {
                            window.location.href = '/dashboard'
                            message.success("Login successfully!")
                        } else if (enCrypt.role === 'SALE_STAFF') {
                            window.location.href = '/sale'
                            message.success("Login successfully!")
                        } else if (enCrypt.role === 'DELIVERY_STAFF') {
                            window.location.href = '/delivery'
                            message.success("Login successfully!")
                        }
                    }
                    form.resetFields();
                }
            )
            .catch(err => {
                message.error('Invalid email or password');
                console.log(err)
            })
    };
    const handleRegister = async (e: React.FormEvent) => {
        const userModel = new UserModel(0, registerUsername, registerPassword, registerPhoneNumber, registerEmail, registerAddress)

        const response = await fetch(`https://deploy-be-b176a8ceb318.herokuapp.com/login/signup`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userModel)
            }
        )
        if (response.ok) {
            localStorage.setItem('email-register', registerEmail);
            localStorage.setItem('password-register', registerPassword);
            window.location.href = "/verify-register";
            form.resetFields();
        } else {
            message.error('Email or phone number is already exist');
            form.resetFields();
        }
        setShowRegister(false);
    };

    const validateEmail = (_: any, value: any) => {
        if (!value || /^\S+@\S+\.\S+$/.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject('The email must contain "@" and "."');
    };

    const validateNoWhitespace = (_: any, value: any) => {
        if (!value || value.trim() !== "") {
            return Promise.resolve();
        }
        return Promise.reject('Input cannot be only whitespace');
    };

    const validatePassword = (_: any, value: any) => {
        if (!value || /^[0-9]{6,}$/.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject('Password must be at least 6 numeric characters.');
    };
    return (
        <div className="login-container">
            <div className="login-register-container">
                <Tabs activeKey={showRegister ? 'register' : 'login'} onChange={() => setShowRegister(!showRegister)}>
                    <TabPane tab="LOGIN" key="login">
                        <Form className="form-container" form={form} onFinish={handleSubmit}>
                            <h2 className="text-center">LOGIN</h2>
                            <Form.Item
                                name="email"
                                rules={[
                                    { required: true, message: 'Please input your Email!' },
                                    { validator: validateEmail }
                                ]}
                            >
                                <Input
                                    type="text"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    { required: true, message: 'Please input your Password!' },
                                    { validator: validateNoWhitespace }

                                ]}
                            >
                                <Input.Password
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Form.Item>
                            <NavLink className="text-decoration-none position-relative text-dark forgot-password"
                                     to="/forgot-password">
                                Forgot password?
                            </NavLink>
                            <Button type="primary" htmlType="submit" block>
                                LOGIN
                            </Button>
                        </Form>
                    </TabPane>
                    <TabPane tab="REGISTER" key="register">
                        <Form className="form-container" onFinish={handleRegister}>
                            <h2 className="text-center">REGISTER</h2>
                            <Form.Item
                                name="username"
                                rules={[
                                    { required: true, message: 'Please input your Name!' },
                                    { min: 1, max: 50, message: 'Name length limit must be in range 1 – 50 characters.' },
                                    { pattern: /^[A-Za-z\s]+$/, message: 'Name only contains alphabetical characters.' },
                                    { validator: validateNoWhitespace }
                                ]}
                            >
                                <Input
                                    type="text"
                                    placeholder="Name"
                                    value={registerUsername}
                                    onChange={(e) => setRegisterUsername(e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    { required: true, message: 'Please input your Password!' },
                                    { validator: validatePassword }
                                ]}
                            >
                                <Input.Password
                                    placeholder="Password"
                                    value={registerPassword}
                                    onChange={(e) => setRegisterPassword(e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item
                                name="phoneNumber"
                                rules={[
                                    { required: true, message: 'Please input your Phone Number!' },
                                    { len: 10, message: 'Phone number length limit must be 10 characters.' },
                                    { pattern: /^[0-9]+$/, message: 'Phone number only contains numeric characters.' },
                                    { validator: validateNoWhitespace }
                                ]}
                            >
                                <Input
                                    type="text"
                                    placeholder="Phone Number"
                                    value={registerPhoneNumber}
                                    onChange={(e) => setRegisterPhoneNumber(e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                rules={[
                                    { required: true, message: 'Please input your Email!' },
                                    { validator: validateEmail }
                                ]}
                            >
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={registerEmail}
                                    onChange={(e) => setRegisterEmail(e.target.value)}
                                />
                            </Form.Item>
                            <Form.Item
                                name="address"
                                rules={[
                                    { required: true, message: 'Please input your Address!' },
                                    { validator: validateNoWhitespace }
                                ]}
                            >
                                <Input
                                    type="text"
                                    placeholder="Address"
                                    value={registerAddress}
                                    onChange={(e) => setRegisterAddress(e.target.value)}
                                />
                            </Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                REGISTER
                            </Button>
                        </Form>
                    </TabPane>
                </Tabs>
            </div>
        </div>

    )
}