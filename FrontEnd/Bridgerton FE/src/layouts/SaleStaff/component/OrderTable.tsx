import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './OrderTable.css';
import OrderDetail from './OrderDetail';
import OrderModel from "../../../models/OrderModel";
import {SpinnerLoading} from "../../Utils/SpinnerLoading";
import {Modal} from "antd";


const headers = {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodXlscXNlMTcxMjkzQGZwdC5lZHUudm4ifQ.FzAs3FrNbICbW9dUGZivmqNtMvUs7dh-fCgJy0EvluQ'
}
const OrderTable: React.FC = () => {
    const [orders, setOrders] = useState<OrderModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        const fetchOrders = async () => {
            const baseUrl: string = "http://localhost:8888/order";
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

    if (isLoading) {
        return (
            <SpinnerLoading/>
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }
    return (
        <div style={{marginTop: '100px'}} className="container">
            <h1 className='custom-heading text-center'>Orders Manager</h1>
            <table className="table table-hover table-striped table-bordered">
                <thead className="thead-dark">
                <div style={{width: '300px'}} className='col-6'>
                    <div
                        style={{paddingLeft: '0'}}
                        className='d-flex'>
                        <input
                            style={{borderRadius: '0'}}
                            className='form-control me-2 w-auto' type='search'
                            placeholder='Search' aria-labelledby='Search'
                            // onChange={e => setSearch(e.target.value)}
                        />
                        <button
                            style={{borderRadius: '0'}}
                            className='btn btn-outline-dark'
                            // onClick={() => searchHandleChange()}
                        >
                            Search
                        </button>
                    </div>
                </div>
                <tr className='text-center'>
                    <th className='bg-black text-white'>ORDER ID</th>
                    <th className='bg-black text-white'>ORDER DATE</th>
                    <th className='bg-black text-white'>ORDER TOTAL AMOUNT</th>
                    <th className='bg-black text-white'>ORDER DELIVERY ADDRESS</th>
                    <th className='bg-black text-white'>DISCOUNT CODE</th>
                    <th className='bg-black text-white'>STATUS</th>
                    <th className='bg-black text-white'>ACTION</th>
                </tr>
                </thead>
                <tbody>
                {orders.map(order => (
                    <tr key={order.orderId} className='text-center'>
                        <td>{order.orderId}</td>
                        <td>{order.orderDate.toLocaleDateString()}</td>
                        <td>${order.orderTotalAmount}</td>
                        <td>{order.orderDeliveryAddress}</td>
                        <td>{order.discountCode}</td>
                        <td>{order.status}</td>
                        <td>
                            <button onClick={showModal} className='border-0 action-btn'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-eye" viewBox="0 0 16 16">
                                    <path
                                        d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zm-8 4a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
                                    <path d="M8 5a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
                                </svg>
                            </button>
                            <Modal className='ant-modal-mask' title="Order Detail" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                                {/*<OrderDetail detail={order}/>*/}
                                Hello
                            </Modal>

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
