import React, {useEffect, useState} from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import DiamondSold from "../../../models/DiamondSold";
import OrderModel from "../../../models/OrderModel";

const data = [
    { year: 2010, Food: 420, Clothes: 470, Electronics: 430 },
    { year: 2011, Food: 430, Clothes: 460, Electronics: 420 },
    { year: 2012, Food: 440, Clothes: 450, Electronics: 430 },
    { year: 2013, Food: 450, Clothes: 460, Electronics: 450 },
    { year: 2014, Food: 460, Clothes: 430, Electronics: 470 },
    { year: 2015, Food: 470, Clothes: 440, Electronics: 490 },
];
// const headers = {
//     'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodXlscXNlMTcxMjkzQGZwdC5lZHUudm4ifQ.FzAs3FrNbICbW9dUGZivmqNtMvUs7dh-fCgJy0EvluQ'
// }
const Chart = () => {
    // const [data, setData] = useState<DiamondSold>([]);
    // useEffect(() => {
    //     const fetchData = async () => {
    //         const baseUrl: string = "https://deploy-be-b176a8ceb318.herokuapp.com/manage/getDiamondSold";
    //         const url: string = `${baseUrl}`;
    //         const response = await fetch(url, { headers: headers });
    //         if (!response.ok) {
    //             throw new Error('Something went wrong!');
    //         }
    //         const responseJson = await response.json();
    //         const responseData = responseJson.content;
    //         const loadedDiamond: DiamondSold[] = [];
    //         for (const key in responseData) {
    //             loadedOrders.push({
    //
    //             });
    //         }
    //     }
    // }, []);
    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} style={{backgroundColor: 'white'}}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Food" stroke="#F7A3A5" strokeWidth={3} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Clothes" stroke="#78ED9F" strokeWidth={3} />
                <Line type="monotone" dataKey="Electronics" stroke="#D797EB" strokeWidth={3} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default Chart;
