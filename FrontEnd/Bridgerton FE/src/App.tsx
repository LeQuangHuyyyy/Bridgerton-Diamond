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
import {SearchProductsPage} from "./layouts/SearchProductsPage/SearchProductsPage";
import {Table} from "./layouts/dashboard/Table";
import {jwtDecode} from "jwt-decode";
import ContactUs from "./layouts/ContactUs/ContactUs";
import {SaleStaffPage} from "./layouts/SaleStaff/SaleStaffPage";
import OrderSuccessPage from "./layouts/OrderSuccessPage/OrderSuccessPage";
import {SideBar} from "./layouts/Manager/component/NavBar";
import {Promotion} from "./layouts/Manager/Promotion";
import {Product} from "./layouts/Manager/Product";
import {Diamond} from "./layouts/Manager/Diamond";

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
                            <Route path='/contactus'>
                                <ContactUs/>
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
                            <Route path='/order-success'>
                                <OrderSuccessPage/>
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
                            <Route path='/contactus'>
                                <ContactUs/>
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
                            <Route path='/ordersuccess'>
                                <OrderSuccessPage/>
                            </Route>
                            <Footer/>
                        </div>
                    )


                    }


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
                            <SideBar/>
                            <Redirect from='/' to='/diamond' exact/>
                            <Route path='/promotion'>
                                <Promotion/>
                            </Route>
                            <Route path='/product'>
                                <Product/>
                            </Route>
                            <Route path='/diamond'>
                                <Diamond/>
                            </Route>
                        </>
                    )}
                    {token === 'SALE_STAFF' && (
                        <>
                            <Redirect from='/' to='/salestaff' exact/>
                            <Route path='/salestaff'>
                                <SaleStaffPage/>
                            </Route>
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
            