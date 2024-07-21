import React, {useEffect, useState} from "react";
import {Button, Card, Col, Form, Input, Layout, List, Row} from "antd";
import {jwtDecode} from "jwt-decode";
import CartModel from "../../../models/CartModel";
import {SpinnerLoading} from "../../Utils/SpinnerLoading";
import {Simulate} from "react-dom/test-utils";

const {Content} = Layout;

const Checkout = () => {
    const [products, setProducts] = useState<CartModel[]>([]);
    const [email, setEmail] = useState<string | undefined>();
    const [phone, setPhone] = useState<string | undefined>();
    const [namee, setName] = useState<string | undefined>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [updateFlag, setUpdateFlag] = useState(false);
    const [address, setAddress] = useState<string | undefined>();
    const [userId, setUserId] = useState<number | undefined>();
    const [finalAmount, setFinalAmount] = useState<number>(0);

    useEffect(() => {
        window.scrollTo(0,0)
        fetchProducts();
        const data = localStorage.getItem('token')
        if (!data || localStorage.getItem('token') === null) {
            window.location.href = '/login'
        } else {
            const decodedToken = jwtDecode(data) as { id: number, email: string, name: string, phone: string };
            setEmail(decodedToken.email);
            setPhone(decodedToken.phone);
            setName(decodedToken.name)
            setUserId(decodedToken.id);
            console.log(decodedToken.email, decodedToken.name, decodedToken.phone);
        }
        window.scrollTo(0, 0);
    }, [updateFlag]);

    const fetchProducts = async () => {
        try {
            const baseUrl: string = "https://deploy-be-b176a8ceb318.herokuapp.com/cart/cart";

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

        } catch (error: any) {
            setIsLoading(false);
            setHttpError(error.message);
        }
    };

    useEffect(() => {
        const totalAmount = products.reduce((acc, product) => acc + product.totalPrice, 0);
        handleApplyPromoCode(totalAmount);
    }, [products]);

    const handleApplyPromoCode = async (totalPrice: number) => {
        try {
            const promoCode = localStorage.getItem('promoCode');
            if(!promoCode) {
                throw new Error('Promo code not found');
            }

            const token = localStorage.getItem('token');
            const response = await fetch(`https://deploy-be-b176a8ceb318.herokuapp.com/cart/apply-code?discountCode=${promoCode}&totalAmount=${totalPrice}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            if (response.ok) {
                const data = await response.json();
                if (data.data !== totalPrice) {
                    setFinalAmount(data.data);
                } else {
                    setFinalAmount(totalPrice);
                }
            } else {
                throw new Error('Failed to apply promo code');
            }
        } catch (error) {
            console.error('Error applying promo code:', error);
            setFinalAmount(totalPrice);
        }
    };

    const handleSubmit = async () => {
        const orderData = {
            userId,
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
            const orderResponse = await fetch('https://deploy-be-b176a8ceb318.herokuapp.com/cart/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (orderResponse.ok) {
                const orderResult = await orderResponse.json();
                const orderId = orderResult.orderId;

                const paymentData = {
                    orderId,
                    bankCode: "NCB",
                };
                const paymentResponse = await fetch('https://deploy-be-b176a8ceb318.herokuapp.com/payment', {
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

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(e.target.value);
    };

    return (
        <Layout style={{minHeight: "100vh"}}>
            <Content style={{
                padding: '50px',
                paddingTop: '0px',
                paddingBottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Row gutter={24} style={{width: '100%'}}>
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
                                    rules={[{required: true, message: 'Please input your address!'}]}
                                >
                                    <Input value={address} onChange={handleAddressChange}/>
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
                                            <div style={{marginRight: '15px'}}>
                                                <img
                                                    src={item.image1}
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
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: '10px',
                                fontWeight: 'bold'
                            }}>
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
