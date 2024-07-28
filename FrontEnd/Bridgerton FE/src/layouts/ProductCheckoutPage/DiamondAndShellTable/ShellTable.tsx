import React, {useEffect, useState} from 'react';
import {SpinnerLoading} from "../../Utils/SpinnerLoading";
import ProductModel from "../../../models/ProductModel";
import ShellModel from "../../../models/ShellModel";

const ShellTable: React.FC<{ product: ProductModel | undefined }> = (props) => {
    const [shells, setShells] = useState<ShellModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    useEffect(() => {

        const fetchDiamond = async () => {
            const baseUrl: string = `https://deploy-be-b176a8ceb318.herokuapp.com/manage/shell/${props.product?.shellId}`;
            const url: string = `${baseUrl}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();
            const loadedShells: ShellModel = {
                shellId: responseJson.shellId,
                shellName: responseJson.shellName,
                shellPrice: responseJson.shellPrice,
                shellMaterial: responseJson.shellMaterial,
                shellDesign: responseJson.shellDesign,
                shellWeight: responseJson.shellWeight
            };
            setShells(loadedShells);
            console.log(loadedShells);
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
            <h5>Shell Information</h5>
            <div>
                <table style={{width: '100%'}}>
                    <tbody>
                    <tr>
                        <th>Name Shell:</th>
                        <td style={{textAlign: 'right'}}>{shells?.shellName}</td>
                    </tr>
                    <tr>
                        <th>Material:</th>
                        <td style={{textAlign: 'right'}}>{shells?.shellMaterial}</td>
                    </tr>
                    <tr>
                        <th>Design:</th>
                        <td style={{textAlign: 'right'}}>{shells?.shellDesign}</td>
                    </tr>
                    <tr>
                        <th>Weight:</th>
                        <td style={{textAlign: 'right'}}>{shells?.shellWeight}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ShellTable;
