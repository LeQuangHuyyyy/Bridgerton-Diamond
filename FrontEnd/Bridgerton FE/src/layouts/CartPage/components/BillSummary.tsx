import React, {useEffect, useState} from 'react';
import {Layout, Card, Typography, Button, Row, Col, Input} from 'antd';
import {Link} from 'react-router-dom';
import {jwtDecode} from "jwt-decode";

const {Content} = Layout;
const {Text, Title} = Typography;
const token = localStorage.getItem('token');
const headers = {
    'Authorization': `Bearer ${token}`
}
const BillSummary: React.FC<{ cart: number, point: number }> = (props) => {
    const [discountCode, setDiscountCode] = useState<string>('');
    const [totalAmount, setTotalAmount] = useState<number>(props.cart);
    const [originalAmount] = useState<number>(props.cart);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [point, setPoint] = useState<number>(0);
    const [userId, setUserId] = useState<number>(0);

    useEffect(() => {
        const data = localStorage.getItem('token');

        if (data) {
            const decodedToken = jwtDecode(data) as { id: number };
            setUserId(decodedToken.id)
        } else {
            console.log("No token found");
        }
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const handleApply = async () => {
        try {
            const response = await fetch(`https://deploy-be-b176a8ceb318.herokuapp.com/cart/useDiscountAndPoint?originalPrice=${totalAmount}&discountCode=${discountCode}&point=${point}&userId=${userId}`, {
                method: 'POST',
                headers: headers,
            });
            if (response.ok) {
                const data = await response.json();
                if (data.data !== originalAmount) {
                    setTotalAmount(data.data.finalPrice);
                    localStorage.setItem('discountCode', discountCode);
                    localStorage.setItem('point', point.toString());
                    setErrorMessage('');
                } else {
                    setErrorMessage('The discount code is invalid or has expired.');
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
        <Layout style={{minHeight: "100vh", display: 'flex'}}>
            <Content style={{padding: '50px', width: '100%', maxWidth: '500px'}}>
                <Card>
                    <Title level={4}>Cart Total</Title>
                    <hr/>
                    <Row style={{marginBottom: '16px'}}>
                        <Col span={12}>
                            <Text>Total products: </Text>
                        </Col>
                        <Col span={12} style={{textAlign: 'right'}}>
                            <Text><strong>${props.cart.toLocaleString()}</strong></Text>
                        </Col>
                    </Row>
                    <Row style={{marginBottom: '16px'}}>
                        <Col span={12}>
                            <Text>Shipping: </Text>
                        </Col>
                        <Col span={12} style={{textAlign: 'right'}}>
                            <Text><strong>Free</strong></Text>
                        </Col>
                    </Row>
                    <Text style={{fontSize: 14, margin: 0}}>Current point: {props.point}</Text>
                    <Row style={{marginBottom: '16px'}}>
                        <Col span={24}>
                            <Text>Use Accumulated Point: </Text>
                            <Row gutter={8}>
                                <Col span={24}>
                                    <Input
                                        placeholder="Enter your point"
                                        value={point}
                                        onChange={(e) => setPoint(parseInt(e.target.value) || 0)}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{marginBottom: '16px'}}>
                        <Col span={24}>
                            <Text>Discount Code: </Text>
                            <Row gutter={8}>
                                <Col span={24}>
                                    <Input
                                        placeholder="Enter discount code"
                                        value={discountCode}
                                        onChange={(e) => setDiscountCode(e.target.value)}
                                    />
                                </Col>
                            </Row>
                            {errorMessage && <Text type="danger">{errorMessage}</Text>}
                        </Col>
                    </Row>
                    <Col span={8}>
                        <Button style={{color: 'green', width: '100%'}}
                                onClick={handleApply}>Apply</Button>
                    </Col>
                    <Row style={{marginBottom: '16px'}}>
                        <Col span={12}>
                            <Text>Total after discount: </Text>
                        </Col>
                        <Col span={12} style={{textAlign: 'right'}}>
                            <Text><strong>${totalAmount.toLocaleString()}</strong></Text>
                        </Col>
                    </Row>
                    <Button type="primary" size="large" style={{backgroundColor: 'black', width: '100%'}}>
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
