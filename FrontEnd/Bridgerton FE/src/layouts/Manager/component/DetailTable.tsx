import {Calendar, Col, Row, Table} from "antd";
import React, {useState} from "react";
import moment from "moment";

export const DetailTable = () => {
    const [selectedDate, setSelectedDate] = useState<string>(moment().format('YYYY-MM-DD'));
    const [dataSource, setDataSource] = useState([
        {
            key: '1',
            date: '2024-07-20',
            totalSale: 1000,
            totalOrder: 10,
            totaltItemsSold: 50,
        },
        {
            key: '2',
            date: '2024-07-21',
            totalSale: 1500,
            totalOrder: 15,
            totaltItemsSold: 75,
        },
        {
            key: '3',
            date: '2024-07-22',
            totalSale: 2000,
            totalOrder: 20,
            totaltItemsSold: 100,
        },
        {
            key: '4',
            date: '2024-07-23',
            totalSale: 2500,
            totalOrder: 25,
            totaltItemsSold: 125,
        },
        {
            key: '5',
            date: '2024-07-24',
            totalSale: 3000,
            totalOrder: 30,
            totaltItemsSold: 150,
        },
        {
            key: '6',
            date: '2024-07-25',
            totalSale: 3500,
            totalOrder: 35,
            totaltItemsSold: 175,
        },
        {
            key: '7',
            date: '2024-07-26',
            totalSale: 4000,
            totalOrder: 40,
            totaltItemsSold: 200,
        },
    ]);

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
        },
        {
            title: 'Total Orders',
            dataIndex: 'totalOrder',
            key: 'totalOrder',
            className: 'text-center'
        },
        {
            title: 'Total Items Sold',
            dataIndex: 'totaltItemsSold',
            key: 'totaltItemsSold',
            className: 'text-center'
        },
    ];

    const onSelect = (date: any) => {
        setSelectedDate(date.format('YYYY-MM-DD'));
        console.log(selectedDate)
    }
    const filteredDate = dataSource.filter(item => item.date === selectedDate);

    return (
        <>
            <Row gutter={16}>
                <Col span={15}>
                    <Table
                        columns={columns}
                        dataSource={filteredDate.length > 0 ? filteredDate : dataSource}
                    />
                </Col>
                <Col span={9}>
                    <div style={{
                        width: '100%',
                        borderRadius: 2,
                    }}>
                        <Calendar fullscreen={false} onSelect={onSelect} />
                    </div>
                </Col>
            </Row>
        </>
    );
};
