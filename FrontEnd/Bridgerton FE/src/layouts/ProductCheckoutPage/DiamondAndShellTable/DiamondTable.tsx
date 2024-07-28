import React, {useEffect, useState} from 'react';
import DiamondModel from '../../../models/DiamondModel';
import {SpinnerLoading} from "../../Utils/SpinnerLoading";
import ProductModel from "../../../models/ProductModel";

const DiamondTable: React.FC<{ product: ProductModel | undefined }> = (props) => {
    const [diamonds, setDiamonds] = useState<DiamondModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    useEffect(() => {

        const fetchDiamond = async () => {
            const baseUrl: string = `https://deploy-be-b176a8ceb318.herokuapp.com/manage/diamond/pro/${props.product?.productId}`;
            const url: string = `${baseUrl}`;
            const response = await fetch(url);
            if (!response.ok) {
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
        <div className="mt-3 mb-3">
            <h5>Diamond Information</h5>
            <div>
                <table style={{width: '100%'}}>
                    <tbody>
                    <tr>
                        <th>Carat:</th>
                        <td style={{textAlign: 'right'}}>{diamonds?.carat}</td>
                    </tr>
                    <tr>
                        <th>Price:</th>
                        <td style={{textAlign: 'right'}}>{diamonds?.price}</td>
                    </tr>
                    <tr>
                        <th>Cut:</th>
                        <td style={{textAlign: 'right'}}>{diamonds?.cut}</td>
                    </tr>
                    <tr>
                        <th>Color:</th>
                        <td style={{textAlign: 'right'}}>{diamonds?.color}</td>
                    </tr>
                    <tr>
                        <th>Clarity:</th>
                        <td style={{textAlign: 'right'}}>{diamonds?.clarity}</td>
                    </tr>
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default DiamondTable;
