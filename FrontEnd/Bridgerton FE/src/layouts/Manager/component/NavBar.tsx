import React, {useState, useEffect} from 'react';
import {NavLink} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const headers = localStorage.getItem('token');

export const SideBar: React.FC = () => {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        if (headers !== null) {
            const decodedToken = jwtDecode(headers) as { name: string };
            setUserName(decodedToken.name);
        }
    }, []);

    const logOut = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg navbar-light bg-light d-flex justify-content-between"
                 style={{height: '70px'}}
            >
                <div className="d-flex ms-5 ">
                    <NavLink to="/dashboard" className="navbar-brand">
                        Dashboard
                    </NavLink>
                    <NavLink to="/promotion" className="navbar-brand">
                        Promotion
                    </NavLink>
                    <NavLink to="/product" className="navbar-brand">
                        Product
                    </NavLink>
                    <NavLink to="/diamond" className="navbar-brand">
                        Diamond
                    </NavLink>
                </div>
                <div className="d-flex align-items-center w-25 justify-content-center">
                    <h5 className="me-4">Hello, {userName}</h5>
                    <button
                        onClick={logOut}
                        className="btn btn-outline-dark"
                        style={{
                            height: '38px',
                            borderRadius: '10px',
                        }}
                    >
                        Logout
                    </button>
                </div>
            </nav>
        </>
    );
};
