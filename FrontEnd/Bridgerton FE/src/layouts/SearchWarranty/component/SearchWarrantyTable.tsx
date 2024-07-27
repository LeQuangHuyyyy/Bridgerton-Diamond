import React from 'react';
import {Table, Button} from "antd";
import {EyeOutlined} from "@ant-design/icons";
export const SearchWarrantyTable = () => {
    const dataSource = [
        {
            key: '1',
            warrantyID: 'W123456',
            orderID: '123456',
            productName: 'Product A',
            warranty: '1 year',
            status: 'Active',
            date: '2021-07-19',
        },
        {
            key: '2',
            warrantyID: 'W123457',
            orderID: '123457',
            productName: 'Product B',
            warranty: '2 year',
            status: 'Expired',
            date: '2021-07-19',
        },
    ];
    const columns = [
        {
            title: 'Warranty ID',
            dataIndex: 'warrantyID',
            key: 'warrantyID',
        },
        {
            title: 'Order ID',
            dataIndex: 'orderID',
            key: 'orderID',
        },
        {
            title: 'Product Name',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Action',
            key: 'action',
            render: () => (
                <Button><EyeOutlined/></Button>
            ),
        },
    ];
    return (
        <div style={{marginTop: 20}}>
            <Table dataSource={dataSource} columns={columns}/>
        </div>
    );
};
