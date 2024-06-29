import React, {useState, useEffect} from 'react';
import {NavLink} from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const headers = localStorage.getItem('token');

export const SideNav: React.FC = () => {
    const [userName, setUserName] = useState('')
    useEffect(() => {
        if (headers !== null) {
            const enCrypt = jwtDecode(headers) as {
                name: string
            }
            setUserName(enCrypt.name)
        }
    }, []);

    const logOut = () => {
        localStorage.removeItem('token');
        window.location.href = '/';
    }


    return (
        <>
            <div className="d-flex justify-content-center mb-5 position-fixed"
                 style={{
                     top: '20px',
                     left: '20px'
                 }}
            >
                <h5>Hello {userName}</h5>
            </div>
            <div className="d-flex justify-content-center position-absolute "
                 style={{
                     right: '10px',
                     top: '10px',
                 }}
            >
                <button onClick={logOut}
                        style={{
                            border: 'none',
                            width: '80px',
                            backgroundColor: 'darkgray',
                            borderRadius: '20px'
                        }}>

                    log out
                </button>
            </div>
            <div className="flex-column rounded-4"
                 style={{
                     position: 'fixed',
                     height: '100%',
                     width: '230px',
                     boxShadow: '10px 0 8px 0 rgba(0, 0, 0, 0.2)',
                     paddingTop: '40px',
                     marginTop: '50px'
                 }}
            >

                <NavLink to="/dashboard" className="nav-link ps-4 text-dark mb-2 d-flex align-items-center"
                         style={{height: '50px'}}
                         activeClassName="active">
                    <h4 className="side-nav-h4">
                        Dashboard
                    </h4>
                </NavLink>
                <NavLink to="/promotion" className="nav-link ps-4 text-dark mb-2 d-flex align-items-center"
                         style={{height: '50px'}}
                         activeClassName="active">
                    <h4 className="side-nav-h4">
                        Promotion
                    </h4>
                </NavLink>
                <NavLink to="/product" className="nav-link ps-4 text-dark mb-2 d-flex align-items-center"
                         style={{height: '50px'}}
                         activeClassName="active">
                    <h4 className="side-nav-h4">
                        Product
                    </h4>
                </NavLink>

            </div>
        </>

    );
};

