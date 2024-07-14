import React from "react";
import {jwtDecode} from "jwt-decode";
import {NavLink} from "react-router-dom";
import UserModel from "../models/UserModel";
import {message} from "antd";
import './Login.css';

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

        fetch(`https://deploy-be-b176a8ceb318.herokuapp.com/login/signin`, {
                method: "POST",
                body: formData
            }
        ).then(
            response => response.json()
        ).then(
                data => {
                    if (data !== false){

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
                            message.success("Login success")
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
                }
            )
            .catch(err => {
                message.error('Invalid email or password');
                console.log(err)
            })
    };
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const userModel = new UserModel(0, registerUsername, registerPassword, registerPhoneNumber, registerEmail, registerAddress)

        const response = await fetch(`https://deploy-be-b176a8ceb318.herokuapp.com/login/signup`, {
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
            message.error('Email or phone number is already exist');
            message.error('Email is already exist');
        }
        setShowRegister(false);
    };


    return (
        <div className="login-container d-flex justify-content-center align-items-center">
            <div className="overlay"></div>

            <div className="login-register-container">
                <div className="login-register-header d-flex justify-content-center">
                    <button className={`tab ${!showRegister ? 'active' : ''}`}
                            onClick={() => setShowRegister(false)}>LOGIN
                    </button>
                    <button className={`tab ${showRegister ? 'active' : ''}`}
                            onClick={() => setShowRegister(true)}>REGISTER
                    </button>
                </div>
                {showRegister ? (
                    <form className="form-container" onSubmit={handleRegister}>
                        <h2 className="text-center">REGISTER</h2>
                        <div className="form-group">
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
                        <div className="form-group">
                            <label htmlFor="phoneNumber">Phone Number:</label>
                            <input required type="text" className="form-control" id="phoneNumber"
                                   value={registerPhoneNumber}
                                   onChange={(e) => setRegisterPhoneNumber(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email:</label>
                            <input required type="email" className="form-control" id="email"
                                   value={registerEmail}
                                   onChange={(e) => setRegisterEmail(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Address:</label>
                            <input required type="text" className="form-control" id="address"
                                   value={registerAddress}
                                   onChange={(e) => setRegisterAddress(e.target.value)}/>
                        </div>
                        <button type="submit" className="btn btn-dark btn-block">REGISTER</button>
                    </form>
                ) : (
                    <form className="form-container" onSubmit={handleSubmit}>
                        <h2 className="text-center">LOGIN</h2>
                        <div className="form-group">
                            <label htmlFor="username">Email:</label>
                            <input required type="text" className="form-control" id="username" value={email}
                                   onChange={(e) => setUsername(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password:</label>
                            <input required type="password" className="form-control" id="password" value={password}
                                   onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <NavLink className="text-decoration-none position-relative text-dark forgot-password"
                                 to="/forgot-password">
                            Forgot password?
                        </NavLink>
                        <button type="submit" className="btn btn-dark btn-block">LOGIN</button>
                    </form>
                )}
            </div>
        </div>
    )
}