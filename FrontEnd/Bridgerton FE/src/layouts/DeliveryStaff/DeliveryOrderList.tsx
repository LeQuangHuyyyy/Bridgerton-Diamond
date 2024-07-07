import React from 'react';
import {Table, Space, Button} from 'antd';
import {Link} from 'react-router-dom';

interface DeliveryOrder {
    orderId: string;
    username: string;
    orderDeliveryAddress: string;
    phoneNumber: string;
    orderDate: string;
    status: string;
}

interface DeliveryOrderListProps {
    data: DeliveryOrder[];
    onViewDetails: (id: string) => void;
    onUpdateStatus: (id: string) => void;
}

const DeliveryOrderList: React.FC<DeliveryOrderListProps> = ({data, onViewDetails, onUpdateStatus}) => {
    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'orderId',
            key: 'orderId',
        },
        {
            title: 'Customer Name',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Address',
            dataIndex: 'orderDeliveryAddress',
            key: 'orderDeliveryAddress',
        },
        {
            title: 'Delivery Date',
            dataIndex: 'orderDate',
            key: 'orderDate',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: string, record: DeliveryOrder) => (
                <Space size="middle">
                    <Link to={`/delivery-detail/${record.orderId}`}>
                        <Button>View Details</Button>
                    </Link>
                    <Button type="primary" onClick={() => onUpdateStatus(record.orderId)}>Update Status</Button>
                </Space>
            ),
        },
    ];

    return <Table columns={columns} dataSource={data} rowKey="orderId"/>;
};

export default DeliveryOrderList;
