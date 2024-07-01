import React, {useEffect, useState} from 'react';
import {jwtDecode} from "jwt-decode";
import {AddPromotion} from "./component/AddPromotion";
import {UpdatePromotion} from './component/UpdatePromotion'

const headers = localStorage.getItem('token');

interface PromotionData {
    promotionId: string;
    promotionStartDate: string;
    promotionEndDate: string;
    promotionName: string;
    managerId: string;
}

export const Promotion: React.FC = () => {
    const [dataSource, setDataSource] = useState<PromotionData[]>([]);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [formData, setFormData] = useState<PromotionData>({
        promotionId: '',
        promotionStartDate: '',
        promotionEndDate: '',
        promotionName: '',
        managerId: '',
    });

    const toggleAddModal = () => {
        setFormData({
            promotionId: '',
            promotionStartDate: '',
            promotionEndDate: '',
            promotionName: '',
            managerId: '',
        });
        setIsAddingNew(!isAddingNew);
    }

    const toggleUpdateModal = () => {
        setIsUpdating(false);
    };


    useEffect(() => {
        fetchPromotions();
    }, []);


    const fetchPromotions = async () => {
        try {
            const response = await fetch('http://localhost:8888/manage/promotion/get-all', {
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
                    id: string
                }
                setFormData({...formData, managerId: data.id})
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
            const response = await fetch('http://localhost:8888/manage/promotion/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${headers}`
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setIsAddingNew(false);
            } else {
                console.error('Failed to create promotion');
            }
        } catch (error) {
            console.error('Error creating promotion: ', error);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8888/manage/promotion/update ', {
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
            } else {
                console.error('Failed to update promotion');
            }
        } catch (error) {
            console.error('Error update promotion: ', error);
        }
    };


    const handleEdit = (promotionId: string) => {
        const promotionToEdit = dataSource.find(promotion => promotion.promotionId === promotionId);
        if (promotionToEdit) {
            setFormData(promotionToEdit);
            setIsUpdating(true);
        }
    };

    const handleDelete = async (promotionId: string) => {
        try {
            const response = await fetch(`http://localhost:8888/manage/promotion/delete/${promotionId}`, {
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

    return (
        <div className="container mt-5">
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <h2 className="text-dark">Promotions</h2>
                <button onClick={() => setIsAddingNew(true)} className="btn btn-primary">
                    New Promotion
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>Promotion Id</th>
                        <th>Promotion Name</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {dataSource.map((promotion) => (
                        <tr key={promotion.promotionId}>
                            <td>{promotion.promotionId}</td>
                            <td>{promotion.promotionName}</td>
                            <td>{promotion.promotionStartDate.substring(0, 10)}</td>
                            <td>{promotion.promotionEndDate.substring(0, 10)}</td>
                            <td>
                                <button onClick={() => handleEdit(promotion.promotionId)}
                                        className="btn btn-sm btn-primary me-2">
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(promotion.promotionId)}
                                        className="btn btn-sm btn-danger">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
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
        </div>
    );
};

