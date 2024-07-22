import React from "react";
import './Login.css';
import {message} from "antd";
export const ForgotPassword = () => {
    const [email, setEmail] = React.useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            email: email,
        };
        const response = await fetch('https://deploy-be-b176a8ceb318.herokuapp.com/login/forgotpassword', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })

        if (response.ok) {
            localStorage.setItem('email', email);
            window.location.href = '/reset-password'
        }else{
            message.error('The email is not registered. Try again!');
        }
    };

    return (
        <div className="login-container d-flex justify-content-center align-items-center"
             style={{position: "relative", height: "85vh"}}>
            <div className="login-register-container"
                 style={{position: "relative", zIndex: 2}}>
                <form className="form-container pt-1 pb-4 ps-4 pe-4"
                      style={{height: "200px", width: "370px", position: "relative"}}
                      onSubmit={handleSubmit}>
                    <h2 className="text-center mb-4">Email</h2>
                    <div className="form-group mb-2">
                        <input placeholder="Please Enter your email to reset password" required type="text"
                               className="form-control" id="username"
                               value={email}
                               onChange={(e) => setEmail(e.target.value)}/>
                    </div>

                    <button type="submit" className="btn btn-dark btn-block" style={{
                        position: "absolute",
                        bottom: "40px",
                        left: "20px",
                        right: "20px",
                        width: "330px",
                        transition: "background-color 0.3s ease"
                    }}>
                        Submit
                    </button>
                </form>
            </div>
        </div>

    )
}