import React, {useEffect, useState} from 'react';
import { Layout, Breadcrumb, Card, Row, Col } from 'antd';
import {MoneyCollectOutlined, ShoppingCartOutlined, LineChartOutlined, ShoppingOutlined} from '@ant-design/icons';
import Chart from "./component/Chart";
import PieChartComponent from "./component/PieChartComponent";

const headers = {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjdXN0b21lckBnbWFpbC5jb20iLCJpZCI6MSwibmFtZSI6IkNVUyIsInJvbGUiOiJDVVNUT01FUiIsInBob25lIjoiMTIzMTIzMTIzMTIiLCJhZGRyZXNzIjoiMjM0LzIzNCAifQ.9R2lECgKGx5pI1euKSGUnBl9ufhGs2YsaG5uhipN6cg'
}
interface data {
    total: number;
    totalOrders: number;
    totalProducts: number;
    totalSale: number;
}
const {Content} = Layout;
const Dashboard = () => {
    const [data, setData] = useState<data | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const totalResPromise = fetch('https://localhost:8888/manager/total', {headers: headers});
                const totalOrdersResPromise = fetch('https://deploy-be-b176a8ceb318.herokuapp.com/manager/orderLastWeek', {headers: headers});
                const totalProductsResPromise = fetch('https://localhost:8888/manager/productLastWeek');
                const totalSaleResPromise = fetch('https://localhost:8888/manager/revenueLastWeek');

                console.log(totalSaleResPromise)
                const [totalRes, totalOrdersRes, totalProductsRes] = await Promise.all([
                    // totalResPromise,
                    totalOrdersResPromise,
                    totalProductsResPromise,
                    totalSaleResPromise
                ]);

                const total = await totalRes.json();
                const totalOrders = await totalOrdersRes.json();
                const totalProducts = await totalProductsRes.json();
                // const totalSale = await totalSaleRes.json();

                setData({
                    total: total.value,
                    totalOrders: totalOrders.data.length,
                    totalProducts: totalProducts.value,
                    totalSale: 0,
                });
                console.log(data)
            } catch (error) {
                console.error('Failed to fetch data', error);
            }
        };

        fetchData();
    }, []);

    return (
            <Content style={{ padding: '0 50px' }}>
                <Breadcrumb>
                    <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content">
                    <Row gutter={16}>
                        <Col span={6}>
                            <Card>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <MoneyCollectOutlined style={{ fontSize: '48px', color: '#30BF78' }} />
                                    <div style={{ marginLeft: '16px' }}>
                                        <div style={{ fontSize: '16px', color: '#8c8c8c' }}>Total</div>
                                        <div style={{ fontSize: '24px'}}>2,781</div>
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
                                        <div style={{ fontSize: '24px'}}>{data?.totalOrders}</div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <ShoppingCartOutlined style={{ fontSize: '48px', color: '#8FC9FB' }} />
                                    <div style={{ marginLeft: '16px' }}>
                                        <div style={{ fontSize: '16px', color: '#8c8c8c' }}>Total Products</div>
                                        <div style={{ fontSize: '24px'}}>2,781</div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                        <Col span={6}>
                            <Card>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <LineChartOutlined style={{ fontSize: '48px', color: '#F69899' }} />
                                    <div style={{ marginLeft: '16px' }}>
                                        <div style={{ fontSize: '16px', color: '#8c8c8c' }}>Total Sale</div>
                                        <div style={{ fontSize: '24px'}}>2,781</div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                    <Row gutter={16} style={{ marginTop: 16 }}>
                        <Col span={16}>
                            <h5>Sale Diamond</h5>
                            <Chart/>
                        </Col>
                        <Col span={8}>
                            <Row gutter={16}>
                                <PieChartComponent/>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </Content>
    );
};

export default Dashboard;
