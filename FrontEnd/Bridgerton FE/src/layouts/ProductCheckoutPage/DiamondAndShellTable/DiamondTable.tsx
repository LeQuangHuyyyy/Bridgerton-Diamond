import React, { useState, useEffect } from 'react';
import DiamondModel from '../../../models/DiamondModel';
import {SpinnerLoading} from "../../Utils/SpinnerLoading";
import ProductModel from "../../../models/ProductModel";

const headers = {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodXlscXNlMTcxMjkzQGZwdC5lZHUudm4ifQ.FzAs3FrNbICbW9dUGZivmqNtMvUs7dh-fCgJy0EvluQ'
}
const DiamondTable: React.FC<{ product: ProductModel | undefined }> = (props) => {
    const [diamonds, setDiamonds] = useState<DiamondModel>();
    const[isLoading, setIsLoading] = useState(true);
    const[httpError, setHttpError] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    const handleShowDetail = () => {
        setShowDetails(!showDetails);
    };

    useEffect(() => {

        const fetchDiamond = async () => {
            const baseUrl: string =`https://deploy-be-b176a8ceb318.herokuapp.com/manage/diamond/pro/${props.product?.productId}`;
            const  url: string= `${baseUrl}`;
            const response = await fetch(url, {headers: headers});
            if(!response.ok){
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();
            const loadedDiamonds: DiamondModel = {
                    diamondId: responseJson.diamondId,
                    carat: responseJson.carat,
                    price: responseJson.price,
                    cut: responseJson.cut,
                    color: responseJson.color,
                    clarity: responseJson.clarity,
                    certification: responseJson.certification,
                    productId: responseJson.productId,
                    status: responseJson.status
                };
            setDiamonds(loadedDiamonds);
            console.log(loadedDiamonds);
            setIsLoading(false);
        };
        fetchDiamond().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
            console.log(error);
        })
    },[]);

    if(isLoading){
        return (
            <SpinnerLoading/>
        )
    }

    if(httpError){
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }
    return (
        <div style={{width: '200px'}} className="mt-3 mb-3">
            <div className='card-header-none'>
                <button style={{width: '265px'}} className='bg-dark text-white' onClick={handleShowDetail}>
                    Diamond Information
                </button>
            </div>
            {showDetails && (
                <div className='card-body'>
                    <div className="diamond-table">
                        <table>
                            <tbody>
                            <tr>
                                <th>Carat: </th>
                                <td>{diamonds?.carat}</td>
                            </tr>
                            <tr>
                                <th>Price: </th>
                                <td>{diamonds?.price}</td>
                            </tr>
                            <tr>
                                <th>Cut: </th>
                                <td>{diamonds?.cut}</td>
                            </tr>
                            <tr>
                                <th>Color: </th>
                                <td>{diamonds?.color}</td>
                            </tr>
                            <tr>
                                <th>Clarity: </th>
                                <td>{diamonds?.clarity}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiamondTable;
