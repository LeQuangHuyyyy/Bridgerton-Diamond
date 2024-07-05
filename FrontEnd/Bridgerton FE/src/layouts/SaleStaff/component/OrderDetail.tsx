import React, {useEffect, useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import OrderModel from "../../../models/OrderModel";
import OrderDetailModel from "../../../models/OrderDetailModel";
import {SpinnerLoading} from "../../Utils/SpinnerLoading";

const headers = {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodXlscXNlMTcxMjkzQGZwdC5lZHUudm4ifQ.FzAs3FrNbICbW9dUGZivmqNtMvUs7dh-fCgJy0EvluQ'
}

const OrderDetail: React.FC<{ detail: OrderModel | undefined }> = (props) => {
    const [details, setDetails] = useState<OrderDetailModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            const baseUrl: string = `http://localhost:8888/order/OrdersData/${props.detail?.orderId}`;
            const url: string = `${baseUrl}`;
            const response = await fetch(url, {headers: headers});
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();
            const loadedDetail: OrderDetailModel = {
                orderId: responseJson.orderId,
                productId: responseJson.productId,
                quantity: responseJson.quantity,
                price: responseJson.price,
                size: responseJson.size
            };
            setDetails(loadedDetail);
            console.log(loadedDetail);
            setIsLoading(false);
        };
        fetchDetail().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
            console.log(error);
        });
    }, []);

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    if (isLoading) {
        return (
            <SpinnerLoading/>
        )
    }
    return (
        <div>
            <p>Order ID: {props.detail?.orderId}</p>
            <p>Product ID: {details?.productId}</p>
            <p>Quantity: {details?.quantity}</p>
            <p>Price: {details?.price}</p>
            <p>Size: {details?.size}</p>
        </div>
    );
};

export default OrderDetail;
