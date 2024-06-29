import React, {useEffect} from 'react';
import './App.css';
import {Navbar} from "./layouts/NavbarAndFooter/Navbar";
import {Footer} from "./layouts/NavbarAndFooter/Footer";
import {HomePage} from "./layouts/HomePage/HomePage";
import {Redirect, Route, BrowserRouter as Router, Switch} from 'react-router-dom';
import {ProductCheckoutPage} from "./layouts/ProductCheckoutPage/ProductCheckoutPage";
import {CartPage} from "./layouts/CartPage/CartPage";
import {ForgotPassword} from "./Auth/ForgotPassword";
import {Login} from "./Auth/Login";
import {VerifyCode} from "./Auth/VerifyCode";
import {ResetPassword} from "./Auth/ResetPassword";
import {DiamondPricePage} from "./layouts/DiamondPrice/DiamondPricePage";
import Checkout from "./layouts/CartPage/components/Checkout";
import {SaleStaffPage} from "./layouts/SaleStaff/SaleStaffPage";
import {SearchProductsPage} from "./layouts/SearchProductsPage/SearchProductsPage";
import {Table} from "./layouts/Admin/Table";

import {SideNav} from './layouts/Manager/sideNav'
import {Dashboard} from './layouts/Manager/Dashboard'
import {Promotion} from './layouts/Manager/Promotion'

import {jwtDecode} from "jwt-decode";

export const App = () => {
    const [token, setToken] = React.useState<string | undefined>();

    useEffect(() => {
        const data = localStorage.getItem('token');

        if (data) {
            const decodedToken = jwtDecode(data) as { role: string };
            setToken(decodedToken.role);
        } else {
            setToken(undefined);
        }
    }, []);

    return (
        <div className='d-flex flex-column min-vh-100'>
            <Router>
                <Switch>
                    {token === undefined && (
                        <div className='flex-grow-1 w-100'>
                            <Navbar/>
                            <Redirect to='/home' exact/>

                            <Route path='/' exact>
                                <HomePage/>
                            </Route>
                            <Route path='/home'>
                                <HomePage/>
                            </Route>
                            <Route path='/shop'>
                                <SearchProductsPage/>
                            </Route>
                            <Route path='/detail/:productId'>
                                <ProductCheckoutPage/>
                            </Route>
                            <Route path='/price'>
                                <DiamondPricePage/>
                            </Route>
                            <Route path='/cart'>
                                <CartPage/>
                            </Route>
                            <Route path='/login'>
                                <Login/>
                            </Route>
                            <Route path='/verify-register'>
                                <VerifyCode/>
                            </Route>
                            <Route path='/forgot-password'>
                                <ForgotPassword/>
                            </Route>
                            <Route path='/reset-password'>
                                <ResetPassword/>
                            </Route>
                            <Footer/>
                        </div>
                    )
                    }
                    {token === 'CUSTOMER' && (
                        <div className='flex-grow-1 w-100'>
                            <Navbar/>
                            <Redirect from='/' to='/home' exact/>
                            <Route path='/cart'>
                                <CartPage/>
                            </Route>
                            <Route path='/checkout'>
                                <Checkout/>
                            </Route>
                            <Route path='/home'>
                                <HomePage/>
                            </Route>
                            <Route path='/shop'>
                                <SearchProductsPage/>
                            </Route>
                            <Route path='/detail/:productId'>
                                <ProductCheckoutPage/>
                            </Route>
                            <Route path='/price'>
                                <DiamondPricePage/>
                            </Route>
                            <Route path='/login'>
                                <Login/>
                            </Route>
                            <Route path='/verify-register'>
                                <VerifyCode/>
                            </Route>
                            <Route path='/forgot-password'>
                                <ForgotPassword/>
                            </Route>
                            <Route path='/reset-password'>
                                <ResetPassword/>
                            </Route>
                            <Footer/>
                        </div>
                    )}
                    {token === 'ADMIN' && (
                        <>
                            <Redirect from='/' to='/admin' exact/>
                            <Route path='/admin'>
                                <Table/>
                            </Route>
                        </>
                    )}
                    {token === 'MANAGER' && (
                        <>
                            <Redirect from='/' to='/promotion' exact/>
                            <SideNav/>
                            <Route path='/dashboard'>
                                <Dashboard/>
                            </Route>
                            <Route path='/promotion'>
                                <Promotion/>
                            </Route>
                        </>
                    )}
                    {token === 'SALE_STAFF' && (
                        <>
                            <Redirect from='/' to='/sale-staff' exact/>
                        </>
                    )}
                    {token === 'DELIVERY_STAFF' && (
                        <>
                            <Redirect from='/' to='/' exact/>
                        </>
                    )}
                </Switch>
            </Router>
        </div>
    );
};
