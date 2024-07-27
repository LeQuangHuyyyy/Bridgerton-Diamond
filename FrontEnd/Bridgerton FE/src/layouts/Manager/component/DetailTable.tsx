import {Alert, Button, Calendar, Col, Row, Table} from "antd";
import React, {useEffect, useState} from "react";
import moment from "moment";

interface DetailTableProps {
    date: string;
    totalSale: number;
    totalOrder: number;
    totalItem: number;
}
const token = localStorage.getItem('token')
const headers = {
    'Authorization': `Bearer ${token}`
}
export const DetailTable = () => {
    const [selectedDate, setSelectedDate] = useState<string | null>(moment().format('YYYY-MM-DD'));
    const [dataSource, setDataSource] = useState<DetailTableProps[]>([]);
    const [httpError, setHttpError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const baseUrl: string = "https://deploy-be-b176a8ceb318.herokuapp.com/manager/statisticBeforeThisWeek";
            const url: string = `${baseUrl}`;
            const response = await fetch(url, {headers: headers});
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            const responseJson = await response.json();
            const responseData = responseJson.data;
            const loadedData: DetailTableProps[] = [];
            for (const key in responseData) {
                loadedData.push({
                    date: responseData[key].date,
                    totalSale: responseData[key].totalSale,
                    totalOrder: responseData[key].totalOrder,
                    totalItem: responseData[key].totalItem
                });
            }
            setDataSource(loadedData);
        };
        fetchData().catch((error: any) => {
            setHttpError(error.message);
            console.log(error);
        })
    }, []);

    if (httpError) {
        return (
            <div className="container">
                <Alert message="Error" description={httpError} type="error" showIcon/>
            </div>
        );
    }

    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            className: 'text-center'
        },
        {
            title: 'Total Sale',
            dataIndex: 'totalSale',
            key: 'totalSale',
            className: 'text-center',
            render: (text: number) => (
                <span style={{fontWeight: 'bolder'}}>${text.toLocaleString()}</span>
            ),
        },
        {
            title: 'Total Orders',
            dataIndex: 'totalOrder',
            key: 'totalOrder',
            className: 'text-center'
        },
        {
            title: 'Total Items Sold',
            dataIndex: 'totalItem',
            key: 'totalItem',
            className: 'text-center'
        },
    ];

    const onSelect = (date: any) => {
        setSelectedDate(date.format('YYYY-MM-DD'));
    }
    const filteredDate = selectedDate ? dataSource.filter(item => item.date === selectedDate) : dataSource;

    const getAll = () => {
        setSelectedDate(null);
    }
    return (
        <>
            <Row gutter={16}>
                <Col span={15}>
                    <Table
                        columns={columns}
                        dataSource={filteredDate}
                    />
                </Col>
                <Col span={9}>
                    <div style={{
                        width: '100%',
                        borderRadius: 2,
                    }}>
                        <Calendar fullscreen={false} onSelect={onSelect}/>
                        <Button onClick={getAll} className='btn-outline-info' style={{marginTop: 20}}>Get All</Button>
                    </div>
                </Col>
            </Row>
        </>
    );
};
