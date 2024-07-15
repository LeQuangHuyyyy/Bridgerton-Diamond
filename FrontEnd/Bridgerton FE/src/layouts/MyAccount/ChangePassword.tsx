import React, {useEffect} from 'react';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import {jwtDecode} from "jwt-decode";

const token = localStorage.getItem('token');
const headers = {
    'Authorization': `Bearer ${token}`
}
const ChangePassword = () => {
    const [form] = Form.useForm();
    const [userId, setUserId] = React.useState<number>();
    useEffect(() => {
        const data = localStorage.getItem('token');
        if (data) {
            const decodedToken = jwtDecode(data) as { id: number};
            setUserId(decodedToken.id)
            console.log(decodedToken.id)
        } else {
            console.log("No token found");
        }
    }, []);

    const onFinish = async (values: any) => {
        const { oldPassword, newPassword, confirmPassword } = values;

        if (newPassword !== confirmPassword) {
            message.error('Password not match together!');
            return;
        }

        try {
            const baseUrl: string = `https://deploy-be-b176a8ceb318.herokuapp.com/myAccount/updatePassword?userid=${userId}&oldPassword=${oldPassword}&newPassword=${newPassword}`;
            const response = await fetch(baseUrl, { headers: headers, method: 'PUT' });


            if (!response.ok) {
                message.error('Change password fail!');
                form.resetFields();
            } else {
                message.success('Change password successful!');
            }
        } catch (error) {
            console.error('Error:', error);
            message.error('Failed to update password!');
        }
    };
    return (
        <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            style={{ maxWidth: 400, margin: '0 auto' }}
        >
            <Form.Item
                name="oldPassword"
                label="Old Password"
                rules={[{ required: true, message: 'Please input old password!' }]}
            >
                <Input.Password prefix={<LockOutlined />} placeholder="Old password" />
            </Form.Item>

            <Form.Item
                name="newPassword"
                label="New Password"
                rules={[{ required: true, message: 'Please input new password!' }]}
            >
                <Input.Password prefix={<LockOutlined />} placeholder="New password" />
            </Form.Item>

            <Form.Item
                name="confirmPassword"
                label="Confirm Password"
                rules={[{ required: true, message: 'Please input confirm password!' }]}
            >
                <Input.Password prefix={<LockOutlined />} placeholder="Confirm new password" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" block>
                    Change Password
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ChangePassword;
