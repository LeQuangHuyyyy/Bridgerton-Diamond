import React from "react";

export const ResetPassword = () => {
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [verificationCode, setVerificationCode] = React.useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (confirmPassword !== password) {
            alert('Confirm password is not correct')
        } else {
            const email = localStorage.getItem('email');
            const data = {
                email: email,
                verificationCode: verificationCode,
                password: password
            };
            const response = await fetch('http://localhost:8888/login/resetpassword', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            if (response.ok) {
                window.location.href = '/login'
                localStorage.removeItem('email')
            }
        }
    };

    return (
        <div className="login-container d-flex justify-content-center align-items-center"
             style={{position: "relative", height: "80vh"}}>
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
                      style={{height: "370px", width: "370px", position: "relative"}}
                      onSubmit={handleSubmit}>
                    <h2 className="text-center mb-4">Reset Password</h2>

                    <div className="form-group mb-2">
                        <label htmlFor="username">Verify Code:</label>
                        <input required type="text" className="form-control" id="username"
                               value={verificationCode}
                               onChange={(e) => setVerificationCode(e.target.value)}/>
                    </div>

                    <div className="form-group mb-2">
                        <label htmlFor="username">Password:</label>
                        <input required type="text" className="form-control" id="username"
                               value={password}
                               onChange={(e) => setPassword(e.target.value)}/>
                    </div>

                    <div className="form-group mb-2">
                        <label htmlFor="username">Confirm Password:</label>
                        <input required type="text" className="form-control" id="username"
                               value={confirmPassword}
                               onChange={(e) => setConfirmPassword(e.target.value)}/>
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