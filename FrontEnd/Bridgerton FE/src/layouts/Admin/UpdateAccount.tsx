import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Form, Input, Select, Switch, Button } from 'antd';

interface UpdateAccountProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    formData: {
        name: string;
        email: string;
        phoneNumber: string;
        address: string;
        role: string;
        status: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
    handleStatusChange: (checked: boolean) => void;
}

const { Option } = Select;

const UpdateAccount: React.FC<UpdateAccountProps> = ({ isOpen, onClose, onSubmit, formData, handleChange, handleStatusChange }) => {
    return (
        <Modal
            visible={isOpen}
            title="Update User"
            onCancel={onClose}
            footer={null}
        >
            <Form onFinish={onSubmit}>
                <Form.Item label="Name" wrapperCol={{ span: 11 }}>
                    <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Erisha"
                        required
                    />
                </Form.Item>
                <Form.Item label="Email">
                    <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="meesha123@gmail.com"
                        required
                    />
                </Form.Item>
                <Form.Item label="Phone">
                    <Input
                        type="text"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="09*******"
                        required
                    />
                </Form.Item>
                <Form.Item label="Address">
                    <Input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Ho Chi Minh City"
                        required
                    />
                </Form.Item>
                <Form.Item label="Role">
                    <Select
                        value={formData.role}
                        onChange={(value) => handleChange({ target: { name: 'role', value } } as React.ChangeEvent<HTMLSelectElement>)}
                    >
                        <Option value="" disabled>Select roles</Option>
                        <Option value="CUSTOMER">Customer</Option>
                        <Option value="ADMIN">Admin</Option>
                        <Option value="MANAGER">Manager</Option>
                        <Option value="DELIVERY_STAFF">Delivery Staff</Option>
                        <Option value="SALE_STAFF">Sale Staff</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Status">
                    <Switch
                        checked={formData.status === 'true'}
                        onChange={handleStatusChange}
                        checkedChildren="Active"
                        unCheckedChildren="Suspended"
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Update Account
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default UpdateAccount;
