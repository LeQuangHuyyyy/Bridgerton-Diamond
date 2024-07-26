import React, {useEffect, useState} from 'react';
import {Alert, Button, message, Space, Spin, Table, Tag} from 'antd';
import {useHistory} from 'react-router-dom';
import OrderModel from "../../models/OrderModel";
import './MyOrders.css'
import {jwtDecode} from "jwt-decode";

const token = localStorage.getItem("token");
const headers = {
    'Authorization': `Bearer ${token}`
}

const MyOrders: React.FC = () => {
    const [orders, setOrders] = useState<OrderModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [userId, setUserId] = useState<number>();

    const history = useHistory();

    useEffect(() => {
        const data = localStorage.getItem('token');
        if (data) {
            const decodedToken = jwtDecode(data) as { id: number };
            setUserId(decodedToken.id)
        } else {
            console.log("No token found");
        }
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            window.scrollTo(0,0)
            if (userId) {
                const baseUrl: string = `https://deploy-be-b176a8ceb318.herokuapp.com/order/userOrder?userId=${userId}`;
                const url: string = `${baseUrl}`;
                const response = await fetch(url, {headers: headers});
                if (!response.ok) {
                    throw new Error('Something went wrong!');
                }
                const responseJson = await response.json();
                const responseData = responseJson.data;
                console.log(responseData);
                const loadedOrders: OrderModel[] = [];
                for (const key in responseData) {
                    loadedOrders.push({
                        orderId: responseData[key].orderId,
                        orderDate: responseData[key].orderDate,
                        orderTotalAmount: responseData[key].orderTotalAmount,
                        orderDeliveryAddress: responseData[key].orderDeliveryAddress,
                        status: responseData[key].status,
                        discountCode: responseData[key].discountCode,
                        customerId: responseData[key].customerId,
                        saleId: responseData[key].saleId,
                        deliveryId: responseData[key].deliveryId,
                        orderDetails: responseData[key].orderDetails,
                        feedbacks: responseData[key].feedbacks,
                        warranties: responseData[key].warranties,
                        invoices: responseData[key].invoices,
                        payments: responseData[key].payments,
                        phoneNumber: responseData[key].phoneNumber,
                        username: responseData[key].username
                    });
                }
                setOrders(loadedOrders);
                setIsLoading(false);
            }
        };
        fetchOrders().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
            console.log(error);
        })
    }, [userId]);

    if (isLoading) {
        return (
            <div className="spinner container m-5 d-flex justify-content-center align-items-center vh-100">
                <Spin size="large"/>
            </div>
        );
    }

    if (httpError) {
        return (
            <div className="container">
                <Alert message="Error" description={httpError} type="error" showIcon/>
            </div>
        );
    }

    const getStatusColor = (status: any) => {
        switch (status) {
            case 'PENDING':
                return 'volcano';
            case 'PAYMENT':
                return 'blue';
            case 'DELIVERED':
                return 'green';
            case 'CANCELED':
                return 'red';
            case 'RECEIVED':
                return 'gold';
            default:
                return 'gold';
        }
    };

    const handleRowClick = (event: any, orderId: number) => {
        const actionColumn = event.target.closest('.ant-space');
        if (actionColumn) {
            return;
        }
        navigateToOrderDetails(orderId);
    };

    const navigateToOrderDetails = (orderId: number) => {
        history.push(`/myorderdetail/${orderId}`);
    };

    const handlePayment = async (e:React.FormEvent, orderId: number) => {
        const token = localStorage.getItem("token");
        const headersForPayment = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
        e.preventDefault();
        console.log('orderId', orderId)
        const paymentData = {
            orderId,
            bankCode: "NCB",
        };
        try {
            const response = await fetch(
                'https://deploy-be-b176a8ceb318.herokuapp.com/payment',
                {
                    method: 'POST',
                    headers: headersForPayment,
                    body: JSON.stringify(paymentData),
                }
            );

            console.log(response);

            if (response.ok) {
                const paymentResult = await response.json();
                window.location.href = paymentResult.paymentUrl;
            } else {
                message.error('Failed to payment');
            }
        } catch (error) {
            console.error('Error occurred during payment:', error);
        }
    };

    const updateOrderStatus = (orderId: number, newStatus: string) => {
        const orderIndex: number = orders.findIndex(order => order.orderId === orderId);
        if (orderIndex === -1) {
            return;
        }

        const updatedOrders = [...orders];
        updatedOrders[orderIndex].status = newStatus;
        setOrders(updatedOrders);
    };

    const handleCancel= async (e:React.FormEvent, orderId: number) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const headersForPayment = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
        try {
            const baseUrl = `https://deploy-be-b176a8ceb318.herokuapp.com`;
            const url = `${baseUrl}/order/cancel?orderId=${orderId}`;
            const response = await fetch(url, { method: 'PUT', headers: headersForPayment });

            if (!response.ok) {
                message.error('Something when wrong' );
                throw new Error('Something went wrong!');
            }
            updateOrderStatus(orderId, 'CANCELED');
        } catch (error) {
            console.log(error);
        }
    };
    const columns = [
        {
            title: 'ORDER ID',
            dataIndex: 'orderId',
            key: 'orderId',
        },
        {
            title: 'ORDER DATE',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render: (text: any) => new Date(text).toLocaleDateString(),
        },
        {
            title: 'ORDER TOTAL AMOUNT',
            dataIndex: 'orderTotalAmount',
            key: 'orderTotalAmount',
        },
        {
            title: 'ORDER DELIVERY ADDRESS',
            dataIndex: 'orderDeliveryAddress',
            key: 'orderDeliveryAddress',
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            key: 'status',
            render: (status: any) => (
                <Tag color={getStatusColor(status)} style={{fontWeight: 'bolder'}} key={status}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'ACTION',
            key: 'action',
            render: (record: any) => (
                record.status === 'PENDING' ? (
                    <Space size="middle">
                        <Button onClick={(event) => handlePayment(event, record.orderId)}>
                            Payment
                        </Button>
                        <Button onClick={(event) => handleCancel(event, record.orderId)}>
                            Cancel
                        </Button>
                    </Space>
                ) : null
            ),
        },
    ];

    return (
        <div className="container">
            <Table
                columns={columns}
                dataSource={orders}
                pagination={{pageSize: 10, showSizeChanger: false}}
                rowKey="orderId"
                onRow={(record) => {
                    return {
                        onClick: (event) => handleRowClick(event, record.orderId),
                    };
                }}
            />
        </div>
    );
};

export default MyOrders;
