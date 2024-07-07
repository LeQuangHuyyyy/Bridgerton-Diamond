import React, {useEffect, useState} from 'react';
import DeliveryOrderList from './DeliveryOrderList';
import FooterMapProps from "../ContactUs/component/FooterMapProps";
import {SpinnerLoading} from "../Utils/SpinnerLoading";

interface DeliveryOrder {
    orderId: string;
    username: string;
    orderDeliveryAddress: string;
    phoneNumber: string;
    orderDate: string;
    status: string;
}

const token = localStorage.getItem('token');
const headers = {
    'Authorization': `Bearer ${token}`
}

const DeliveryStaff: React.FC = () => {
    const [data, setData] = useState<DeliveryOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDelivery();
    }, []);

    const fetchDelivery = async () => {
        try {
            const baseUrl: string = `http://localhost:8888/delivery/ViewOrderDelivery`;
            const response = await fetch(baseUrl, {headers: headers, method: "GET"});
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            const responseJson = await response.json();
            setData(responseJson);
        } catch (err) {
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) {
        return <SpinnerLoading/>;
    }

    const handleUpdateStatus = (id: string) => {
        setData(prevData =>
            prevData.map(order =>
                order.orderId === id ? {...order, status: 'Delivered'} : order
            )
        );
    };

    return (
        <div className="container">
            <FooterMapProps/>
            <DeliveryOrderList
                data={data}
                onViewDetails={(id: string) => console.log('View details for order', id)}
                onUpdateStatus={handleUpdateStatus}
            />
        </div>
    );
};

export default DeliveryStaff;
