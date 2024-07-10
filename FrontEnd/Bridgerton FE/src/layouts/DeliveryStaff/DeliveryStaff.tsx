import React, { useState } from 'react';
import { Modal } from 'antd';
import DeliveryOrderList from './DeliveryOrderList';
import FooterMapProps from "../ContactUs/component/FooterMapProps";

interface DeliveryOrder {
    id: string;
    customerName: string;
    address: string;
    deliveryDate: string;
    status: string;
}

const initialData: DeliveryOrder[] = [
    {
        id: '1',
        customerName: 'Alice Johnson',
        address: '123 Main St, Springfield',
        deliveryDate: '2024-07-01',
        status: 'Pending',
    },
    {
        id: '2',
        customerName: 'Bob Smith',
        address: '456 Oak Ave, Metropolis',
        deliveryDate: '2024-07-02',
        status: 'Delivered',
    },
];

const DeliveryStaff: React.FC = () => {
    const [data, setData] = useState<DeliveryOrder[]>(initialData);
    const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);

    const handleViewDetails = (record: DeliveryOrder) => {
        setSelectedOrder(record);
    };

    const handleUpdateStatus = (id: string) => {
        setData(
            data.map(order =>
                order.id === id ? { ...order, status: 'Delivered' } : order
            )
        );
    };

    return (
        <div className="container">
            <FooterMapProps/>
            <DeliveryOrderList
                data={data}
                onViewDetails={handleViewDetails}
                onUpdateStatus={handleUpdateStatus}
            />
            <Modal
                title="Order Details"
                visible={!!selectedOrder}
                onCancel={() => setSelectedOrder(null)}
                footer={null}
            >
                {selectedOrder && (
                    <div>
                        <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                        <p><strong>Customer Name:</strong> {selectedOrder.customerName}</p>
                        <p><strong>Address:</strong> {selectedOrder.address}</p>
                        <p><strong>Delivery Date:</strong> {selectedOrder.deliveryDate}</p>
                        <p><strong>Status:</strong> {selectedOrder.status}</p>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default DeliveryStaff;
