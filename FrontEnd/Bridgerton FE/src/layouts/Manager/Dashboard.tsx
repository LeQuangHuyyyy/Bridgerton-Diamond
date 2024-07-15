import React, {useEffect, useState} from 'react';
import { Layout, Breadcrumb, Card, Row, Col } from 'antd';
import {MoneyCollectOutlined, ShoppingCartOutlined, LineChartOutlined, ShoppingOutlined} from '@ant-design/icons';
import Chart from "./component/Chart";
import PieChartComponent from "./component/PieChartComponent";
import {SpinnerLoading} from "../Utils/SpinnerLoading";

const headers = {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjdXN0b21lckBnbWFpbC5jb20iLCJpZCI6MSwibmFtZSI6IkNVUyIsInJvbGUiOiJDVVNUT01FUiIsInBob25lIjoiMTIzMTIzMTIzMTIiLCJhZGRyZXNzIjoiMjM0LzIzNCAifQ.9R2lECgKGx5pI1euKSGUnBl9ufhGs2YsaG5uhipN6cg'
}

const {Content} = Layout;
const Dashboard = () => {
    const [totalOrders, setTotalOrders] = useState();
    const [revenuel, setRevenuel] = useState();
    const [totalProducts, setTotalProducts] = useState();
    const [profit, setProfit] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const baseUrl: string = "https://deploy-be-b176a8ceb318.herokuapp.com/manager/orderLastWeek";
            const url: string = `${baseUrl}`;
            const response = await fetch(url, {headers: headers});
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            const responseJson = await response.json();
            const responseData = responseJson.data;
            setTotalOrders(responseData.length);
            setIsLoading(false);
        };
        fetchData().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
            console.log(error);
        })
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            const baseUrl: string = "https://deploy-be-b176a8ceb318.herokuapp.com/manager/productLastWeek";
            const url: string = `${baseUrl}`;
            const response = await fetch(url, {headers: headers});
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            const responseJson = await response.json();
            const responseData = responseJson.data;
            setTotalProducts(responseData.length);
            setIsLoading(false);
        };
        fetchData().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
            console.log(error);
        })
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const baseUrl: string = "https://deploy-be-b176a8ceb318.herokuapp.com/manager/revenueLastWeek";
            const url: string = `${baseUrl}`;
            const response = await fetch(url, {headers: headers});
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            const responseJson = await response.json();
            const responseData = responseJson.data;
            setRevenuel(responseData);
            setIsLoading(false);
        };
        fetchData().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
            console.log(error);
        })
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            const baseUrl: string = "https://deploy-be-b176a8ceb318.herokuapp.com/manager/getProfit";
            const url: string = `${baseUrl}`;
            const response = await fetch(url, {headers: headers});
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            const responseJson = await response.json();
            const responseData = responseJson.data;
            setProfit(responseData);
            setIsLoading(false);
        };
        fetchData().catch((error: any) => {
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
            <Content>
                <Breadcrumb>
                    <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
                </Breadcrumb>
                <div>
                    <Row gutter={16}>
                        <Col span={6}>
                            <Card>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <MoneyCollectOutlined style={{ fontSize: '48px', color: '#30BF78' }} />
                                    <div style={{ marginLeft: '16px' }}>
                                        <div style={{ fontSize: '16px', color: '#8c8c8c' }}>Total Sale</div>
                                        <div style={{ fontSize: '24px'}}>${revenuel}</div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <ShoppingOutlined style={{ fontSize: '48px', color: '#D897EB' }} />
                                    <div style={{ marginLeft: '16px' }}>
                                        <div style={{ fontSize: '16px', color: '#8c8c8c' }}>Total Orders</div>
                                        <div style={{ fontSize: '24px'}}>{totalOrders}</div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <ShoppingCartOutlined style={{ fontSize: '48px', color: '#8FC9FB' }} />
                                    <div style={{ marginLeft: '16px' }}>
                                        <div style={{ fontSize: '16px', color: '#8c8c8c' }}>Total Items Sold</div>
                                        <div style={{ fontSize: '24px'}}>{totalProducts}</div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <LineChartOutlined style={{ fontSize: '48px', color: '#F69899' }} />
                                    <div style={{ marginLeft: '16px' }}>
                                        <div style={{ fontSize: '16px', color: '#8c8c8c' }}>Total Profit</div>
                                        <div style={{ fontSize: '24px'}}>{profit}%</div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                    <Row gutter={16} style={{ marginTop: 16 }}>
                        <Col span={16}>
                            <p className='mb-0 mt-3'>Diamond Sold</p>
                            <Chart/>
                        </Col>
                        <Col span={8}>
                            <Row gutter={16}>
                                <p className='mb-0 mt-3'>Product Sold</p>
                                <PieChartComponent/>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </Content>
    );
};

export default Dashboard;
