import React from "react";
import { Form, Input, Button, message } from 'antd';
import './Login.css';
export const ResetPassword = () => {
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [verificationCode, setVerificationCode] = React.useState('');

    const handleSubmit = async (values: any) => {
        if (values.confirmPassword !== values.password) {
            message.error('Confirm password is not correct');
        } else {
            const email = localStorage.getItem('email');
            const data = {
                email: email,
                verificationCode: values.verificationCode,
                password: values.password
            };
            const response = await fetch('https://deploy-be-b176a8ceb318.herokuapp.com/login/resetpassword', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            if (response.ok) {
                message.success('Password reset successfully');
                window.location.href = '/login';
                localStorage.removeItem('email');
            } else {
                message.error('Error resetting password');
            }
        }
    };

    const validatePassword = (_: any, value: any) => {
        if (!value || /^[0-9]{6,}$/.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject('Password must be at least 6 numeric characters.');
    };

    const validateNoWhitespace = (_: any, value: any) => {
        if (!value || value.trim() !== "") {
            return Promise.resolve();
        }
        return Promise.reject('Input cannot be only whitespace');
    };
    return (
        <div className="login-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <div className="login-register-container" style={{ padding: '24px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', borderRadius: '8px' }}>
                <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                    className='form-container pt-1 pb-4 ps-4 pe-4'
                >
                    <h2 className="text-center">Reset Password</h2>

                    <Form.Item
                        label="Verify Code"
                        name="verificationCode"
                        rules={[{ required: true, message: 'Please input your verification code!' },
                            { validator: validateNoWhitespace }]}
                        style={{width: 300}}
                    >
                        <Input
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            { required: true, message: 'Please enter new password!' },
                            { validator: validatePassword }
                        ]}
                        style={{width: 300}}
                    >
                        <Input.Password
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        rules={[
                            { required: true, message: 'Please enter confirm password' },
                            { validator: validatePassword }
                        ]}                        style={{width: 300}}
                    >
                        <Input.Password
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </Form.Item>

                    <Form.Item style={{ display: 'flex', justifyContent: 'center'}}>
                        <Button type="primary" htmlType="submit"
                        style = {{width: 300}}>
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
