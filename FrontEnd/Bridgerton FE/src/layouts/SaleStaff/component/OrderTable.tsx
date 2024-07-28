import React, {useEffect, useState} from 'react';
import './OrderTable.css';
import {Alert, Button, message, Space, Spin, Table, Tag} from 'antd';
import {useHistory} from 'react-router-dom';
import OrderModel from "../../../models/OrderModel"

const token = localStorage.getItem('token')
const headers = {
    'Authorization': `Bearer ${token}`
}

const OrderTable: React.FC = () => {
    const [orders, setOrders] = useState<OrderModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const history = useHistory();

    useEffect(() => {
        const fetchOrders = async () => {
            const baseUrl: string = "https://deploy-be-b176a8ceb318.herokuapp.com/order";
            const url: string = `${baseUrl}`;
            const response = await fetch(url, {headers: headers});
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            const responseJson = await response.json();
            const responseData = responseJson.content;
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
        };
        fetchOrders().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
            console.log(error);
        })
    }, []);


    const logOut = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    const updateOrderStatus = (orderId: number, newStatus: string) => {
        const orderIndex: number = orders.findIndex(order => order.orderId === orderId);
        if (orderIndex === -1) {
            return;
        }

        const updatedOrders = [...orders];
        updatedOrders[orderIndex].status = newStatus;
        setOrders(updatedOrders);
    };

    const handleConfirm = async (e: React.FormEvent, orderId: number) => {
        const token = localStorage.getItem("token");
        const headersForPayment = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
        e.preventDefault();
        try {
            const baseUrl = "https://deploy-be-b176a8ceb318.herokuapp.com/sale";
            const url = `${baseUrl}/setOrderToDelivery/${orderId}`;
            const response = await fetch(url, {method: 'POST', headers: headersForPayment});

            if (!response.ok) {
                message.error('Something when wrong');
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
        history.push(`/orderdetail/${orderId}`);
    };

    const columns = [
        {
            title: 'ORDER ID',
            dataIndex: 'orderId',
            key: 'orderId',
            className:'text-center'
        },
        {
            title: 'ORDER DATE',
            dataIndex: 'orderDate',
            key: 'orderDate',
            className:'text-center',
            render: (text: any) => new Date(text).toLocaleDateString(),
        },
        {
            title: 'ORDER TOTAL AMOUNT',
            dataIndex: 'orderTotalAmount',
            key: 'orderTotalAmount',
            className:'text-center'
        },
        {
            title: 'ORDER DELIVERY ADDRESS',
            dataIndex: 'orderDeliveryAddress',
            key: 'orderDeliveryAddress',
            className:'text-center'
        },
        {
            title: 'STATUS',
            dataIndex: 'status',
            key: 'status',
            className:'text-center',
            render: (status: any) => (
                <Tag color={getStatusColor(status)} style={{fontWeight: 'bolder'}} key={status}>
                    {status}
                </Tag>
            ),
        },
        {
            title: 'ACTION',
            key: 'action',
            className:'text-center',
            render: (record: any) => (
                record.status === 'PAYMENT' ? (
                    <Space size="middle">
                        <Button onClick={(event) => handleConfirm(event, record.orderId)}>
                            CONFIRM
                        </Button>
                        <Button onClick={(event) => handleCancel(event, record.orderId)}>
                            CANCEL
                        </Button>
                    </Space>
                ) : null
            ),
        },
    ];

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

    return (
        <div style={{marginTop: '50px'}} className="container">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h1 className='custom-heading justify-content-center'>Orders List</h1>
                <Button onClick={logOut} type="primary" style={{marginBottom: '100px'}}> Logout</Button>
            </div>
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