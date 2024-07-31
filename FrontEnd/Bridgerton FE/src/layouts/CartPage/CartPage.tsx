import {useEffect, useState} from "react";
import {SpinnerLoading} from "../Utils/SpinnerLoading";
import CartModel from "../../models/CartModel";
import {CartProduct} from "./components/CartProduct";
import BillSummary from "./components/BillSummary";
import {jwtDecode} from "jwt-decode";

const token = localStorage.getItem('token');
export const CartPage = () => {
    const [products, setProducts] = useState<CartModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [updateFlag, setUpdateFlag] = useState(false);
    const [userId, setUserId] = useState(0);
    const [point, setPoint] = useState<number>(0);

    useEffect(() => {
        const data = localStorage.getItem('token');

        if (data) {
            const decodedToken = jwtDecode(data) as { id: number };
            setUserId(decodedToken.id)
        } else {
            console.log("No token found");
        }
    }, []);

    useEffect(() => {
        const fetchPoint = async () => {
            const token = localStorage.getItem('token');
            const headers = {
                'Authorization': `Bearer ${token}`
            }
            window.scrollTo(0, 0)
            if (userId) {
                const baseUrl: string = `https://deploy-be-b176a8ceb318.herokuapp.com/myAccount/userPoint?userId=${userId}`;
                const url: string = `${baseUrl}`;
                const response = await fetch(url, {headers: headers});
                if (!response.ok) {
                    throw new Error('Something went wrong!');
                }
                const responseJson = await response.json();
                setPoint(responseJson);
                console.log(responseJson)
            }
        };
        fetchPoint().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
            console.log(error);
        })
    }, [userId]);
    useEffect(() => {
        fetchProducts();
        if (!localStorage.getItem('cart')) {
            localStorage.setItem('cart', JSON.stringify([]));
        }
        window.scrollTo(0, 0);
    }, [updateFlag]);

    const fetchProducts = async () => {
        try {
            const baseUrl: string = "https://deploy-be-b176a8ceb318.herokuapp.com/cart/cart";

            const addProductRequests = localStorage.getItem("cart");
            const response = await fetch(baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: addProductRequests,
            });

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();
            const responseData = responseJson.data.content;

            const loadedProducts: CartModel[] = [];

            for (const key in responseData) {
                loadedProducts.push({
                    productId: responseData[key].productId,
                    productName: responseData[key].productName,
                    totalPrice: responseData[key].totalPrice,
                    image1: responseData[key].image1,
                    quantity: responseData[key].quantity,
                    size: responseData[key].size,
                    price: responseData[key].price,
                    sizeId: responseData[key].sizeId,
                });
            }
            setProducts(loadedProducts);
            setIsLoading(false);
        } catch (error: any) {
            setIsLoading(false);
            setHttpError(error.message);
        }
    };
    if (isLoading) {
        return (
            <SpinnerLoading/>
        )
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        )
    }

    const calculateTotalPrice = () => {
        return products.reduce((total, product) => total + product.totalPrice, 0);
    };

    const removeProduct = async (productId: number, sizeId: number) => {
        try {

            let products = JSON.parse(localStorage.getItem('cart') || '[]');


            products = products.filter((product: { productId: string, sizeId: number }) =>
                !(product.productId === productId.toString() && product.sizeId === sizeId)
            );

            localStorage.setItem('cart', JSON.stringify(products));
            setUpdateFlag(!updateFlag);
            const event = new CustomEvent('cartUpdated');
            window.dispatchEvent(event);

        } catch (error) {
            console.error('Failed to delete product from local storage', error);
            throw new Error('Failed to delete product');
        }
    };

    const handleGoBack = () => {
        window.history.back();
    };
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-8 mt-5">
                        <h1 className="mb-4 custom-heading text-center">Shopping Cart</h1>
                    <table className="table table-hover">
                        <thead>
                        <tr>
                            <td colSpan={6}>
                                <button style={{backgroundColor: '#001529'}} className="text-white" onClick={handleGoBack}>
                                    Continue Shopping
                                </button>
                            </td>

                        </tr>
                        <tr className='text-center'>
                            <th scope="col">IMAGE</th>
                            <th scope="col">PRODUCT NAME</th>
                            <th scope="col">QUANTITY</th>
                            <th scope="col">SIZE</th>
                            <th scope="col">PRICE</th>
                            <th scope="col"></th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((product) => (
                            <CartProduct product={product} key={product.productId + product.size}
                                         onRemoveProduct={removeProduct}/>
                        ))}
                        <tr>
                            <td colSpan={5} style={{color: 'green'}} className="text-right"><strong>Total
                                Price:</strong></td>
                            <td style={{color: 'red'}}><strong>${calculateTotalPrice().toLocaleString()}</strong></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="col-md-4">
                    <BillSummary cart={calculateTotalPrice()} point={point}/>
                </div>
            </div>
        </div>

    );

}