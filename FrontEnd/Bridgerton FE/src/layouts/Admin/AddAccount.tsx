import React from 'react';
import {Modal, Form, Input, Select, Radio, Button} from 'antd';

const {Option} = Select;

interface AddAccountProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (values: any) => void;
    formData: {
        name: string;
        password: string;
        phoneNumber: string;
        email: string;
        address: string;
        role: string;
        status: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
}

const AddAccount: React.FC<AddAccountProps> = ({isOpen, onClose, onSubmit, formData, handleChange}) => {

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
        <Form
            layout="vertical"
            initialValues={formData}
            onFinish={onSubmit}
        >
            <Form.Item
                label="Name"
                name="name"
                rules={[
                    {required: true, message: 'Please input name!'},
                    {min: 1, max: 50, message: 'Name length limit must be in range 1 – 50 characters.'},
                    {pattern: /^[A-Za-z\s]+$/, message: 'Name only contains alphabetical characters.'},
                    {validator: validateNoWhitespace}
                ]}
            >
                <Input
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                />
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
                rules={[
                    {required: true, message: 'Please input user password!'},
                    {validator: validatePassword}
                ]}
            >
                <Input.Password
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                />
            </Form.Item>
            <Form.Item
                label="Phone Number"
                name="phoneNumber"
                rules={[
                    {required: true, message: 'Please input user phone number!'},
                    {len: 10, message: 'Phone number length limit must be 10 characters.'},
                    {pattern: /^[0-9]+$/, message: 'Phone number only contains numeric characters.'},
                    {validator: validateNoWhitespace}
                ]}
            >
                <Input
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone Number"
                />
            </Form.Item>
            <Form.Item
                label="Email"
                name="email"
                rules={[
                    {required: true, message: 'Please input user email!'},
                    {validator: validateEmail}
                ]}
            >
                <Input
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                />
            </Form.Item>
            <Form.Item
                label="Address"
                name="address"
                rules={[
                    {required: true, message: 'Please input user address!'},
                    {validator: validateNoWhitespace}
                ]}
            >
                <Input
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Address"
                />
            </Form.Item>
            <Form.Item
                label="Function"
                name="role"
                rules={[{required: true, message: 'Please select a role!'}]}
            >
                <Select
                    value={formData.role}
                    onChange={(value) => handleChange({
                        target: {
                            name: 'role',
                            value
                        }
                    } as React.ChangeEvent<HTMLSelectElement>)}
                    placeholder="Select Role"
                >
                    <Option value="CUSTOMER">Customer</Option>
                    <Option value="ADMIN">Admin</Option>
                    <Option value="MANAGER">Manager</Option>
                    <Option value="DELIVERY_STAFF">Delivery Staff</Option>
                    <Option value="SALE_STAFF">Sale Staff</Option>
                </Select>
            </Form.Item>
            <Form.Item
                label="Status"
                name="status"
            >
                <Radio.Group
                    value={formData.status}
                    onChange={handleChange as any}
                >
                    <Radio value='true'>Active</Radio>
                    <Radio value='false'>Suspended</Radio>
                </Radio.Group>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Create</Button>
                <Button type="default" onClick={onClose} style={{marginLeft: '10px'}}>Close</Button>
            </Form.Item>
        </Form>

    );
};

export default AddAccount;