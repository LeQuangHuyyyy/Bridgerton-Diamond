import React, {useEffect, useState} from 'react';
import {Button, Card, Form, Input, message, Spin} from "antd";
import UserModel from "../../models/UserModel";
import {jwtDecode} from "jwt-decode";

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
                        rules={[{required: true, message: 'Please enter your name!'}]}
                        style={{display: 'flex', justifyContent: 'space-between'}}
                    >
                        <Input style={{marginLeft: '40px', width: '500px'}} value={data?.name}/>
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        style={{display: 'flex', justifyContent: 'space-between',}}
                    >
                       <Input style={{marginLeft: '50px', width: '500px'}} readOnly value={data?.email} />
                    </Form.Item>

                    <Form.Item
                        label="Address"
                        name="address"
                        rules={[{required: true, message: 'Please enter your address!'}]}
                        style={{display: 'flex', justifyContent: 'space-between', width: '300px'}}
                    >
                        <Input style={{marginLeft: '28px', width: '500px'}} value={data?.address}/>
                    </Form.Item>

                    <Form.Item
                        label="Phone Number"
                        name="phoneNumber"
                        style={{display: 'flex', justifyContent: 'space-between', width: '300px'}}
                    >
                        <Input style={{width: '500px'}} value={data?.phoneNumber}/>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Edit
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};
