import React, {useEffect, useState} from 'react';
import {AddPromotion} from './component/AddPromotion';
import {UpdatePromotion} from './component/UpdatePromotion';
import {Button, message, Spin, Table} from 'antd';
import PromotionModel from "../../models/PromotionModel";
import moment from 'moment';


const token = localStorage.getItem('token');
const headers = {
    'Authorization': `Bearer ${token}`
}

export const Promotion: React.FC = () => {
    const [dataSource, setDataSource] = useState<PromotionModel[]>([]);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [formData, setFormData] = useState<PromotionModel>(new PromotionModel(0, '', '', '', '', 0, 0));

    const toggleAddModal = () => {
        setFormData(new PromotionModel(0, '', '', '', '', 0, 0));
        setIsAddingNew(!isAddingNew);
    };

    const toggleUpdateModal = () => {
        setIsUpdating(false);
    };

    useEffect(() => {
        const fetchPromotions = async () => {
            const baseUrl: string = "https://deploy-be-b176a8ceb318.herokuapp.com/manage/discountcode/get-all";
            const url: string = `${baseUrl}`;
            const response = await fetch(url, {headers: headers});
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            const responseJson = await response.json();
            const responseData = responseJson;
            console.log(responseData);
            const loadedPromotions: PromotionModel[] = [];
            for (const key in responseData) {
                loadedPromotions.push({
                    codeId: responseData[key].codeId,
                    code: responseData[key].code,
                    name: responseData[key].name,
                    startDate: responseData[key].startDate,
                    endDate: responseData[key].endDate,
                    discountPercentTage: responseData[key].discountPercentTage,
                    codeQuantity: responseData[key].codeQuantity,
                });
            }
            setDataSource(loadedPromotions);
            setIsLoading(false);
        };
        fetchPromotions().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
            console.log(error);
        })
    }, [isUpdating]);


    if (isLoading) {
        return (
            <Spin/>
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('https://deploy-be-b176a8ceb318.herokuapp.com/manage/discountcode/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setIsUpdating(!isUpdating);
                message.success("Create New Promotion successfully")
                toggleAddModal();
            } else {
                console.error('Failed to create promotion');
                message.error('Promotion created fail');
            }
        } catch (error) {
            console.error('Error creating promotion: ', error);
            message.error('Fail to created promotion');
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('https://deploy-be-b176a8ceb318.herokuapp.com/manage/discountcode/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setIsUpdating(!isUpdating);
                message.success('Promotion updated successfully');
            } else {
                console.error('Failed to update promotion');
                message.error('Failed to update promotion');
            }
        } catch (error) {
            console.error('Error updating promotion: ', error);
            message.error('Failed to update promotion');
        }
    };

    const handleEdit = (promotionId: number) => {
        const promotionToEdit = dataSource.filter(promotion => promotion.codeId === promotionId);
        if (promotionToEdit) {
            setFormData(promotionToEdit[0]);
            setIsUpdating(true);
            console.log(formData)
        }
    };

    const handleDelete = async (promotionId: number) => {
        try {
            const response = await fetch(`https://deploy-be-b176a8ceb318.herokuapp.com/manage/discountcode/delete/${promotionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                setIsUpdating(!isUpdating);
                message.success('Promotion deleted successfully');
            } else {
                console.error('Failed to delete promotion');
                message.error('Failed to delete promotion');
            }
        } catch (error) {
            console.error('Error deleting promotion: ', error);
        }
    };

    const columns = [
        {
            title: 'Code ID',
            dataIndex: 'codeId',
            key: 'codeId',
            className: 'text-center'
        },
        {
            title: 'Code Name',
            dataIndex: 'name',
            key: 'name',
            className: 'text-center'
        },
        {
            title: 'Discount Code',
            dataIndex: 'code',
            key: 'code',
            className: 'text-center'

        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            className: 'text-center',
            render: (text: string) => moment(text).format('DD/MM/YYYY'),
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            className: 'text-center',
            render: (text: string) => moment(text).format('DD/MM/YYYY'),
        },
        {
            title: 'Percent',
            dataIndex: 'discountPercentTage',
            key: 'discountPercentTage',
            className: 'text-center',
            render: (text: number) => `${text}%`,
        },
        {
            title: 'Quantity',
            dataIndex: 'codeQuantity',
            key: 'codeQuantity',
            className: 'text-center',
        },
        {
            title: 'Actions',
            key: 'actions',
            className: 'text-center',
            render: (record: PromotionModel) => (
                <>
                    <Button onClick={() => handleEdit(record.codeId)} type="primary" className="me-2">
                        Edit
                    </Button>
                    <Button onClick={() => handleDelete(record.codeId)}>
                        Delete
                    </Button>
                </>
            ),
        },

    ];

    return (
        <div className="container mt-5">
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <h2 className="text-dark">Promotions</h2>
                <Button onClick={toggleAddModal} type="primary">
                    New Promotion
                </Button>
            </div>
            <Table dataSource={dataSource} columns={columns} rowKey="promotionId"/>
            <AddPromotion
                isOpen={isAddingNew}
                onClose={toggleAddModal}
                onSubmit={handleSubmit}
                formData={formData}
                handleChange={handleChange}
            />
            <UpdatePromotion
                isOpen={isUpdating}
                onClose={toggleUpdateModal}
                onSubmit={handleUpdate}
                formData={formData}
                handleChange={handleChange}
            />
        </div>
    );
};
