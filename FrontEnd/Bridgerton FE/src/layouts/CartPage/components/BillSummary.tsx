import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Input, Layout, Row, Typography} from 'antd';
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
    const [totalAmount] = useState<number>(props.cart);
    const [finalPrice, setFinalPrice] = useState<number>(props.cart);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [point, setPoint] = useState<number>(0);
    const [userId, setUserId] = useState<number>(0);
    const [pointError, setPointError] = useState<string>('');

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
        // if (point > props.point || point < 0) {
        //     setPointError('Points must be between 0 and your current points.');
        //     return;
        // }
        try {
            const response = await fetch(`https://deploy-be-b176a8ceb318.herokuapp.com/cart/useDiscountAndPoint?originalPrice=${totalAmount}&discountCode=${discountCode}&point=${point}&userId=${userId}`, {
                method: 'POST',
                headers: headers,
            });
            console.log(response);
            if (response.ok) {
                const data = await response.json();
                if (data.data.message !== null) {
                    if (data.data.message === 'point') {
                        setPointError(`Points must be between 0 and ${props.point}.`);
                        setFinalPrice(data.data.finalPrice);
                    }
                    if (data.data.message === 'discount') {
                        setErrorMessage('Invalid discount code.');
                        setFinalPrice(data.data.finalPrice);
                    }
                    if (data.data.message === 'all') {
                        setPointError(`Points must be between 0 and ${props.point}.`);
                        setErrorMessage('Invalid discount code.');
                    }
                } else {
                    setFinalPrice(data.data.finalPrice);
                    setErrorMessage('');
                    setPointError('');
                }
                handleSetData();
            } else {
                setErrorMessage('The response is not a valid JSON.');
            }
        } catch (error) {
            console.error('Error applying discount code:', error);
            setErrorMessage('Error applying discount code.');
        }
    };

    const handleSetData = () => {
        if (discountCode.trim() && errorMessage === '') {
            localStorage.setItem('discountCode', discountCode);
            setErrorMessage('');
        } else {
            localStorage.removeItem('discountCode');
        }
        console.log(point);
        if (point > 0 && point <= props.point && pointError === '') {
            localStorage.setItem('point', point.toString());
        } else {
            localStorage.removeItem('point');
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
                            {pointError && <Text type="danger">{pointError}</Text>}
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
                            <Text><strong>${finalPrice.toLocaleString()}</strong></Text>
                        </Col>
                    </Row>
                    <Button type="primary" size="large" style={{backgroundColor: 'black', width: '100%'}}
                            onClick={handleSetData}>
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
