import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import {ReturnProducts} from "./ReturnProducts";
import {useEffect, useState} from "react";
import ProductModel from "../../../models/ProductModel";
import {SpinnerLoading} from "../../Utils/SpinnerLoading";


export const CarouselProduct = () => {
    const [product, setProducts] = useState<ProductModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);


    useEffect(() => {
        const fetchProducts = async () => {
            const baseUrl: string = "http://localhost:8888/home";
            const url: string = `${baseUrl}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            const responseJson = await response.json();
            const responseData = responseJson.content;
            const loadedProducts: ProductModel[] = [];
            for (const key in responseData) {
                loadedProducts.push({
                    productId: responseData[key].productId,
                    productName: responseData[key].productName,
                    price: responseData[key].price,
                    stockQuantity: responseData[key].stockQuantity,
                    collection: responseData[key].collection,
                    description: responseData[key].description,
                    image1: responseData[key].image1,
                    image2: responseData[key].image2,
                    image3: responseData[key].image3,
                    image4: responseData[key].image4,
                    categoryId: responseData[key].categoryId,
                    diamondId: responseData[key].diamondId,
                    shellId: responseData[key].shellId
                });
            }
            setProducts(loadedProducts);
            setIsLoading(false);
        };
        fetchProducts().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
            console.log(error);
        })
    }, []);

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
    const responsive = {
        superLargeDesktop: {
            breakpoint: {max: 4000, min: 3000},
            items: 5
        },
        desktop: {
            breakpoint: {max: 3000, min: 1024},
            items: 4
        },
        tablet: {
            breakpoint: {max: 1024, min: 464},
            items: 2
        },
        mobile: {
            breakpoint: {max: 464, min: 0},
            items: 1
        }
    }
    return (
        <div className='container mt-5' style={{height: 550}}>
            <div className='homepage-carousel-title'>
                <h1 style={{fontSize: '45px'}} className='custom-heading'>New Products</h1>
            </div>
            <Carousel responsive={responsive}>
                {product.slice(0, 10).map((product) => (
                    <ReturnProducts key={product.productId} product={product}/>
                ))}
            </Carousel>
        </div>

    );
}