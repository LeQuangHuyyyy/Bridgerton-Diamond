import React, {useEffect} from 'react';
import {Button, Card, Form, Input, message} from 'antd';
import {LockOutlined} from '@ant-design/icons';
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
            const decodedToken = jwtDecode(data) as { id: number };
            setUserId(decodedToken.id)
            console.log(decodedToken.id)
        } else {
            console.log("No token found");
        }
    }, []);

    const onFinish = async (values: any) => {
        const {oldPassword, newPassword, confirmPassword} = values;

        if (newPassword !== confirmPassword) {
            message.error('Password not match together!');
            return;
        }

        try {
            const baseUrl: string = `https://deploy-be-b176a8ceb318.herokuapp.com/myAccount/updatePassword?userid=${userId}&oldPassword=${oldPassword}&newPassword=${newPassword}`;
            const response = await fetch(baseUrl, {headers: headers, method: 'PUT'});


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

    const validatePassword = (_: any, value: any) => {
        if (!value || /^[0-9]{6,}$/.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject('Password must be at least 6 numeric characters.');
    };

    const validateConfirmPassword = async (_: any, value: any) => {
        if (value && value !== form.getFieldValue('newPassword')) {
            return Promise.reject(new Error('The two passwords that you entered do not match!'));
        }
        return Promise.resolve();
    };

    return (
        <div>
            <Card>
                <Form
                    form={form}
                    onFinish={onFinish}
                    layout="vertical"
                    style={{maxWidth: 400, margin: '0 auto'}}
                >
                    <Form.Item
                        name="oldPassword"
                        label="Old Password"
                        rules={[{required: true, message: 'Please input old password!'}]}
                    >
                        <Input.Password prefix={<LockOutlined/>} placeholder="Old password"/>
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label="New Password"
                        rules={[
                            {required: true, message: 'Please input your new password!'},
                            {validator: validatePassword}
                        ]}>
                        <Input.Password prefix={<LockOutlined/>} placeholder="New password"/>
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Confirm Password"
                        dependencies={['newPassword']}
                        rules={[
                            {required: true, message: 'Please confirm your new password!'},
                            {validator: validateConfirmPassword}
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined/>} placeholder="Confirm new password"/>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Change Password
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default ChangePassword;
