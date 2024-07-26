import React, {useEffect, useState} from 'react';
import {Button, Card, Form, Input, message, Spin} from "antd";
import UserModel from "../../models/UserModel";
import {jwtDecode} from "jwt-decode";
import './InformationAccount.css'

const token = localStorage.getItem('token');
const headers = {
    'Authorization': `Bearer ${token}`
}
export const InformationAccount = () => {
    const [data, setData] = useState<UserModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [userId, setUserId] = useState<number>();

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

    useEffect(() => {
        const fetchDetail = async () => {
            if (userId) {
                const baseUrl: string = `https://deploy-be-b176a8ceb318.herokuapp.com/myAccount?userId=${userId}`;
                const url: string = `${baseUrl}`;
                const body = JSON.stringify({
                    userId: userId
                });
                const response = await fetch(url, { headers: headers, body: body, method: 'POST' });
                if (!response.ok) {
                    throw new Error('Something went wrong!');
                }
                const responseJson = await response.json();
                console.log(responseJson);
                const loadedInformation: UserModel = {
                    userid: responseJson.data.userid,
                    name: responseJson.data.name,
                    email: responseJson.data.email,
                    phoneNumber: responseJson.data.phoneNumber,
                    password: responseJson.data.password,
                    address: responseJson.data.address,
                };
                setData(loadedInformation);
                console.log(loadedInformation);
                setIsLoading(false);
            }
        };
        fetchDetail().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
            console.log(error);
        });
    }, [userId]);

    const onFinish = async (values: any) => {
        try {
            const headerForUpdate = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
            const updateUrl = `https://deploy-be-b176a8ceb318.herokuapp.com/myAccount/updateAccount`;
            const response = await fetch(updateUrl, {
                method: 'PUT',
                headers: headerForUpdate,
                body: JSON.stringify(values)
            });
            if (!response.ok) {
                throw new Error('Update user information fail!');
            }
            const responseJson = await response.json();
            console.log(responseJson);
            setData(responseJson.data);
            message.success('Update user information successful!');
        } catch (error) {
            console.log(error);
            message.error('Failed to update user information.');
        }
    };

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }
    if (isLoading) {
        return (
            <Spin/>
        )
    }

    const validateNoWhitespace = (_: any, value: any) => {
        if (!value || value.trim() !== "") {
            return Promise.resolve();
        }
        return Promise.reject('Input cannot be only whitespace');
    };


    return (
        <div>
            <Card title="Account Information">
                <Form
                    onFinish={onFinish}
                    initialValues={data}
                >
                    <Form.Item
                        label="UserID"
                        name="userid"
                        hidden={true}
                    >
                        value = {data?.userid}
                    </Form.Item>

                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            {required: true, message: 'Please input your name!'},
                            {min: 1, max: 50, message: 'Name length limit must be in range 1 – 50 characters.'},
                            {pattern: /^[A-Za-z\s]+$/, message: 'Name only contains alphabetical characters.'},
                            {validator: validateNoWhitespace}
                        ]}
                        className="form-item"
                    >
                        <Input value={data?.name}/>
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        className="form-item"
                    >
                        <Input value={data?.email} disabled/>
                    </Form.Item>

                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[
                            {required: true, message: 'Please input your Address!'},
                            {validator: validateNoWhitespace}
                        ]}
                        className="form-item"
                    >
                        <Input value={data?.address}/>
                    </Form.Item>

                    <Form.Item
                        label="Phone Number"
                        name="phoneNumber"
                        rules={[
                            {required: true, message: 'Please input your Phone Number!'},
                            {len: 10, message: 'Phone number length limit must be 10 characters.'},
                            {pattern: /^[0-9]+$/, message: 'Phone number only contains numeric characters.'},
                            {validator: validateNoWhitespace}
                        ]}
                        className="form-item"
                    >
                        <Input value={data?.phoneNumber}/>
                    </Form.Item>

                    <Form.Item className="center-button">
                        <Button type="primary" htmlType="submit">
                            Edit
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>

    );
};
