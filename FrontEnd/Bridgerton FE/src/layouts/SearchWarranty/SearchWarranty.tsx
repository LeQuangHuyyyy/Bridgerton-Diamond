import React from 'react';
import {Input, Button} from "antd";
import {SearchWarrantyTable} from "./component/SearchWarrantyTable";

export const SearchWarranty: React.FC = () => {
    return (
        <div style={{backgroundColor: '#E6F4FF', display: 'flex', justifyContent: 'center', textAlign: 'center'}} className='vh-100'>
            <div>
                <h1 className='custom-heading mt-5 mb-3 fs-1'>Get Warranty</h1>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <Input
                        placeholder="Enter your order ID"
                        style={{width: '300px', marginRight: '10px'}}
                    />
                    <Button>Search</Button>
                </div>
                <SearchWarrantyTable/>
            </div>
        </div>
    );
};
