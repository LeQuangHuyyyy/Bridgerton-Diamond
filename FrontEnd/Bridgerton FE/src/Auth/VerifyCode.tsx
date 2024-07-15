import React from "react";
import {message} from "antd";

export const VerifyCode = () => {
    const [verifyCode, setVerifyCode] = React.useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const email = localStorage.getItem('email-register')
        const data = {
            email: email,
            verificationCode: verifyCode
        };
        const response = await fetch('https://deploy-be-b176a8ceb318.herokuapp.com/login/verify-registration', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response.ok) {
            const password = localStorage.getItem('password-register');

            fetch(`https://deploy-be-b176a8ceb318.herokuapp.com/login/signin?email=${email}&password=${password}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
            }).then(
                response => response.json()
            ).then(
                data => {
                    localStorage.setItem('token', data.data);
                    window.location.href = '/'
                }
            )
        }else {
            message.error('Change password successful!');
        }
    };

    return (
        <div className="login-container d-flex justify-content-center align-items-center"
             style={{position: "relative", height: "85vh"}}>
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
                <form className="bg-white pt-1 pb-4 ps-4 pe-4"
                      style={{height: "200px", width: "370px", position: "relative"}}
                      onSubmit={handleSubmit}>
                    <h2 className="text-center mb-4">VERIFY</h2>
                    <div className="form-group mb-2">
                        <input placeholder="Please Enter your verify code" required type="text"
                               className="form-control" id="username"
                               value={verifyCode}
                               onChange={(e) => setVerifyCode(e.target.value)}/>
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
                    </button></form>
            </div>
        </div>

    )
}