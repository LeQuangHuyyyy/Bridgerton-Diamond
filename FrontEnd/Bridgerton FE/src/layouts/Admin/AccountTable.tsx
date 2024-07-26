import React, {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import {Badge, Button, Dropdown, Form, Input, Menu, message, Modal, Table} from "antd";
import AddAccount from "./AddAccount";
import UpdateAccount from "./UpdateAccount";
import {UserAddOutlined, UserOutlined} from "@ant-design/icons";

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

export const AccountTable: React.FC = () => {
    const [dataSource, setDataSource] = useState([]);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [selectedRole, setSelectedRole] = useState('All Role');
    const [formData, setFormData] = useState<UserData>({
        userid: '', name: '', email: '', password: '', phoneNumber: '', address: '', role: '', status: ''
    });
    const [userName, setUserName] = useState('');

    const toggleAddModal = () => {
        setFormData({
            userid: '', name: '', email: '', password: '', phoneNumber: '', address: '', role: '', status: ''
        });
        setIsAddingNew(!isAddingNew);
    };

    const toggleUpdateModal = () => {
        setIsUpdating(!isUpdating);
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
                } else {
                    setUserName(enCrypt.name);
                }
            } else {
                window.location.href = '/';
                return;
            }

            const response = await fetch('https://deploy-be-b176a8ceb318.herokuapp.com/manage/accounts', {
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

    const handleStatusChange = (checked: boolean) => {
        setFormData({...formData, status: checked ? 'true' : 'false'});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            const response = await fetch('https://deploy-be-b176a8ceb318.herokuapp.com/manage/accounts', {
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
                message.error("Email or PhoneNumber already exists");
                setIsAddingNew(true);
                return;
            }

            if (formData.status === "") {
                formData.status = "true";
            }

            const postResponse = await fetch('https://deploy-be-b176a8ceb318.herokuapp.com/manage/accounts', {
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
        setIsUpdating(true);
        const accountToEdit = dataSource.find((account: any) => account.userid === userid);
        if (accountToEdit) {
            setFormData(accountToEdit);
        }
    };

    const handleUpdate = async () => {
        let check = true;
        try {
            const response = await fetch('https://deploy-be-b176a8ceb318.herokuapp.com/manage/accounts', {
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
                await fetch(`https://deploy-be-b176a8ceb318.herokuapp.com/manage/accounts/${formData.userid}`, {
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
            await fetch(`https://deploy-be-b176a8ceb318.herokuapp.com/manage/accounts/${userid}`, {
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

    const search = async (input: string) => {
        if (input === "") {
            const response = await fetch('https://deploy-be-b176a8ceb318.herokuapp.com/manage/accounts', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${headers}`
                }
            });
            const data = await response.json();
            setDataSource(data.content || []);
        } else {
            const response = await fetch(`https://deploy-be-b176a8ceb318.herokuapp.com/manage/searchAccount?keyword=${input}`, {
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
            const response = await fetch('https://deploy-be-b176a8ceb318.herokuapp.com/manage/accounts', {
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

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: any) => (
                <>
                    <div className="fw-bold text-dark">{text}</div>
                    <div className="text-secondary small">{record.email}</div>
                </>
            )
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (text: string) => <div className="text-dark small">{text}</div>
        },
        {
            title: 'Phone',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
            render: (text: string) => <div className="fw-bold text-dark">{text}</div>
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            render: (text: string) => <div className="fw-bold text-dark">{text}</div>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text: string) => (
                <Badge status={text ? "success" : "error"} text={text ? "ACTIVE" : "SUSPENDED"}/>
            )
        },
        {
            title: 'Action',
            key: 'action',
            render: (text: string, record: any) => (
                <>
                    <Button type="link" onClick={(e) => handleEdit(record.userid, e)}>Edit</Button>
                    <Button type="link" danger onClick={(e) => handleDelete(record.userid, e)}>Suspended</Button>
                </>
            )
        }
    ];

    return (
        <div className="container">
            <div className="mb-3 p-4 mt-5 d-flex justify-content-end "
                 style={{marginLeft: '20px', marginRight: '20px', borderRadius: '20px'}}>
                <div className="d-flex align-items-center w-25 justify-content-around ">
                    <div>
                        <p className="m-0">Welcome back, {userName}!</p>
                    </div>
                    <Button onClick={logOut} className="p-2 rounded-3">
                        Log Out
                    </Button>
                </div>
            </div>
            <div className="overflow-auto px-0 pt-0 pb-1">
                <Form layout="inline" className="mx-auto ms-3 w-100 max-w-lg"
                      onSubmitCapture={(e) => search((document.getElementById("input") as HTMLInputElement).value)}>
                    <Form.Item>
                        <Dropdown overlay={
                            <Menu onClick={({key}) => searchRoleHandleChange(key)}>
                                <Menu.Item key="ADMIN">Admin</Menu.Item>
                                <Menu.Item key="DELIVERY_STAFF">Delivery Staff</Menu.Item>
                                <Menu.Item key="SALE_STAFF">Sale Staff</Menu.Item>
                                <Menu.Item key="CUSTOMER">Customer</Menu.Item>
                                <Menu.Item key="MANAGER">Manager</Menu.Item>
                                <Menu.Item key="All Role">All Role</Menu.Item>
                            </Menu>
                        }>
                            <Button>
                                {selectedRole}
                            </Button>
                        </Dropdown>
                    </Form.Item>
                    <Form.Item>
                        <Input id="input" placeholder="Search email" required/>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Search</Button>
                    </Form.Item>
                </Form>

                <h6 className="custom-heading"
                    style={{fontSize: '45px', display: 'flex', justifyContent: 'center'}}>Account Table<UserOutlined/>
                </h6>
                <div className="d-flex justify-content-end mb-3">
                    <Button style={{
                        fontSize: '25px',
                        fontWeight: 'bold',
                        boxSizing: "border-box",
                        marginRight: "10px",
                        padding: "20px"
                    }}
                            onClick={toggleAddModal}
                            type="primary" className="btn mt-3 d-flex justify-content-end">
                        <UserAddOutlined/> New Account
                    </Button>
                </div>
                <Table dataSource={dataSource} columns={columns} rowKey="userid"/>
            </div>


            <Modal visible={isAddingNew} title="Add New Account" onCancel={toggleAddModal} footer={null}>
                <AddAccount
                    isOpen={isAddingNew}
                    onClose={toggleAddModal}
                    onSubmit={handleSubmit}
                    formData={formData}
                    handleChange={handleChange}
                />
            </Modal>
            <Modal visible={isUpdating} title="Update Account" onCancel={toggleUpdateModal} footer={null}>
                <UpdateAccount
                    isOpen={isUpdating}
                    onClose={toggleUpdateModal}
                    onSubmit={handleUpdate}
                    formData={formData}
                    handleChange={handleChange}
                    handleStatusChange={handleStatusChange}
                />
            </Modal>
        </div>
    );
};
