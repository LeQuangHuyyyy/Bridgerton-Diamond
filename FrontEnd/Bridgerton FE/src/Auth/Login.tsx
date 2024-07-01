import React from "react";
import {jwtDecode} from "jwt-decode";
import {NavLink} from "react-router-dom";
import UserModel from "../models/UserModel";

export const Login = () => {
    const [showRegister, setShowRegister] = React.useState(false);
    const [email, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [registerUsername, setRegisterUsername] = React.useState('');
    const [registerPassword, setRegisterPassword] = React.useState('');
    const [registerPhoneNumber, setRegisterPhoneNumber] = React.useState('');
    const [registerEmail, setRegisterEmail] = React.useState('');
    const [registerAddress, setRegisterAddress] = React.useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        fetch(`http://localhost:8888/login/signin`, {
                method: "POST",
                body: formData
            }
        ).then(
            response => response.json()
        )
            .then(
                data => {
                    localStorage.setItem('token', data.data);
                    const token = data.data;
                    const enCrypt = jwtDecode(token) as {
                        id: number;
                        name: string;
                        phone: string;
                        role: string;
                        address: string;

                    };

                    if (enCrypt.role === 'CUSTOMER') {
                        window.location.href = "/home"
                    } else if (enCrypt.role === 'ADMIN') {
                        window.location.href = '/admin'
                    } else if (enCrypt.role === 'MANAGER') {
                        window.location.href = '/manger'
                    } else if (enCrypt.role === 'SALE_STAFF') {
                        window.location.href = '/sale'
                    } else if (enCrypt.role === 'DELIVERY_STAFF') {
                        window.location.href = '/delivery'
                    }
                }
            )
            .catch(err => {
                console.log(err)
            })
    };
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const userModel = new UserModel(registerUsername, registerPassword, registerPhoneNumber, registerEmail, registerAddress)

        const response = await fetch(`http://localhost:8888/login/signup`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userModel)
            }
        )
        if (response.ok) {
            localStorage.setItem('email-register', registerEmail);
            localStorage.setItem('password-register', registerPassword);
            window.location.href = "/verify-register";
        } else {
            alert('Email is already exist')
        }
        setShowRegister(false);
    };


    return (
        <div className="login-container d-flex justify-content-center align-items-center"
             style={{position: "relative", height: "90vh"}}>
            <div className="overlay bg-white" style={{
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 1,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.1)",
            }}></div>

            <div className="login-register-container bg-white p-4 shadow-lg rounded-3"
                 style={{position: "relative", zIndex: 2}}>
                <div className="login-register-header d-flex justify-content-center mb-4"
                     style={{marginBottom: "30px"}}>
                    <button className="bg-white border-0 w-50 " onClick={() => setShowRegister(false)}>LOGIN</button>
                    <button className="bg-white border-0 w-50" onClick={() => setShowRegister(true)}>REGISTER</button>
                </div>
                {showRegister ? (
                    <form className="bg-white pt-1 pb-4 ps-4 pe-4"
                          style={{height: "520px", width: "370px", position: "relative"}} onSubmit={handleRegister}>
                        <h2 className="text-center mb-4">REGISTER</h2>
                        <div className="form-group mb-2">
                            <label htmlFor="username">Username:</label>
                            <input required type="text" className="form-control" id="username"
                                   value={registerUsername}
                                   onChange={(e) => setRegisterUsername(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input required type="password" className="form-control" id="password"
                                   value={registerPassword}
                                   onChange={(e) => setRegisterPassword(e.target.value)}/>
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="phoneNumber">Phone Number:</label>
                            <input required type="text" className="form-control" id="username"
                                   value={registerPhoneNumber}
                                   onChange={(e) => setRegisterPhoneNumber(e.target.value)}/>
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="email">Email:</label>
                            <input required type="email" className="form-control" id="username"
                                   value={registerEmail}
                                   onChange={(e) => setRegisterEmail(e.target.value)}/>
                        </div>
                        <div className="form-group mb-2">
                            <label htmlFor="address">Address:</label>
                            <input required type="text" className="form-control" id="username"
                                   value={registerAddress}
                                   onChange={(e) => setRegisterAddress(e.target.value)}/>
                        </div>
                        <button type="submit" className="btn btn-dark btn-block" style={{
                            position: "absolute",
                            bottom: "60px",
                            left: "20px",
                            right: "20px",
                            width: "330px",
                            transition: "background-color 0.3s ease"
                        }}>
                            REGISTER
                        </button>
                    </form>
                ) : (
                    <form className="bg-white pt-1 pb-4 ps-4 pe-4"
                          style={{height: "400px", width: "370px", position: "relative"}}
                          onSubmit={handleSubmit}>
                        <h2 className="text-center mb-4">LOGIN</h2>
                        <div className="form-group mb-2">
                            <label htmlFor="username">Username:</label>
                            <input required type="text" className="form-control" id="username" value={email}
                                   onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input required type="password" className="form-control" id="password" value={password}
                                   onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <NavLink className="text-decoration-none position-relative text-dark"
                                 style={{bottom: "-80px", left: "220px"}} to="/forgot-password">
                            forgot password
                        </NavLink>
                        <button type="submit" className="btn btn-dark btn-block" style={{
                            position: "absolute",
                            bottom: "140px",
                            left: "20px",
                            right: "20px",
                            width: "330px",
                            transition: "background-color 0.3s ease"
                        }}>
                            LOGIN
                        </button>
                    </form>
                )}
            </div>
        </div>

    )
}