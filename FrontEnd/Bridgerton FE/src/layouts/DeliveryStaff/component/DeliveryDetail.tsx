import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import OrderDetailModel from "../../../models/OrderDetailModel";
import {SpinnerLoading} from "../../Utils/SpinnerLoading";
import {Avatar, Card, Descriptions, Form, List, Row, Col, Input} from "antd";
import {ShoppingCartOutlined, UserOutlined, MailOutlined, PhoneOutlined} from "@ant-design/icons";
import './DeliveryDetail.css';
import {Link} from "react-router-dom";
import orderDetail from "../../SaleStaff/component/OrderDetail";

const token = localStorage.getItem("token");
const headers = {
    'Authorization': `Bearer ${token}`
}

const DeliveryDetail: React.FC = (props) => {
    const [details, setDetails] = useState<OrderDetailModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const orderId = window.location.pathname.split("/")[2];
    useEffect(() => {
        fetchDetail();
    }, []);

    const fetchDetail = async () => {
        const baseUrl: string = `http://localhost:8888/order/OrdersData/${orderId}`;
        const url: string = `${baseUrl}`;
        const response = await fetch(url, {headers: headers});
        if (!response.ok) {
            throw new Error('Something went wrong!');
        }

        const responseJson = await response.json();
        const loadedDetail: OrderDetailModel = {
            orderId: responseJson.data.orderId,
            productId: responseJson.productId,
            quantity: responseJson.quantity,
            size: responseJson.size,
            email: responseJson.data.email,
            orderDate: responseJson.data.orderDate,
            totalAmount: responseJson.data.totalAmount,
            userName: responseJson.data.userName,
            staff: responseJson.data.saleStaff,
            orderAddress: responseJson.data.address,
            products: responseJson.data.product,
            price: responseJson.price,
            status: responseJson.data.orderStatus,
            image: responseJson.data.image,
            totalProductInOrder: responseJson.data.totalProductInOrder,
        };
        setDetails(loadedDetail);
        setIsLoading(false);
    };
    fetchDetail().catch((error: any) => {
        setIsLoading(false);
        setHttpError(error.message);
        console.log(error);
    });
    console.log(details)

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    if (isLoading) {
        return (
            <SpinnerLoading/>
        )
    }
    const getStatusColor = (status: any) => {
        switch (status) {
            case 'PENDING':
                return {
                    backgroundColor: '#FFF3CD',
                    color: '#FFC107',
                    fontWeight: 'bold',
                    border: '1px solid #FFC107',
                };
            case 'CONFIRMED':
                return {
                    backgroundColor: '#D1E7DD',
                    color: '#198754',
                    fontWeight: 'bold',
                    border: '1px solid #198754',
                };
            case 'PAYMENT':
                return {
                    backgroundColor: '#CFF4FC',
                    color: '#13C2C2',
                    fontWeight: 'bold',
                    border: '1px solid #13C2C2',
                };
            case 'DELIVERED':
                return {
                    backgroundColor: '#FFFF99',
                    color: '#664D03',
                    fontWeight: 'bold',
                    border: '1px solid #664D03',
                };
            case 'CANCELED':
                return {
                    backgroundColor: '#F8D7DA',
                    color: '#58151C',
                    fontWeight: 'bold',
                    border: '1px solid #58151C',
                };
            case 'RECEIVED':
                return {
                    backgroundColor: '#D1E7DD',
                    color: '#198754',
                    fontWeight: 'bold',
                    border: '1px solid #198754',
                };
            default:
                return {
                    backgroundColor: '#FFFF99',
                    color: '#664D03',
                    fontWeight: 'bold',
                    border: '1px solid #664D03',
                };
        }
    };

    return (
        <div style={{padding: 24}}>
            <h1 style={{textAlign: 'center', marginBottom: '19px'}} className="custom-heading">Order
                Details: {details?.orderId}</h1>
            <Row gutter={10}
                 style={{marginBottom: 24, display: 'flex', justifyContent: 'space-around', alignItems: 'center'}}>
                <Col span={8}>
                    <Card style={{backgroundColor: '#F8D7DA', borderRadius: '8px', border: '1px solid #F1AEB5'}}>
                        <div className="info-container">
                            <UserOutlined className='name-icon'/>
                            <div className="info ms-5">
                                <div className="name-title d-flex justify-content-between">
                                    <div>
                                        Name:
                                    </div>
                                    <div>
                                        {details?.userName}
                                    </div>
                                </div>

                                <div className="name-title d-flex justify-content-between gap-5">
                                    <div>
                                        Email:
                                    </div>
                                    <div>
                                        {details?.email}
                                    </div>
                                </div>

                                <div className="name-title d-flex justify-content-between gap-5">
                                    <div>
                                        Name:
                                    </div>
                                    <div>
                                        {details?.userName}
                                    </div>
                                </div>

                                <div className="name-title d-flex justify-content-between gap-5">
                                    <div>
                                        Order Date:
                                    </div>
                                    <div>
                                        {details?.orderDate.substring(0, 10)}
                                    </div>
                                </div>

                                <div className="name-title d-flex justify-content-between gap-5">
                                    <div>
                                        Address:
                                    </div>
                                    <div>
                                        {details?.orderAddress}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card style={{backgroundColor: '#FFF3CD', borderRadius: '8px', border: '1px solid #FFE69C'}}>
                        <div className="info-container">
                            <UserOutlined className="email-icon"/>
                            <div className="info ms-5">
                                <div className="email-title">Sale Staff</div>
                                <div style={{color: '#664D03'}} className="email-content">{details?.staff}</div>
                            </div>
                        </div>
                    </Card>
                </Col>

            </Row>

            <Row gutter={20}>
                <Col span={14}>
                    <Card title="Order Summary">
                        <List
                            itemLayout="horizontal"
                            dataSource={details?.products}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar style={{width: '55px', height: '55px'}} shape="square"
                                                        size="large"
                                                        src={`http://localhost:8888/product/load-image/${details?.image}.jpg`}/>}
                                        title={<span style={{fontSize: '17px'}}>{item.productName}</span>}
                                        description={<span style={{fontSize: '15px'}}>Size: {item.size}</span>}
                                    />
                                    <div className="product-details">
                                        <span className="product-quantity">{item.quantity}x</span>
                                        <span className="product-price">Price: ${item.price.toFixed(2)}</span>
                                    </div>
                                </List.Item>
                            )}
                        />
                        <Descriptions column={1} style={{marginTop: 24, fontSize: '16px'}}>
                            <Descriptions.Item label="Subtotal Price" style={{fontWeight: 'bold', fontSize: '18px'}}>
                                ${details?.totalAmount}
                            </Descriptions.Item>
                            <Descriptions.Item label="Shipping Cost" style={{fontSize: '16px'}}>
                                Free
                            </Descriptions.Item>
                            <Descriptions.Item label="Discount" style={{fontSize: '16px'}}>
                                -$0
                            </Descriptions.Item>
                            <Descriptions.Item label="Tax (18%)" style={{fontSize: '16px'}}>
                                $18%
                            </Descriptions.Item>
                            <Descriptions.Item label="Total"
                                               style={{fontWeight: 'bold', fontSize: '20px', color: 'red'}}>
                                ${details?.totalAmount.toFixed(2)}
                            </Descriptions.Item>
                        </Descriptions>

                    </Card>
                </Col>
                <Col span={10}>
                    <Card>
                        <Form layout="vertical">
                            <Form.Item label="Order ID:">
                                {details?.orderId}
                            </Form.Item>
                            <Form.Item label="Order Status:">
                                <Input value={details?.status} disabled
                                       style={{width: '18%', textAlign: 'center', ...getStatusColor(details?.status)}}/>
                            </Form.Item>
                            <Form.Item label="Quantity:">
                                {details?.totalProductInOrder}
                            </Form.Item>
                            <Form.Item>
                                <Link to={"/deliverystaff"} style={{
                                    padding: '10px',
                                    textDecoration: 'none',
                                    fontSize: '16px',
                                    borderRadius: "5px",
                                    backgroundColor: '#3AA6B9'
                                }} className="text-white">Back to list</Link>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>

            </Row>
        </div>
    );
};


export default DeliveryDetail;
