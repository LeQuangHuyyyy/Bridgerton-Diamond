import React, { useEffect, useState } from 'react';
import './OrderTable.css';
import { Table, Tag, Button, Input, Space, Spin, Alert } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import OrderModel from "../../../models/OrderModel"

const { Search } = Input;

const headers = {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodXlscXNlMTcxMjkzQGZwdC5lZHUudm4ifQ.FzAs3FrNbICbW9dUGZivmqNtMvUs7dh-fCgJy0EvluQ'
}

const OrderTable: React.FC = () => {
    const [orders, setOrders] = useState<OrderModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const history = useHistory();

    useEffect(() => {
        const fetchOrders = async () => {
            const baseUrl: string = "http://localhost:8888/order";
            const url: string = `${baseUrl}`;
            const response = await fetch(url, { headers: headers });
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            const responseJson = await response.json();
            const responseData = responseJson.content;
            const loadedOrders: OrderModel[] = [];
            for (const key in responseData) {
                loadedOrders.push({
                    orderId: responseData[key].orderId,
                    orderDate: new Date(responseData[key].orderDate),
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
                });
            }
            setOrders(loadedOrders);
            setIsLoading(false);
        };
        fetchOrders().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
            console.log(error);
        })
    }, []);

    const updateOrderStatus = (orderId: number, newStatus: string) => {
        const orderIndex: number = orders.findIndex(order => order.orderId === orderId);
        if (orderIndex === -1) {
            return;
        }

        const updatedOrders = [...orders];
        updatedOrders[orderIndex].status = newStatus;
        setOrders(updatedOrders);
    };

    const handleConfirm = async (orderId: number) => {
        try {
            const baseUrl = "http://localhost:8888/sale";
            const url = `${baseUrl}/setOrderToDelivery/${orderId}`;
            const response = await fetch(url, { method: 'POST', headers: headers });

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            updateOrderStatus(orderId, 'DELIVERED');
        } catch (error) {
            console.log(error);
        }
    };

    if (isLoading) {
        return (
            <div className="spinner container m-5 d-flex justify-content-center align-items-center vh-100">
                <Spin size="large" />
            </div>
        );
    }

    if (httpError) {
        return (
            <div className="container">
                <Alert message="Error" description={httpError} type="error" showIcon />
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
        history.push(`/orderdetail/${orderId}`);
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
            title: 'DISCOUNT CODE',
            dataIndex: 'discountCode',
            key: 'discountCode',
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
            title: '',
            key: 'action',
            render: (text: any, record: any) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => navigateToOrderDetails(record.orderId)}
                    />
                    <Button
                        onClick={() => handleConfirm(record.orderId)}
                    >
                     Confirm
                    </Button>
                    <Button
                        // onClick={() => handleConfirm(record.orderId)}
                    >
                        Cancel
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ marginTop: '50px' }} className="container">
            <h1 className='custom-heading text-center'>Orders List</h1>
            <Search
                placeholder="Search"
                enterButton
                style={{ marginBottom: '20px', width: '300px' }}
                // onSearch={value => searchHandleChange(value)}
            />
            <Table
                columns={columns}
                dataSource={orders}
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

export default OrderTable;
