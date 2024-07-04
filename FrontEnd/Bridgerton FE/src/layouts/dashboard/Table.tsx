import React, {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import AddAccount from "./AddAccount";
import UpdateAccount from "./UpdateAccount";

const headers = localStorage.getItem('token');


interface UserData {
    userid: string;
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
    address: string;
    role: string;
    status: string;
}

export const Table: React.FC = () => {
    const [dataSource, setDataSource] = useState([]);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedRole, setSelectedRole] = useState('All Role');
    const [formData, setFormData] = useState<UserData>({
        userid: '', name: '', email: '', password: '', phoneNumber: '', address: '', role: '', status: ''
    });
    const [userName, setUserName] = useState('')

    const toggleAddModal = () => {
        setFormData({
            userid: '', name: '', email: '', password: '', phoneNumber: '', address: '', role: '', status: ''
        });
        setIsAddingNew(!isAddingNew);
    };

    const toggleUpdateModal = () => {
        setIsUpdating(false);
    };

    useEffect(() => {
         fetchRole();
    }, []);

    const fetchRole = async () => {
        try {
            if (headers) {
                const enCrypt = jwtDecode(headers) as { role: string; name: string; };
                setUserName(enCrypt.name);
                if (enCrypt.role.toUpperCase() !== 'ADMIN') {
                    window.location.href = '/';
                    return;
                }else{
                    setUserName(enCrypt.name)
                }
            } else {
                window.location.href = '/';
                return;
            }

            const response = await fetch('http://localhost:8888/manage/accounts', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${headers}`
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setDataSource(data.content || []);
        } catch (error) {
            console.error('Error fetching roles: ', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8888/manage/accounts', {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${headers}`
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch accounts data');
            }
            const result = await response.json();

            const isDuplicate = result.content.some((account: any) => {
                return account.email === formData.email || account.phoneNumber === formData.phoneNumber;
            });

            if (isDuplicate) {
                alert("Email or PhoneNumber already exists");
                setIsAddingNew(true);
                return;
            }

            if (formData.status === "") {
                formData.status = "true";
            }

            const postResponse = await fetch('http://localhost:8888/manage/accounts', {
                method: "POST",
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${headers}`
                }
            });

            if (postResponse.ok) {
                fetchRole();
                setIsAddingNew(false);
            } else {
                throw new Error('Failed to add new account');
            }
        } catch (error) {
            console.error('Error handling submit: ', error);
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

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        let check = true;

        try {
            const response = await fetch('http://localhost:8888/manage/accounts', {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${headers}`
                },
            });
            
            const result = await response.json();

            result.content.some((account: { userid: string; email: string; phoneNumber: string; }) => {
                if (account.email === formData.email || account.phoneNumber === formData.phoneNumber) {
                    if (account.userid !== formData.userid) {
                        alert("Email or PhoneNumber already exists");
                        setIsAddingNew(true);
                        check = false;
                        return true;
                    } else {
                        return false;
                    }
                }
            });

            if (check) {
                await fetch(`http://localhost:8888/manage/accounts/${formData.userid}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${headers}`
                    },
                    body: JSON.stringify(formData)
                });
                if (response.ok) {
                    fetchRole();
                    setIsUpdating(false);
                }
            } else {
                alert("Email or PhoneNumber already exists");
                setIsUpdating(true);
            }
        } catch (error) {
            console.error("Error during update: ", error);
        }
    };

    const handleDelete = async (userid: string, e: React.FormEvent) => {
        e.preventDefault();
        try {
            await fetch(`http://localhost:8888/manage/accounts/${userid}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${headers}`
                }
            });

           fetchRole();
        } catch (error) {
            console.error("Error during delete: ", error);
        }
    };

    const search = async (input: string, e: React.FormEvent) => {
        e.preventDefault();
        console.log(input)
        if (input === "") {
            const response = await fetch('http://localhost:8888/manage/accounts', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${headers}`
                }
            });
            const data = await response.json();
            setDataSource(data.content || []);
        } else {
            const response = await fetch(`http://localhost:8888/manage/searchAccount?keyword=${input}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${headers}`
                },
            });
            const data = await response.json();
            setDataSource(data || []);
        }
    };

    const searchRoleHandleChange = async (value: string) => {
        try {
            setSelectedRole(value);
            const response = await fetch('http://localhost:8888/manage/accounts', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${headers}`
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            let filteredData = data.content || [];

            if (value.toLowerCase() !== 'all role') {
                filteredData = data.content.filter((role: any) => role.role.toLowerCase() === value.toLowerCase());
            }
            setDataSource(filteredData);
        } catch (error) {
            console.error('Error searching admin: ', error);
        }
    };


    const logOut = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    return (
        <div className=" mb-3 ms-2 me-2 d-flex flex-column gap-3">
            {/*<div className="d-flex justify-content-between ">*/}
            {/*    <div>*/}
            {/*        <p>Hello {userName}</p>*/}
            {/*    </div>*/}
            {/*    <button onClick={logOut}>*/}
            {/*        log out*/}
            {/*    </button>*/}
            {/*</div>*/}
            <div>
                <div className="mb-3 p-4 mt-5 bg-dark text-white d-flex justify-content-between"
                     style={{marginLeft: '20px', marginRight: '20px', borderRadius: '20px'}}>
                    <h6 className="text-white" style={{fontSize: '20px', alignItems: 'center'}}>Account Table</h6>

                    <div className="d-flex align-items-center w-25 justify-content-around">
                        <div>
                            <p className="m-0">Hello {userName}</p>
                        </div>
                        <button onClick={logOut} className="p-2 rounded-3">
                            Log Out
                        </button>
                    </div>
                </div>
                <div className="overflow-auto px-0 pt-0 pb-1">
                    <form className="mx-auto ms-3 w-100 max-w-lg">
                        <div className="d-flex justify-content-start w-25">
                            <label htmlFor="search-dropdown"
                                   className="mb-3 d-none ">
                                Your Email
                            </label>
                            <button
                                id="dropdown-button"
                                data-bs-toggle="dropdown"
                                className=" d-flex  ms-2 rounded-3 text-bg-light border-1 "
                                style={{
                                    height: '40px',
                                    marginRight: '15px',
                                    outline: 'none',
                                    width: '150px',
                                    justifyContent: "center",
                                    alignItems: 'center'
                                }}
                                type="button"
                            >
                                {selectedRole}
                            </button>
                            <div id="dropdown" className="dropdown-menu" style={{width: '200px'}}>
                                <ul className="role">
                                    <li onClick={() => searchRoleHandleChange('ADMIN')}>
                                        <button id="dropdown-button" type="button"
                                                className="btn text-start" value="ADMIN"
                                        >
                                            Admin
                                        </button>
                                    </li>
                                    <li onClick={() => searchRoleHandleChange('DELIVERY_STAFF')}>
                                        <button id="dropdown-button" type="button"
                                                className="btn text-start" value="DELIVERY_STAFF"
                                        >
                                            Delivery Staff
                                        </button>
                                    </li>
                                    <li onClick={() => searchRoleHandleChange('SALE_STAFF')}>
                                        <button id="dropdown-button" type="button"
                                                className="btn text-start" value="SALE_STAFF"
                                        >
                                            Sale Staff
                                        </button>
                                    </li>
                                    <li onClick={() => searchRoleHandleChange('CUSTOMER')}>
                                        <button id="dropdown-button" type="button"
                                                className="btn text-start" value="CUSTOMER">
                                            Customer
                                        </button>
                                    </li>
                                    <li onClick={() => searchRoleHandleChange('MANAGER')}>
                                        <button id="dropdown-button" type="button"
                                                className="btn text-start" value="MANAGER">
                                            Manager
                                        </button>
                                    </li>

                                    <li onClick={() => searchRoleHandleChange('All Role')}>
                                        <button id="dropdown-button" type="button"
                                                className="btn text-start" value="All"
                                        >
                                            All Role
                                        </button>
                                    </li>
                                </ul>
                            </div>
                            <div className="relative w-100" style={{display: "flex"}}>
                                <input type="text" id="input" className="form-control" placeholder="Search email"
                                       required/>
                                <button
                                    type="submit"
                                    className="search-button text-bg-dark rounded-2 ms-2"
                                    onClick={(e) => search((document.getElementById("input") as HTMLInputElement).value, e)}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </form>
                    <div className="d-flex justify-content-end mb-3">
                        <button onClick={toggleAddModal}
                                className="new btn text-white mt-3 d-flex justify-content-end"
                                style={{backgroundColor: "gray", marginRight: '100px'}} type="button">
                            New Account
                        </button>
                    </div>
                    <table className="table table-striped">
                        <thead>
                        <tr>
                            {['name', "function", "phone", "address", "status", "action"].map((el, index) => (
                                <th key={index} className="border-bottom py-3 px-4 text-left">
                                    {el ? (
                                        <div className="text-uppercase text-dark fw-bold">{el}</div>
                                    ) : null}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {dataSource.map(({userid, name, email, phoneNumber, address, role, status}, key) => {
                            const className = `py-3 px-4 ${key === dataSource.length - 1 ? "" : "border-bottom"}`;
                            return (
                                <tr key={userid}>
                                    <td className={className}>
                                        <div className="d-flex align-items-center gap-3">
                                            <div>
                                                <div className="fw-bold text-dark">{name}</div>
                                                <div className="text-secondary small">{email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={className}>
                                        <div className="text-dark small">{role}</div>
                                    </td>
                                    <td className={className}>
                                        <div className="d-flex align-items-center gap-3">
                                            <div>
                                                <div className="fw-bold text-dark">{phoneNumber}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={className}>
                                        <div className="d-flex align-items-center gap-3">
                                            <div>
                                                <div className="fw-bold text-dark">{address}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={className}>
            <span className={`badge bg-${status ? "success" : "danger"}`}>
              {status ? "active" : "suspended"}
            </span>
                                    </td>
                                    <td className={className}>
                                        <div onClick={(e) => handleEdit(userid, e)} className="btn text-dark fw-bold">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 fill="currentColor" className="bi bi-pen" viewBox="0 0 16 16">
                                                <path
                                                    d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001m-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708z"/>
                                            </svg>
                                        </div>
                                        <div onClick={(e) => handleDelete(userid, e)} className="btn text-dark fw-bold">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
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


                    {/*Create new account*/}
                    <AddAccount
                        isOpen={isAddingNew}
                        onClose={toggleAddModal}
                        onSubmit={handleSubmit}
                        formData={formData}
                        handleChange={handleChange}
                    />

                    {/*Update account*/}
                    <UpdateAccount
                        isOpen={isUpdating}
                        onClose={toggleUpdateModal}
                        onSubmit={handleUpdate}
                        formData={formData}
                        handleChange={handleChange}
                    />

                </div>
            </div>
        </div>
    );
};

