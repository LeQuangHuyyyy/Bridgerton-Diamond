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
import {AccountTable} from "./layouts/Admin/AccountTable";
import {jwtDecode} from "jwt-decode";
import ContactUs from "./layouts/ContactUs/ContactUs";
import {SaleStaffPage} from "./layouts/SaleStaff/SaleStaffPage";
import OrderSuccessPage from "./layouts/OrderSuccessPage/OrderSuccessPage";
import OrderDetail from "./layouts/SaleStaff/component/OrderDetail";
import DeliveryStaff from "./layouts/DeliveryStaff/DeliveryStaff";
import {SideBar} from "./layouts/Manager/SideBar";
import {Promotion} from "./layouts/Manager/Promotion";
import {Product} from "./layouts/Manager/Product";
import {Diamond} from "./layouts/Manager/Diamond";
import Dashboard from "./layouts/Manager/Dashboard";
import Account from "./layouts/MyAccount/Account";
import {InformationAccount} from "./layouts/MyAccount/InformationAccount";
import MyOrders from "./layouts/MyAccount/MyOrders";
import ChangePassword from "./layouts/MyAccount/ChangePassword";
import MyOrderDetail from "./layouts/MyAccount/MyOrderDetail";
import OrderDeliveryDetail from "./layouts/DeliveryStaff/OrderDeliveryDetail";
import {DiamondEducation} from "./layouts/HomePage/component/DiamondEducation";
import NotFoundPage from "./layouts/NotFoundPage/NotFoundPage";

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
                            <Route path='/deliverystaff'>
                                <NotFoundPage/>
                            </Route>
                            <Route path='/deliverydetailorder/:orderId'>
                                <NotFoundPage/>
                            </Route>
                            <Route path='/salestaff'>
                                <NotFoundPage/>
                            </Route>
                            <Route path='/orderdetail/:orderId'>
                                <NotFoundPage/>
                            </Route>
                            <Route path='/promotion'>
                                <NotFoundPage/>
                            </Route>
                            <Route path='/dashboard'>
                                <NotFoundPage/>
                            </Route>
                            <Route path='/product'>
                                <NotFoundPage/>
                            </Route>
                            <Route path='/diamond'>
                                <NotFoundPage/>
                            </Route>
                            <Route path='/diamond-education'>
                                <DiamondEducation/>
                            </Route>
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
                            <Route path='/ordersuccess'>
                                <OrderSuccessPage/>
                            </Route>
                            <Route path='/admin'>
                                <NotFoundPage/>
                            </Route>
                            <Footer/>
                        </div>
                    )
                    }
                    {token === 'CUSTOMER' && (
                        <div className='flex-grow-1 w-100'>
                            <Navbar/>
                            <Route path='/deliverystaff'>
                                <NotFoundPage/>
                            </Route>
                            <Route path='/deliverydetailorder/:orderId'>
                                <NotFoundPage/>
                            </Route>
                            <Route path='/salestaff'>
                                <NotFoundPage/>
                            </Route>
                            <Route path='/orderdetail/:orderId'>
                                <NotFoundPage/>
                            </Route>
                            <Route path='/promotion'>
                                <NotFoundPage/>
                            </Route>
                            <Route path='/dashboard'>
                                <NotFoundPage/>
                            </Route>
                            <Route path='/product'>
                                <NotFoundPage/>
                            </Route>
                            <Route path='/diamond'>
                                <NotFoundPage/>
                            </Route>
                            <Route path='/admin'>
                                <NotFoundPage/>
                            </Route>
                            <Route path='/diamond-education'>
                                <DiamondEducation/>
                            </Route>
                            <Route path='/' exact>
                                <HomePage/>
                            </Route>
                            <Route path='/home'>
                                <HomePage/>
                            </Route>
                            <Route path='/cart'>
                                <CartPage/>
                            </Route>
                            <Route path='/checkout'>
                                <Checkout/>
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

                            <Route path='/reset-password'>
                                <ResetPassword/>
                            </Route>
                            <Route path='/ordersuccess'>
                                <OrderSuccessPage/>
                            </Route>
                            <Switch>
                                <Route path='/myaccount'>
                                    <Account>
                                        <InformationAccount/>
                                    </Account>
                                </Route>
                                <Route path='/myorders'>
                                    <Account>
                                        <MyOrders/>
                                    </Account>
                                </Route>
                                <Route path='/myorderdetail/:orderId'>
                                    <Account>
                                        <MyOrderDetail/>
                                    </Account>
                                </Route>
                                <Route path='/changepassword'>
                                    <Account>
                                        <ChangePassword/>
                                    </Account>
                                </Route>
                            </Switch>
                            <Footer/>
                        </div>
                    )
                    }
                    {token === 'ADMIN' && (
                        <>
                            <Route path='/admin'>
                                <AccountTable/>
                            </Route>
                        </>
                    )}
                    {token === 'MANAGER' && (
                        <>
                            <SideBar>
                                <Route path='/promotion'>
                                    <Promotion/>
                                </Route>
                                <Route path='/dashboard'>
                                    <Dashboard/>
                                </Route>
                                <Route path='/product'>
                                    <Product/>
                                </Route>
                                <Route path='/diamond'>
                                    <Diamond/>
                                </Route>
                            </SideBar>
                        </>
                    )}
                    {token === 'SALE_STAFF' && (
                        <>
                            <Redirect from='/' to='/salestaff' exact/>
                            <Route path='/salestaff'>
                                <SaleStaffPage/>
                            </Route>
                            <Route path='/orderdetail/:orderId'>
                                <OrderDetail/>
                            </Route>
                        </>
                    )}
                    {token === 'DELIVERY_STAFF' && (
                        <>
                            <Redirect from='/' to='/deliverystaff' exact/>
                            <Route path='/deliverystaff'>
                                <DeliveryStaff/>
                            </Route>
                            <Route path='/deliverydetailorder/:orderId'>
                                <OrderDeliveryDetail/>
                            </Route>
                        </>
                    )}
                </Switch>
            </Router>
        </div>
    );
};
