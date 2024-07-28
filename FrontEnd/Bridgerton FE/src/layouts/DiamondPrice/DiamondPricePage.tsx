import React, {useEffect, useState} from 'react';
import {SpinnerLoading} from "../Utils/SpinnerLoading";
import DiamondPriceModel from "../../models/DiamondPriceModel";
import {DiamondElement} from "./components/DiamondElement";

export const DiamondPricePage = () => {

    const [diamonds, setDiamonds] = useState<DiamondPriceModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            const url = 'https://deploy-be-b176a8ceb318.herokuapp.com/manage/diamond-price/get-all';
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Something went wrong!');
                }
                const responseData = await response.json();
                const loadedDiamond = [];

                for (const key in responseData.content) {
                    loadedDiamond.push({
                        diamondId: responseData.content[key].diamondId,
                        cut: responseData.content[key].cut,
                        carat: responseData.content[key].carat,
                        color: responseData.content[key].color,
                        clarity: responseData.content[key].clarity,
                        price: responseData.content[key].price
                    });
                }
                setDiamonds(loadedDiamond);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
            }
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
