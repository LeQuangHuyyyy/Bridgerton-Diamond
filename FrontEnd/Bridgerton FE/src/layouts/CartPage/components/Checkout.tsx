import React, {useEffect, useState} from "react";
import { Layout, Form, Input, Button, Row, Col, Card, Radio, List } from "antd";
import {jwtDecode} from "jwt-decode";
import CartModel from "../../../models/CartModel";
import {SpinnerLoading} from "../../Utils/SpinnerLoading";

const { Content } = Layout;

const Checkout = () => {
    const [products, setProducts] = useState<CartModel[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<string>();
    const [email, setEmail] = useState<string | undefined>();
    const [phone, setPhone] = useState<string | undefined>();
    const [namee, setName] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [updateFlag, setUpdateFlag] = useState(false);
    const [discount, setDiscount] = useState(0);
    const [address, setAddress] = useState<string | undefined>();
    const [userId, setUserId] = useState<number | undefined>();

    useEffect(() => {
        const data = localStorage.getItem('token');

        if (data) {
            const decodedToken = jwtDecode(data) as { id: number, email: string, name: string, phone: string };
            setEmail(decodedToken.email);
            setPhone(decodedToken.phone);
            setName(decodedToken.name)
            setUserId(decodedToken.id);
            console.log(decodedToken.email, decodedToken.name, decodedToken.phone);
        } else {
            console.log("No token found");
        }
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            const baseUrl: string = "http://localhost:8888/cart/cart";

            const addProductRequests = localStorage.getItem("cart");
            console.log(addProductRequests);
            const response = await fetch(baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodXlscXNlMTcxMjkzQGZwdC5lZHUudm4ifQ.FzAs3FrNbICbW9dUGZivmqNtMvUs7dh-fCgJy0EvluQ'
                },
                body: addProductRequests,
            });

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();
            const responseData = responseJson.data.content;

            console.log(responseData);
            const loadedProducts: CartModel[] = [];

            for (const key in responseData) {
                loadedProducts.push({
                    productId: responseData[key].productId,
                    productName: responseData[key].productName,
                    totalPrice: responseData[key].totalPrice,
                    image1: responseData[key].image1,
                    quantity: responseData[key].quantity,
                    size: responseData[key].size,
                    price: responseData[key].price,
                    sizeId: responseData[key].sizeId,
                });
            }
            setProducts(loadedProducts);
            setIsLoading(false);
        };
        fetchProducts().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
        window.scrollTo(0, 0);
    }, [updateFlag]);

    const totalAmount = products.reduce((acc, product) => acc + product.totalPrice, 0);
    const finalAmount = totalAmount - discount;
    const handleSubmit = async () => {
        const orderData = {
            userId,
            discountCode: discount,
            addressOrder: address,
            addProductRequestList: products.map(product => ({
                productId: product.productId,
                sizeId: product.sizeId,
                quantity: product.quantity,
            })),
            amount: finalAmount,
        };

        try {
            const token = localStorage.getItem("token");
            const orderResponse = await fetch('http://localhost:8888/cart/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (orderResponse.ok) {
                const orderResult = await orderResponse.json();
                const orderId = orderResult.orderId;  // Assuming the response contains the orderId

                const paymentData = {
                    orderId,
                    bankCode: "NCB",
                };
                const paymentResponse = await fetch('http://localhost:8888/payment', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(paymentData),
                });

                if (paymentResponse.ok) {
                    const paymentResult = await paymentResponse.json();
                    window.location.href = paymentResult.paymentUrl;
                } else {
                    console.error("Failed to create payment");
                }
            } else {
                console.error("Failed to create order");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

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
        <Layout style={{ minHeight: "100vh" }}>
            <Content style={{ padding: '50px',paddingTop: '0px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Row gutter={24} style={{ width: '100%' }}>
                    <Col span={16}>
                        <Card title="Checkout">
                            <Form
                                name="checkout"
                                layout="vertical"
                                onFinish={handleSubmit}
                            >
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Email"
                                            name="email"
                                        >
                                            {email}
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Name"
                                            name="name"
                                        >
                                            {namee}
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item
                                    label="Phone"
                                    name="phoneNumber"
                                >
                                    {phone}
                                </Form.Item>

                                <Form.Item
                                    label="Address"
                                    name="address"
                                    rules={[{ required: true, message: 'Please input your address!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item>
                                    <Button style={{backgroundColor: 'black', color: "white"}} htmlType="submit">
                                        Place Order
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </Col>
                    <Col span={8}>
                            <Card title="Bill Summary">
                            <List
                                dataSource={products}
                                renderItem={item => (
                                    <List.Item>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '10px',
                                            borderBottom: '1px solid #f0f0f0'
                                        }}>
                                            <div style={{ marginRight: '15px' }}>
                                                <img
                                                    src={`http://localhost:8888/product/load-image/${item.image1}.jpg`}
                                                    alt="product"
                                                    style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        objectFit: 'cover',
                                                        borderRadius: '5px'
                                                    }}
                                                />
                                            </div>
                                            <div style={{
                                                flex: 1,
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}>
                                                <div style={{
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    marginBottom: '5px'
                                                }}>{item.productName}</div>
                                                <div style={{
                                                    fontSize: '12px',
                                                    color: '#888'
                                                }}>
                                                    {item.quantity} x ${item.totalPrice}
                                                </div>
                                            </div>
                                        </div>
                                    </List.Item>

                                )}
                            />
                            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                <div>Total:</div>
                                <div>${totalAmount}</div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                <div>Discount:</div>
                                <div>-${discount}</div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontWeight: 'bold' }}>
                                <div>Final Amount:</div>
                                <div>${finalAmount}</div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default Checkout;
