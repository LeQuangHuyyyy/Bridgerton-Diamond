import React, {useEffect, useState} from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ChartData from "../../../models/ChartData";
import {SpinnerLoading} from "../../Utils/SpinnerLoading";

const headers = {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodXlscXNlMTcxMjkzQGZwdC5lZHUudm4ifQ.FzAs3FrNbICbW9dUGZivmqNtMvUs7dh-fCgJy0EvluQ'
}
const Chart = () => {
    const [data, setData] = useState<ChartData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            const baseUrl: string = "https://deploy-be-b176a8ceb318.herokuapp.com/manager/getDiamondSold";
            const url: string = `${baseUrl}`;
            const response = await fetch(url, { headers: headers });
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            const responseJson = await response.json();
            const responseData = responseJson.data;
            const loadedDiamond: ChartData[] = [];
            for (const key in responseData) {
                loadedDiamond.push({
                    date: responseData[key].date,
                    Round: responseData[key].round,
                    Oval: responseData[key].oval,
                    Heart: responseData[key].heart,
                });
            }
            setData(loadedDiamond);
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
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} style={{backgroundColor: 'white'}}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Round" stroke="#F7A3A5" strokeWidth={3} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Oval" stroke="#78ED9F" strokeWidth={3} />
                <Line type="monotone" dataKey="Heart" stroke="#D797EB" strokeWidth={3} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default Chart;
