import React from 'react';
import { Table, Space, Button } from 'antd';

interface DeliveryOrder {
    id: string;
    customerName: string;
    address: string;
    deliveryDate: string;
    status: string;
}

interface DeliveryOrderListProps {
    data: DeliveryOrder[];
    onViewDetails: (record: DeliveryOrder) => void;
    onUpdateStatus: (id: string) => void;
}

const DeliveryOrderList: React.FC<DeliveryOrderListProps> = ({ data, onViewDetails, onUpdateStatus }) => {
    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Customer Name',
            dataIndex: 'customerName',
            key: 'customerName',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Delivery Date',
            dataIndex: 'deliveryDate',
            key: 'deliveryDate',
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
                    <Button onClick={() => onViewDetails(record)}>View Details</Button>
                    <Button type="primary" onClick={() => onUpdateStatus(record.id)}>Update Status</Button>
                </Space>
            ),
        },
    ];

    return <Table columns={columns} dataSource={data} rowKey="id" />;
};

export default DeliveryOrderList;
