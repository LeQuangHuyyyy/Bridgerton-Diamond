import React, {useEffect, useState} from 'react';
import {Alert, Button, message, Space, Spin, Table, Tag} from 'antd';
import FooterMapProps from "../ContactUs/component/FooterMapProps";
import OrderModel from "../../models/OrderModel";
import {useHistory} from "react-router-dom";
import {EditOutlined} from "@ant-design/icons";

const token = localStorage.getItem('token')
const headers = {
    'Authorization': `Bearer ${token}`
}
const DeliveryStaff: React.FC = () => {
    const [orders, setOrders] = useState<OrderModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const history = useHistory();

    useEffect(() => {
        fetchOrders();

    }, []);
    const fetchOrders = async () => {
        const baseUrl: string = "https://deploy-be-b176a8ceb318.herokuapp.com/delivery/ViewOrderDelivery";
        const url: string = `${baseUrl}`;
        const response = await fetch(url, {headers: headers});
        if (!response.ok) {
            throw new Error('Something went wrong!');
        }
        const responseJson = await response.json();
        const responseData = responseJson;
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

    const logOut = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    // const handleUpdateStatus = (id: string) => {
    //     setData(
    //         data.map(order =>
    //             order.id === id ? { ...order, status: 'Delivered' } : order
    //         )
    //     );
    // };

    const getStatusColor = (status: any) => {
        switch (status) {
            case 'DELIVERED':
                return 'green';
            case 'RECEIVED':
                return 'gold';
            default:
                return 'gold';
        }
    };
    // const handleRowClick = (event: any, orderId: number) => {
    //     const actionColumn = event.target.closest('.ant-space');
    //     if (actionColumn) {
    //         return;
    //     }
    //     navigateToOrderDetails(orderId);
    // };

    const navigateToOrderDetails = async (e: React.FormEvent, orderId: number) => {
        e.preventDefault();
        history.push(`/deliveryDetailOrder/${orderId}`)
    };
    const confirmOrderToReceived = async (e: React.FormEvent, orderId: number) => {
        e.preventDefault();
        try {
            console.log(orderId);

            const url = `https://deploy-be-b176a8ceb318.herokuapp.com/order/setOrderToReceived?orderId=${orderId}`;

            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...headers
                },
                method: "POST",
            });

            if (response.ok) {
                message.success("The order has been received successfully");
                fetchOrders();
            } else {
                const errorMessage = await response.text();
                message.error(`Failed to confirm the order: ${errorMessage}`);
            }
        } catch (error) {
            console.error(error);
            message.error("Failed to confirm the order");
        }
    };


    const columns = [
        {
            title: 'ORDER ID',
            dataIndex: 'orderId',
            key: 'orderId',
        },
        {
            title: 'NAME',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'PHONE',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'ORDER DATE',
            dataIndex: 'orderDate',
            key: 'orderDate',
            render: (text: any) => new Date(text).toLocaleDateString(),
        },
        {
            title: 'TOTAL AMOUNT',
            dataIndex: 'orderTotalAmount',
            key: 'orderTotalAmount',
        },
        {
            title: 'DELIVERY ADDRESS',
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
            title: '',
            key: 'action',
            render: (text: any, record: any) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined/>}
                        onClick={(event) => navigateToOrderDetails(event, record.orderId)}
                    />
                    <Button
                        onClick={(event) => confirmOrderToReceived(event, record.orderId)}
                    >
                        Received
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="container">
            <FooterMapProps/>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h1 className='custom-heading text-center'>Orders List</h1>
                <Button onClick={logOut} type="primary" style={{marginBottom: '100px'}}> Logout</Button>
            </div>
            <Table
                columns={columns}
                dataSource={orders}
                rowKey="orderId"
                // onRow={(record) => {
                //     return {
                //         onClick: (event) => handleRowClick(event, record.orderId),
                //     };
                // }}
            />
        </div>
    );
};

export default DeliveryStaff;
