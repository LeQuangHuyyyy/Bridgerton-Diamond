import React, {useEffect, useState} from 'react';
import {SpinnerLoading} from "../Utils/SpinnerLoading";
import DiamondPriceModel from "../../models/DiamondPriceModel";
import {DiamondElement} from "./components/DiamondElement";

export const DiamondPricePage = () => {

    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': `Bearer ${token}`
    }

    const [diamonds, setDiamonds] = useState<DiamondPriceModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            const url: string = 'http://localhost:8888/manage/diamond-price/get-all';
            const response = await fetch(url, {headers: headers});
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            const responseData = await response.json();

            const loadedDiamond: DiamondPriceModel[] = [];

            for (const key in responseData) {
                loadedDiamond.push({
                    diamondId: responseData[key].diamondId,
                    cut: responseData[key].cut,
                    carat: responseData[key].carat,
                    color: responseData[key].color,
                    clarity: responseData[key].clarity,
                    price: responseData[key].price
                });
            }
            setDiamonds(loadedDiamond);
            setIsLoading(false);
        };
        fetchProducts().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
        window.scrollTo(0, 0);
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
        <div style={{marginTop: '100px'}} className="diamond-price-container">
            <h1 style={{fontSize: '40px'}} className='custom-heading'>Diamond Price List</h1>
            <table style={{paddingTop: '1000px'}} className="diamond-price-table">
                <thead>
                <tr>
                    <th>CUT</th>
                    <th>CARAT</th>
                    <th>COLOR</th>
                    <th>CLARITY</th>
                    <th>PRICE</th>
                </tr>
                </thead>
                <tbody>
                {diamonds.map(diamond => (
                    <DiamondElement key={diamond.diamondId} diamond={diamond}/>
                ))}
                </tbody>
            </table>
        </div>
    );
};
