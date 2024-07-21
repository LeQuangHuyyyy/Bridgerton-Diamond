import React, { useEffect, useState } from 'react';
import { Layout, Card, Typography, Button, Row, Col, Input } from 'antd';
import { Link } from 'react-router-dom';
const { Content } = Layout;
const { Text, Title } = Typography;

const BillSummary: React.FC<{ cart: number }> = (props) => {
    const [promoCode, setPromoCode] = useState<string>('');
    const [totalAmount, setTotalAmount] = useState<number>(props.cart);
    const [originalAmount] = useState<number>(props.cart);
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const data = localStorage.getItem('token');
        if (!data || localStorage.getItem('token') === null) {
            window.location.href = '/login';
        }
        window.scrollTo(0, 0);
    }, []);

    const handleApplyPromoCode = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`https://deploy-be-b176a8ceb318.herokuapp.com/cart/apply-code?discountCode=${promoCode}&totalAmount=${totalAmount}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            if (response.ok) {
                const data = await response.json();
                if (data.data !== originalAmount) {
                    setTotalAmount(data.data);
                    localStorage.setItem('promoCode', promoCode);
                    setErrorMessage('');
                } else {
                    setErrorMessage('The promo code is invalid or has expired.');
                }
            } else {
                setErrorMessage('The response is not a valid JSON.');
            }
        } catch (error) {
            console.error('Error applying promo code:', error);
            setErrorMessage('Error applying promo code.');
        }
    };

    return (
        <Layout style={{ minHeight: "100vh", display: 'flex' }}>
            <Content style={{ padding: '50px', width: '100%', maxWidth: '500px' }}>
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
                            <Row gutter={8}>
                                <Col span={16}>
                                    <Input
                                        placeholder="Enter discount code"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                    />
                                </Col>
                                <Col span={8}>
                                    <Button style={{ color: 'green', width: '100%' }} onClick={handleApplyPromoCode}>Apply</Button>
                                </Col>
                            </Row>
                            {errorMessage && <Text type="danger">{errorMessage}</Text>}
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '16px' }}>
                        <Col span={12}>
                            <Text>Total after discount: </Text>
                        </Col>
                        <Col span={12} style={{ textAlign: 'right' }}>
                            <Text><strong>${totalAmount}</strong></Text>
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
