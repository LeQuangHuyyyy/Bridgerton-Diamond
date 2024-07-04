import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './OrderTable.css';
import OrderDetail from './OrderDetail';
const OrderTable: React.FC = () => {
    const [showOrderDetail, setShowOrderDetail] = useState(false);

    const handleShowOrderDetail = () => {
        setShowOrderDetail(true);
    };

    const handleCloseOrderDetail = () => {
        setShowOrderDetail(false);
    };
    const orders = [
        {
            orderId: 1,
            orderDate: new Date('2023-01-01'),
            orderTotalAmount: 15000,
            orderDeliveryAddress: '123 Main St, City, Country',
            status: 'Processing',
            discountCode: 'DISCOUNT10',
            customerId: 101,
            saleId: 201,
            deliveryId: 301,
            orderDetails: {
                orderId: 1,
                productId: 67890,
                quantity: 2,
                price: 100.00,
                size: 10
            },
            feedbacks: 'Feedbacks for order 1',
            warranties: 'Warranties for order 1',
            invoices: 'Invoices for order 1',
            payments: 'Payments for order 1',
        }
    ];


    return (
        <div style={{ marginTop: '100px' }} className="container">
            <h1 className='custom-heading text-center'>Orders Manager</h1>
            <table className="table table-hover table-striped table-bordered">
                <thead className="thead-dark">
                <tr>
                    <th>ORDER ID</th>
                    <th>ORDER DATE</th>
                    <th>ORDER TOTAL AMOUNT</th>
                    <th>ORDER DELIVERY ADDRESS</th>
                    <th>DISCOUNT CODE</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                </tr>
                </thead>
                <tbody>
                {orders.map(order => (
                    <tr key={order.orderId}>
                        <td>{order.orderId}</td>
                        <td>{order.orderDate.toDateString()}</td>
                        <td>{order.orderTotalAmount}</td>
                        <td>{order.orderDeliveryAddress}</td>
                        <td>{order.discountCode}</td>
                        <td>{order.status}</td>
                        <td>
                            <button onClick={handleShowOrderDetail} className='border-0 action-btn' >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-eye" viewBox="0 0 16 16">
                                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zm-8 4a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
                                    <path d="M8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
                                </svg>
                            </button>
                            {showOrderDetail && <OrderDetail onClose={handleCloseOrderDetail} />}

                            <button className='border-0 action-btn'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-pen" viewBox="0 0 16 16">
                                    <path
                                        d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                </svg>
                            </button>
                            <button className='border-0 action-btn'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-trash" viewBox="0 0 16 16">
                                    <path
                                        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                    <path
                                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                </svg>
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderTable;
