import React from 'react';
import { Layout, Card, Typography, Button, Row, Col, Input } from 'antd';
import { Link } from 'react-router-dom';
const { Content } = Layout;
const { Text, Title } = Typography;

const BillSummary: React.FC<{ cart: number}> = (props)=> {
    return (
        <Layout style={{ minHeight: "100vh", display: 'flex' }}>
            <Content style={{ padding: '50px', width: '100%', maxWidth: '400px' }}>
                <Card>
                    <Title level={4}>Cart Total</Title>
                    <hr />
                    <Row style={{ marginBottom: '16px' }}>
                        <Col span={12}>
                            <Text>Total products: </Text>
                        </Col>
                        <Col span={12} style={{ textAlign: 'right' }}>
                            <Text><strong>${props.cart}</strong></Text>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '16px' }}>
                        <Col span={12}>
                            <Text>Shipping: </Text>
                        </Col>
                        <Col span={12} style={{ textAlign: 'right' }}>
                            <Text><strong>Free</strong></Text>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '16px' }}>
                        <Col span={24}>
                            <label>Promo Code: </label>
                            <Input placeholder="Enter discount code" />
                        </Col>
                    </Row>
                    <Button type="primary" size="large" style={{ backgroundColor: 'black', width: '100%' }}>
                        <Link className='text-decoration-none text-white' to={'/checkout'}>
                            PROCEED TO CHECKOUT
                        </Link>
                    </Button>
                </Card>
            </Content>
        </Layout>
    );
};

export default BillSummary;
