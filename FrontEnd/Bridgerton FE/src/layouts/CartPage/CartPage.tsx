import {useEffect, useState} from "react";
import {SpinnerLoading} from "../Utils/SpinnerLoading";
import CartModel from "../../models/CartModel";
import {CartProduct} from "./components/CartProduct";
import BillSummary from "./components/BillSummary";

export const CartPage = () => {

    const [products, setProducts] = useState<CartModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchUrl, setSearchUrl] = useState('');
    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': `Bearer ${token}`
    }
    useEffect(() => {
        const fetchProducts = async () => {
            const baseUrl: string = "http://localhost:8888/cart/cart";

            const addProductRequests = localStorage.getItem("cart");
            console.log(addProductRequests);
            const response = await fetch(baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJodXlscXNlMTcxMjkzQGZwdC5lZHUudm4ifQ.FzAs3FrNbICbW9dUGZivmqNtMvUs7dh-fCgJy0EvluQ'
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
                    price: 0
                });
            }
            setProducts(loadedProducts);
            setIsLoading(false);
        };
        fetchProducts().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
        window.scrollTo(0, 0);
    }, [currentPage, searchUrl]);
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

    const removeProduct = async (productId: number, size: string) => {
        try {

            let products = JSON.parse(localStorage.getItem('cart') || '[]');


            products = products.filter((product: { productId: string, size: string }) => product.productId !== productId.toString() || product.size !== size);

            localStorage.setItem('cart', JSON.stringify(products));
            setProducts(products);
            console.log(`Product with ID ${productId} removed from local storage`);

        } catch (error) {
            console.error('Failed to delete product from local storage', error);
            throw new Error('Failed to delete product');
        }
    };


    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-8 mt-5">
                    <h1 className="mb-4 custom-heading text-center">Cart</h1>
                    <table className="table table-hover">
                        <thead>
                        <tr className='text-center'>
                            <th scope="col">IMAGE</th>
                            <th scope="col">PRODUCT NAME</th>
                            <th scope="col">QUANTITY</th>
                            <th scope="col">SIZE</th>
                            <th scope="col">PRICE</th>
                            <th scope="col">ACTION</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((product) => (
                            <CartProduct product={product} key={product.productId} onRemoveProduct={removeProduct}/>
                        ))}
                        <tr>
                            <td colSpan={5} style={{color: 'green'}} className="text-right"><strong>Total
                                Price:</strong></td>
                            <td style={{color: 'red'}}><strong>${calculateTotalPrice()}</strong></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="col-md-4">
                    <BillSummary cart={calculateTotalPrice()}/>
                </div>
            </div>
        </div>

    );

}