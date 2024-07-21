import React, {useEffect, useState} from 'react';
import {jwtDecode} from 'jwt-decode';
import {AddPromotion} from './component/AddPromotion';
import {UpdatePromotion} from './component/UpdatePromotion';
import {Table, Button, message} from 'antd';


const headers = localStorage.getItem('token');

interface PromotionData {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    discountPercent: number;
    quantity: number;
    code: string;
    managerId: string;
}

export const Promotion: React.FC = () => {
    const [dataSource, setDataSource] = useState<PromotionData[]>([]);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [formData, setFormData] = useState<PromotionData>({
        id: '',
        name: '',
        startDate: '',
        endDate: '',
        discountPercent: 0,
        quantity: 0,
        code: '',
        managerId: ''
    });

    const toggleAddModal = () => {
        setFormData({
            id: '',
            name: '',
            startDate: '',
            endDate: '',
            discountPercent: 0,
            quantity: 0,
            code: '',
            managerId: ''
        });
        setIsAddingNew(!isAddingNew);
    };

    const toggleUpdateModal = () => {
        setIsUpdating(false);
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    const fetchPromotions = async () => {
        try {
            const response = await fetch('https://deploy-be-b176a8ceb318.herokuapp.com/manage/promotion/get-all', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${headers}`
                },
            });
            if (response.ok) {
                const data = await response.json();
                setDataSource(data || []);
            } else {
                console.error('Failed to fetch promotions');
            }

            if (headers != null) {
                const data = jwtDecode(headers) as {
                    id: string;
                };
                setFormData({...formData, managerId: data.id});
            }
        } catch (error) {
            console.error('Error fetching promotions: ', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('https://deploy-be-b176a8ceb318.herokuapp.com/manage/promotion/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${headers}`
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setIsAddingNew(false);
                fetchPromotions();
            } else {
                console.error('Failed to create promotion');
                message.success('Promotion created successfully');
            }
        } catch (error) {
            console.error('Error creating promotion: ', error);
            message.error('Fail to created promotion');
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('https://deploy-be-b176a8ceb318.herokuapp.com/manage/promotion/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${headers}`
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setIsUpdating(false);
                fetchPromotions();
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

    const handleEdit = (promotionId: string) => {
        const promotionToEdit = dataSource.find(promotion => promotion.id === promotionId);
        if (promotionToEdit) {
            setFormData(promotionToEdit);
            setIsUpdating(true);
            console.log(promotionToEdit)
        }
    };

    const handleDelete = async (promotionId: string) => {
        try {
            const response = await fetch(`https://deploy-be-b176a8ceb318.herokuapp.com/manage/promotion/delete/${promotionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${headers}`
                }
            });
            if (response.ok) {
                fetchPromotions();
            } else {
                console.error('Failed to delete promotion');
            }
        } catch (error) {
            console.error('Error deleting promotion: ', error);
        }
    };

    const columns = [
        {
            title: 'Promotion Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Promotion Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Discount Code',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            key: 'startDate',
            render: (text: string) => text.substring(0, 10),
        },
        {
            title: 'End Date',
            dataIndex: 'endDate',
            key: 'endDate',
            render: (text: string) => text.substring(0, 10),
        },
        {
            title: 'Discount',
            dataIndex: 'discountPercent',
            key: 'discountPercent',
            render: (text: number) => `${text}%`,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'ManagerId',
            dataIndex: 'managerId',
            key: 'managerId',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: PromotionData) => (
                <>
                    <Button onClick={() => handleEdit(record.id)} type="primary" className="me-2">
                        Edit
                    </Button>
                    <Button onClick={() => handleDelete(record.id)}>
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
