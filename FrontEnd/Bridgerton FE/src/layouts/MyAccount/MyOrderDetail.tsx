import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Avatar, Card, Descriptions, Form, List, Row, Col, Input, Spin, Image} from "antd";
import {ShoppingCartOutlined, UserOutlined, MailOutlined, PhoneOutlined} from "@ant-design/icons";
import './MyOrderDetail.css';
import {Link} from "react-router-dom";
import OrderDetailModel from "../../models/OrderDetailModel";

const token = localStorage.getItem("token");
const headers = {
    'Authorization': `Bearer ${token}`
}

const MyOrderDetail: React.FC = (props) => {
    const [details, setDetails] = useState<OrderDetailModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const orderId = window.location.pathname.split("/")[2];
    useEffect(() => {
        const fetchDetail = async () => {
            const baseUrl: string = `https://deploy-be-b176a8ceb318.herokuapp.com/order/OrdersData/${orderId}`;
            const url: string = `${baseUrl}`;
            const response = await fetch(url, {headers: headers});
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();
            console.log(responseJson);
            const loadedDetail: OrderDetailModel = {
                orderId: responseJson.data.orderId,
                productId: responseJson.productId,
                quantity: responseJson.quantity,
                price: responseJson.price,
                size: responseJson.size,
                email: responseJson.data.email,
                orderDate: responseJson.data.orderDate,
                totalAmount: responseJson.data.totalAmount,
                userName: responseJson.data.userName,
                products: responseJson.data.product,
                status: responseJson.data.orderStatus,
                totalProductInOrder: responseJson.data.totalProductInOrder,
                phoneNumber: responseJson.data.phoneNumber,
                saleStaff: responseJson.data.saleStaff,
                saleId: responseJson.data.saleId,
            };
            setDetails(loadedDetail);
            console.log(loadedDetail);
            setIsLoading(false);
        };
        fetchDetail().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
            console.log(error);
        });
    }, []);

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    if (isLoading) {
        return (
            <Spin/>
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
            case 'PAYMENT':
                return {
                    backgroundColor: '#CFF4FC',
                    color: '#13C2C2',
                    fontWeight: 'bold',
                    border: '1px solid #13C2C2',
                };
            case 'DELIVERED':
                return {
                    backgroundColor: '#D1E7DD',
                    color: '#198754',
                    fontWeight: 'bold',
                    border: '1px solid #198754',
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
        <div style={{ padding: 24, paddingTop: 0 }}>
            <Row gutter={16} style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between' }}>
                <Col span={6}>
                    <Card style={{backgroundColor: '#D1E7DD', borderRadius: '8px', border: '1px solid #A3CFBB'}}>
                        <div className="info-container">
                            <ShoppingCartOutlined className="order-icon"/>
                            <div className="info">
                                <div className="order-title">Order Created at</div>
                                <div className="order-content">{details?.orderDate.substring(0,10)}</div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={{backgroundColor: '#F8D7DA', borderRadius: '8px', border: '1px solid #F1AEB5'}}>
                        <div className="info-container">
                            <UserOutlined className='name-icon'/>
                            <div className="info">
                                <div className="name-title">Name</div>
                                <div className="name-content">{details?.userName}</div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={{ backgroundColor: '#FFF3CD', borderRadius: '8px', border: '1px solid #FFE69C'}}>
                        <div className="info-container">
                            <MailOutlined className="email-icon"/>
                            <div className="info">
                                <div className="email-title">Email</div>
                                <div style={{color: '#664D03'}} className="email-content">{details?.email}</div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col span={6}>
                    <Card style={{ backgroundColor: '#CFF4FC', borderRadius: '8px', border: '1px solid #9EEAF9'}}>
                        <div className="info-container">
                            <PhoneOutlined className="contact-icon" />
                            <div className="info">
                                <div className="contact-title">Contact No</div>
                                <div className="contact-content">{details?.phoneNumber}</div>
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
                                        avatar={<Avatar style={{width: '55px', height: '55px'}} shape="square" size="large" src={item.image} />}
                                        title={<span style={{fontSize: '17px'}}>{item.productName}</span>}
                                        description={
                                            <div>
                                                <span style={{fontSize: '15px'}}>Size: {item.size}</span>
                                                <div>
                                                    <Image style={{width: '80px', height: '90px'}} src={item.warrantiesImage} />
                                                    <Image style={{width: '80px', height: '90px'}} src={item.certificateImage} />
                                                </div>
                                            </div>
                                        }
                                    />
                                    <div className="product-details">
                                        <span className="product-quantity">{item.quantity}x</span>
                                        <span className="product-price">Price: ${item.price.toFixed(2)}</span>
                                    </div>
                                </List.Item>
                            )}
                        />
                        <Descriptions column={1} style={{ marginTop: 24, fontSize: '16px' }}>
                            <Descriptions.Item label="Subtotal Price" style={{ fontWeight: 'bold', fontSize: '18px' }}>
                                ${details?.totalAmount}
                            </Descriptions.Item>
                            <Descriptions.Item label="Shipping Cost" style={{ fontSize: '16px' }}>
                                Free
                            </Descriptions.Item>
                            <Descriptions.Item label="Total" style={{ fontWeight: 'bold', fontSize: '20px', color: 'red' }}>
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
                                <Input value={details?.status} disabled style={{ width: '23%', textAlign: 'center', ...getStatusColor(details?.status) }} />
                            </Form.Item>
                            <Form.Item label="Quantity:">
                                {details?.totalProductInOrder}
                            </Form.Item>
                            <Form.Item>
                                <Link to={"/myorders"} style={{padding: '10px', textDecoration: 'none', fontSize: '16px', borderRadius: "5px", backgroundColor: '#3AA6B9'}} className="text-white">Back to list</Link>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};


export default MyOrderDetail;
