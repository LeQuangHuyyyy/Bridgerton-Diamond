import React, {useEffect, useState} from "react";

import {jwtDecode} from "jwt-decode";
import {AddPromotion} from "./AddPromotion"
// import {UpdatePromotion} from './UpdatePromotion'

const headers = localStorage.getItem('token');

interface ManagerData {
    id: string;
    name: string;
    address: string;
    email: string;
    password: string;
    phoneNumber: string;
    role: string;
    status: boolean;
}

interface PromotionData {
    promotionId: string;
    promotionStartDate: string;
    promotionEndDate: string;
    promotionName: string;
    manager: ManagerData;
}

export const Promotion: React.FC = () => {
    const [dataSource, setDataSource] = useState([]);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [manager, setManager] = useState<ManagerData>()
    const [formData, setFormData] = useState<PromotionData>({
        promotionId: '',
        promotionStartDate: '',
        promotionEndDate: '',
        promotionName: '',
        manager: {
            id: '',
            name: '',
            address: '',
            email: '',
            password: '',
            phoneNumber: '',
            role: '',
            status: true
        }
    });


    const toggleAddModal = () => {
            setFormData({
                promotionId: '',
                promotionStartDate: '',
                promotionEndDate: '',
                promotionName: '',
                manager: {
                    id: '',
                    name: '',
                    address: '',
                    email: '',
                    password: '',
                    phoneNumber: '',
                    role: '',
                    status: true
                }
            });
            setIsAddingNew(!isAddingNew);
        }
    ;

    const toggleUpdateModal = () => {
        setIsUpdating(false);
    };

    useEffect(() => {
        async function fetchRole() {
            try {
                const response = await fetch('http://localhost:8888/manage/promotion/get-all', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${headers}`
                    },
                });
                const data = await response.json();
                setDataSource(data || []);
            } catch (error) {
                console.error('Error fetching roles: ', error);
            }

            if (headers !== null) {
                const enCrypt = jwtDecode(headers) as ManagerData
                setManager(enCrypt);
            }
        }

        fetchRole().then(r => fetchRole());
    }, []);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // formData.manager
        const response = await fetch('http://localhost:8888/manage/promotion/create', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${headers}`
            },
            body: JSON.stringify(formData)
        });

        console.log(formData)
        if (response.ok) {
            const response = await fetch('http://localhost:8888/manage/promotion/get-all', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${headers}`
                },
            });
            const data = await response.json();
            setDataSource(data || []);
            setIsAddingNew(false);
        }
    };

    const handleEdit = (userid: string, e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdating(true);

        const accountToEdit = dataSource.find((account: any) => account.userid === userid);

        if (accountToEdit) {
            setFormData(accountToEdit);
        }
    };

    // const handleUpdate = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     let check = true;
    //
    //     try {
    //         const response = await fetch('http://localhost:8888/manage/accounts', {
    //             method: "GET",
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${headers}`
    //             },
    //         });
    //         const result = await response.json();
    //
    //         result.content.some((account: { userid: string; email: string; phoneNumber: string; }) => {
    //             if (account.email === formData.email || account.phoneNumber === formData.phoneNumber) {
    //                 if (account.userid !== formData.userid) {
    //                     alert("Email or PhoneNumber already exists");
    //                     setIsAddingNew(true);
    //                     check = false;
    //                     return true;
    //                 } else {
    //                     return false;
    //                 }
    //             }
    //         });
    //
    //         if (check) {
    //             await fetch(`http://localhost:8888/manage/accounts/${formData.userid}`, {
    //                 method: 'PUT',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `Bearer ${headers}`
    //                 },
    //                 body: JSON.stringify(formData)
    //             });
    //             if (response.ok) {
    //                 setIsUpdating(false);
    //                 const response = await fetch('http://localhost:8888/manage/accounts', {
    //                     method: 'GET',
    //                     headers: {
    //                         'Authorization': `Bearer ${headers}`
    //                     },
    //                 });
    //                 const data = await response.json();
    //                 setDataSource(data.content || []);
    //             }
    //         } else {
    //             alert("Email or PhoneNumber already exists");
    //             setIsUpdating(true);
    //         }
    //     } catch (error) {
    //         console.error("Error during update: ", error);
    //     }
    // };

    const handleDelete = async (promotionId: number, e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch(`http://localhost:8888/manage/promotion/delete/${promotionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${headers}`
                }
            });


            const response = await fetch('http://localhost:8888/manage/promotion/get-all', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${headers}`
                },
            });
            const data = await response.json();
            setDataSource(data || []);
        } catch (error) {
            console.error("Error during delete: ", error);
        }
    };

    return (
        <div className="mb-3 ms-2 me-2 d-flex flex-column gap-3 ">

            <div className="d-flex justify-content-end">
                <div className="">
                    <div className="mb-3 p-4 mt-5 bg-dark text-white"
                         style={{marginLeft: '20px', marginRight: '20px', borderRadius: '20px'}}>
                        <h6 className="text-white" style={{fontSize: '20px', alignItems: 'center'}}>Promotion </h6>
                    </div>
                    <div className="overflow-auto px-0 pt-0 pb-1">
                        <div className="d-flex justify-content-end mb-3">
                            <button onClick={toggleAddModal}
                                    className="new btn text-white mt-3 d-flex justify-content-end"
                                    style={{backgroundColor: "gray", marginRight: '100px'}} type="button">
                                New Promotion
                            </button>
                        </div>
                        <table className="table table-striped">
                            <thead>
                            <tr>
                                {['Promotion Id', "Promotion Name", "Promotion Start Date", "Promotion End Date", "Manager Id", ""].map((el, index) => (
                                    <th key={index} className="border-bottom py-3 px-4 text-left">
                                        {el ? (
                                            <div className="text-uppercase text-dark fw-bold">{el}</div>
                                        ) : null}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {dataSource.map(({
                                                 promotionId,
                                                 promotionName,
                                                 promotionStartDate,
                                                 promotionEndDate,
                                                 managerId
                                             }, key) => {
                                const className = `py-3 px-4 ${key === dataSource.length - 1 ? "" : "border-bottom"}`;
                                return (
                                    <tr key={promotionId}>
                                        <td className={className}>
                                            <div className="d-flex align-items-center gap-3">
                                                <div>
                                                    <div className="fw-bold text-dark">{promotionId}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={className}>
                                            <div className="d-flex align-items-center gap-3">
                                                <div>
                                                    <div className="fw-bold text-dark">{promotionName}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={className}>
                                            <div className="d-flex align-items-center gap-3">
                                                <div>
                                                    <div className="fw-bold text-dark">{promotionStartDate}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={className}>
                                            <div className="d-flex align-items-center gap-3">
                                                <div>
                                                    <div className="fw-bold text-dark">{promotionEndDate}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={className}>
                                            <div className="d-flex align-items-center gap-3">
                                                <div>
                                                    <div className="fw-bold text-dark">{managerId}</div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className={className}>
                                            <div onClick={(e) => handleEdit(promotionId, e)}
                                                 className="btn text-dark fw-bold">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     fill="currentColor" className="bi bi-pen" viewBox="0 0 16 16">
                                                    <path
                                                        d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                                </svg>
                                            </div>
                                            <div onClick={(e) => handleDelete(promotionId, e)}
                                                 className="btn text-dark fw-bold">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     fill="currentColor" className="bi bi-trash"
                                                     viewBox="0 0 16 16">
                                                    <path
                                                        d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                                    <path
                                                        d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                                </svg>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>


                        {/*/!*Create new account*!/*/}
                        {/*<AddPromotion*/}
                        {/*    isOpen={isAddingNew}*/}
                        {/*    onClose={toggleAddModal}*/}
                        {/*    onSubmit={handleSubmit}*/}
                        {/*    formData={formData}*/}
                        {/*    handleChange={handleChange}*/}
                        {/*/>*/}

                        {/*/!*Update account*!/*/}
                        {/*<UpdatePromotion*/}
                        {/*    isOpen={isUpdating}*/}
                        {/*    onClose={toggleUpdateModal}*/}
                        {/*    onSubmit={handleUpdate}*/}
                        {/*    formData={formData}*/}
                        {/*    handleChange={handleChange}*/}
                        {/*/>*/}

                    </div>
                </div>

            </div>
        </div>
    );
};

