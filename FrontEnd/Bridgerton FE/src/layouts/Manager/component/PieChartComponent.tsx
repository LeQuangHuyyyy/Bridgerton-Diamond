import React, {useEffect, useState} from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {SpinnerLoading} from "../../Utils/SpinnerLoading";
import PieChartData from "../../../models/PieChartData";

const COLORS = ['#FF8C94', '#FFE29B', '#8AFFB5', '#8AC5FF', '#D18AD6', '#FF8BDA', '#78A1A6'];
const headers = {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJjdXN0b21lckBnbWFpbC5jb20iLCJpZCI6MSwibmFtZSI6IkNVUyIsInJvbGUiOiJDVVNUT01FUiIsInBob25lIjoiMTIzMTIzMTIzMTIiLCJhZGRyZXNzIjoiMjM0LzIzNCAifQ.9R2lECgKGx5pI1euKSGUnBl9ufhGs2YsaG5uhipN6cg'
}
const PieChartComponent = () => {
    const [data, setData] = useState<PieChartData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const baseUrl: string = "https://deploy-be-b176a8ceb318.herokuapp.com/manager/getProductSoldByCate";
            const url: string = `${baseUrl}`;
            const response = await fetch(url, {headers: headers});
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            const responseJson = await response.json();
            const responseData = responseJson.data;
            const loadedDiamond: PieChartData[] = [];
            for (const key in responseData) {
                loadedDiamond.push({
                    name: responseData[key].name,
                    quantity: responseData[key].quantity,
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
            <PieChart style={{backgroundColor: 'white'}}>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="quantity"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default PieChartComponent;
