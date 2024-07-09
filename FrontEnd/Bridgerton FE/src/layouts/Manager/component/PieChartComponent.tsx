import React, {useEffect} from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Red', value: 400 },
    { name: 'Blue', value: 300 },
    { name: 'Green', value: 300 },
    { name: 'Cyan', value: 200 },
    { name: 'Purple', value: 278 },
    { name: 'Pink', value: 189 },
    { name: 'Light Pink', value: 240 },
];

const COLORS = ['#FFB3BA', '#FFDFBA', '#BAFFC9', '#BAE1FF', '#E0BBE4', '#FFB3E6', '#D4A5A5'];



const PieChartComponent = () => {
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
                    dataKey="value"
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
