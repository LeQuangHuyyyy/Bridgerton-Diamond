import React, { useState, useEffect } from 'react';
import {SpinnerLoading} from "../../Utils/SpinnerLoading";
import ProductModel from "../../../models/ProductModel";
import ShellModel from "../../../models/ShellModel";

const headers = {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodXlscXNlMTcxMjkzQGZwdC5lZHUudm4ifQ.FzAs3FrNbICbW9dUGZivmqNtMvUs7dh-fCgJy0EvluQ'
}
const ShellTable: React.FC<{ product: ProductModel | undefined }> = (props) => {
    const [shells, setShells] = useState<ShellModel>();
    const[isLoading, setIsLoading] = useState(true);
    const[httpError, setHttpError] = useState(null);
    const [showDetails, setShowDetails] = useState(false);

    const handleShowDetail = () => {
        setShowDetails(!showDetails);
    };

    useEffect(() => {

        const fetchDiamond = async () => {
            const baseUrl: string =`http://localhost:8888/manage/shell/${props.product?.shellId}`;
            const  url: string= `${baseUrl}`;
            const response = await fetch(url, {headers: headers});
            if(!response.ok){
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
        <div style={{width: '300px'}} className="mt-3 mb-3">
            <div className='card-header-none'>
                <button style={{width: '265px'}} className='bg-dark text-white' onClick={handleShowDetail}>
                    Shell Information
                </button>
            </div>
            {showDetails && (
                <div className='card-body'>
                    <div className="diamond-table">
                        <table>
                            <tbody>
                            <tr>
                                <th>Name Shell: </th>
                                <td>{shells?.shellName}</td>
                            </tr>
                            <tr>
                                <th>Material: </th>
                                <td>{shells?.shellMaterial}</td>
                            </tr>
                            <tr>
                                <th>Design: </th>
                                <td>{shells?.shellDesign}</td>
                            </tr>
                            <tr>
                                <th>Weight: </th>
                                <td>{shells?.shellWeight}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShellTable;
