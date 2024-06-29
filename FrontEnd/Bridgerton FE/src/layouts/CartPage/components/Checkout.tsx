import React, { useState } from "react";
import { Layout, Form, Input, Button, Checkbox, Row, Col, Card, Radio, List } from "antd";

const { Content } = Layout;

const Checkout = () => {
    const [paymentMethod, setPaymentMethod] = useState<string>("cash");

    const handlePaymentChange = (e: any) => {
        setPaymentMethod(e.target.value);
    };

    // Giả sử có danh sách sản phẩm và các thông tin cần thiết
    const products = [
        { name: "Product 1", price: 100 },
        { name: "Product 2", price: 200 },
    ];

    const totalAmount = products.reduce((acc, product) => acc + product.price, 0);
    const discount = 50; // Giảm giá cố định
    const finalAmount = totalAmount - discount;

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Content style={{ padding: '50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Row gutter={24} style={{ width: '100%' }}>
                    <Col span={16}>
                        <Card title="Checkout">
                            <Form
                                name="checkout"
                                initialValues={{ remember: true }}
                                layout="vertical"
                            >
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <Form.Item
                                            label="First Name"
                                            name="firstName"
                                            rules={[{ required: true, message: 'Please input your first name!' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            label="Last Name"
                                            name="lastName"
                                            rules={[{ required: true, message: 'Please input your last name!' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item
                                    label="Phone"
                                    name="phone"
                                    rules={[{ required: true, message: 'Please input your phone number!' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Address"
                                    name="address"
                                    rules={[{ required: true, message: 'Please input your address!' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    name="paymentMethod"
                                    label="Payment Method"
                                    rules={[{ required: true, message: 'Please select a payment method!' }]}
                                >
                                    <Radio.Group onChange={handlePaymentChange} value={paymentMethod}>
                                        <Radio value="cash">Cash on Delivery</Radio>
                                        <Radio value="vnpay">VNPay</Radio>
                                    </Radio.Group>
                                </Form.Item>

                                {paymentMethod === "vnpay" && (
                                    <div>
                                        <Form.Item
                                            label="VNPay Account"
                                            name="vnpayAccount"
                                            rules={[{ required: true, message: 'Please input your VNPay account!' }]}
                                        >
                                            <Input />
                                        </Form.Item>

                                        <Form.Item
                                            label="VNPay Transaction ID"
                                            name="vnpayTransactionId"
                                            rules={[{ required: true, message: 'Please input your VNPay transaction ID!' }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </div>
                                )}

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
                                        <div>{item.name}</div>
                                        <div>${item.price}</div>
                                    </List.Item>
                                )}
                            />
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
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
