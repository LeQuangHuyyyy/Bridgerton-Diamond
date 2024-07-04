import React, {useEffect, useState} from 'react';
import {jwtDecode} from "jwt-decode";
import {AddDiamond} from "./component/AddDiamond";
import {UpdateDiamond} from "./component/UpdateDiamond";

const headers = localStorage.getItem('token');

interface DiamondData {
    diamondId: string;
    carat: string;
    price: string;
    cut: string;
    color: string;
    clarity: string;
    certification: string;
    status: boolean;
}

export const Diamond: React.FC = () => {
    const [dataSource, setDataSource] = useState<DiamondData[]>([]);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [formData, setFormData] = useState<DiamondData>({
        diamondId: '',
        carat: '',
        price: '',
        cut: '',
        color: '',
        clarity: '',
        certification: '',
        status: true
    });

    const toggleAddModal = () => {
        setFormData({
            diamondId: '',
            carat: '',
            price: '',
            cut: '',
            color: '',
            clarity: '',
            certification: '',
            status: true
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
            const response = await fetch('http://localhost:8888/manage/diamond/get-all', {
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

        } catch (error) {
            console.error('Error fetching promotions: ', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8888/manage/diamond/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${headers}`
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setIsAddingNew(false);
                fetchPromotions()
            } else {
                console.error('Failed to create diamond');
            }
        } catch (error) {
            console.error('Error creating diamond: ', error);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8888/manage/diamond/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${headers}`
                },
                body: JSON.stringify(formData)
            });
            console.log(formData)

            if (response.ok) {
                setIsUpdating(false);
                fetchPromotions();
            } else {
                console.error('Failed to update diamond');
            }
        } catch (error) {
            console.error('Error update diamond: ', error);
        }
    };


    const handleEdit = (diamondId: string) => {
        const promotionToEdit = dataSource.find(diamond => diamond.diamondId === diamondId);
        if (promotionToEdit) {
            setFormData(promotionToEdit);
            setIsUpdating(true);
        }
    };

    const handleDelete = async (e: React.FormEvent, diamondId: string) => {
        e.preventDefault();
        console.log(diamondId)
        try {
            const response = await fetch(`http://localhost:8888/manage/diamond/delete/${diamondId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${headers}`
                }
            });
            if (response.ok) {
                fetchPromotions();
            } else {
                console.error('Failed to delete diamond');
            }
        } catch (error) {
            console.error('Error deleting diamond: ', error);
        }
    };

    return (
        <div className="container mt-5">
            <div className="mb-4 d-flex justify-content-between align-items-center">
                <h2 className="text-dark">Diamond</h2>
                <button onClick={() => setIsAddingNew(true)} className="btn btn-primary">
                    New Diamond
                </button>
            </div>

            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>Carat</th>
                        <th>Cut</th>
                        <th>Clarity</th>
                        <th>Color</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {dataSource.map((diamond) => (
                        <tr key={diamond.diamondId}>
                            <td>{diamond.carat}</td>
                            <td>{diamond.cut}</td>
                            <td>{diamond.clarity}</td>
                            <td>{diamond.color}</td>
                            <td>{diamond.price} $</td>
                            <td>
                                <span className={`badge bg-${diamond.status ? "" : "dark"}`}>
                                  {diamond.status ? "" : "Suspended"}
                                </span>
                            </td>

                            <td>
                                <button onClick={() => handleEdit(diamond.diamondId)}
                                        className="btn me-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                         fill="currentColor" className="bi bi-pen" viewBox="0 0 16 16">
                                        <path
                                            d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                    </svg>
                                </button>
                                {/*<button onClick={(e) => handleDelete(e, diamond.diamondId)}*/}
                                {/*        className="btn">*/}
                                {/*    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"*/}
                                {/*         fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">*/}
                                {/*        <path*/}
                                {/*            d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>*/}
                                {/*        <path*/}
                                {/*            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>*/}
                                {/*    </svg>*/}
                                {/*</button>*/}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <AddDiamond
                    isOpen={isAddingNew}
                    onClose={toggleAddModal}
                    onSubmit={handleSubmit}
                    formData={formData}
                    handleChange={handleChange}
                />
                <UpdateDiamond
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

