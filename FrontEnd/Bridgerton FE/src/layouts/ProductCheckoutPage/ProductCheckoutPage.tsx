import React, {useEffect, useState} from "react";
import ProductModel from "../../models/ProductModel";
import {SpinnerLoading} from "../Utils/SpinnerLoading";
import {StarsReview} from "../Utils/StarsReview";
import DiamondTable from "./DiamondAndShellTable/DiamondTable";
import ShellTable from "./DiamondAndShellTable/ShellTable";
import SizeModel from "../../models/SizeModel";
import Carousel from "react-multi-carousel";
import {SimilarItems} from "./component/SimilarItems";

export const ProductCheckoutPage = () => {
    const [suggest, setSuggest] = useState<ProductModel[]>([]);
    const [product, setProduct] = useState<ProductModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [selectedImage, setSelectedImage] = useState<string>("");
    const [quantity, setQuantity] = useState<number>(1);
    const [selectedSize, setSelectedSize] = useState<SizeModel>();
    const [sizeError, setSizeError] = useState<string | null>(null);

    const token = localStorage.getItem("token");
    const headers = {
        'Authorization': `Bearer ${token}`
    }

    const [size, setSize] = useState<SizeModel[]>([]);

    const productId = window.location.pathname.split("/")[2];

    useEffect(() => {
        const fetchProduct = async () => {
            const baseUrl: string = `http://localhost:8888/product/${productId}`;
            const url: string = `${baseUrl}?page=0&size=10`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Something went wrong!");
            }

            const responseJson = await response.json();
            const loadedProduct: ProductModel = {
                productId: responseJson.productId,
                productName: responseJson.productName,
                price: responseJson.price,
                stockQuantity: responseJson.stockQuantity,
                collection: responseJson.collection,
                description: responseJson.description,
                image1: responseJson.image1,
                image2: responseJson.image2,
                image3: responseJson.image3,
                image4: responseJson.image4,
                categoryId: responseJson.categoryId,
                diamondId: responseJson.diamondId,
                shellId: responseJson.shellId,
            };

            const baseUrl2: string = "http://localhost:8888/home";
            const url2: string = `${baseUrl2}?page=0&size=10`;
            const response2 = await fetch(url2);
            if (!response2.ok) {
                throw new Error('Something went wrong!');
            }
            const responseJson2 = await response2.json();
            const responseData = responseJson2.content;
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
                console.log(responseData);
            }

            setSuggest(loadedProducts);
            setIsLoading(false);

            setProduct(loadedProduct);
            setSelectedImage(responseJson.image1);
            setIsLoading(false);
        };
        fetchProduct().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
            console.log(error);
        });
    }, []);

    useEffect(() => {

        const fetchSize = async () => {
            if (!product || !product.categoryId) return;
            const baseUrl: string = `http://localhost:8888/sizes/${product?.categoryId}`;
            const url: string = `${baseUrl}`;
            const response = await fetch(url, {headers: headers});
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();
            const loadedSize: SizeModel[] = [];

            for (const key in responseJson) {
                loadedSize.push({
                    sizeId: responseJson[key].sizeId,
                    valueSize: responseJson[key].valueSize,
                    categoryId: responseJson[key].categoryId
                });
            }

            setSize(loadedSize);
            console.log(responseJson);
            setIsLoading(false);
        };
        fetchSize().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
            console.log(error);
        })
    }, [product]);

    const addToCartHandler = async () => {
        if (!selectedSize) {
            setSizeError('Please select a size.');
            return;
        }
        if (localStorage.getItem("cart") === null) {
            localStorage.setItem("cart", JSON.stringify([]));
            let cart = JSON.parse(localStorage.getItem("cart")!);
            let product = {
                productId: productId,
                quantity: quantity,
                sizeId: selectedSize?.sizeId
            };
            cart.push(product);
            localStorage.setItem("cart", JSON.stringify(cart));
        } else {
            let cart = JSON.parse(localStorage.getItem("cart")!);
            let product = {
                productId: productId,
                quantity: quantity,
                sizeId: selectedSize?.sizeId
            };
            cart.push(product);
            localStorage.setItem("cart", JSON.stringify(cart));
            const event = new CustomEvent('cartUpdated');
            window.dispatchEvent(event);
        }
    };

    if (isLoading) {
        return <SpinnerLoading/>;
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    const handleThumbnailClick = (image: string) => {
        setSelectedImage(image);
    };

    const handleSizeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedSizeId = Number(event.target.value);
        const selectedSize = size.find(s => s.sizeId === selectedSizeId);
        if (selectedSize) {
            setSelectedSize(selectedSize)
        }
        console.log(selectedSize)
    };

    const responsive = {
        superLargeDesktop: {
            // the naming can be any, depends on you.
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
        <div style={{marginTop: "200px", marginBottom: "80px"}} className="container">
            <div className="container d-none d-lg-block w-1000">
                <div className="row mt-5">
                    <div className="col-sm-2 col-md-6 text-center">
                        {selectedImage ? (
                            <img
                                src={`http://localhost:8888/product/load/${selectedImage}.jpg`}
                                style={{width: "455px", height: "390px", border: '1px solid black'}}
                                alt="product"
                            />
                        ) : (
                            <img
                                src={require("./../../Images/PublicImages/hm13-slider-1.png")}
                                className="w-auto h-100 product-image"
                                alt="product"
                            />
                        )}
                        <div className="d-flex justify-content-center mt-3">
                            {product?.image1 && (
                                <>
                                    <img
                                        src={`http://localhost:8888/product/load/${product?.image1}.jpg`}
                                        style={{
                                            width: "106px",
                                            height: "100px",
                                            margin: "5px",
                                            cursor: "pointer",
                                            border: "1px solid black"
                                        }}
                                        alt="thumbnail"
                                        onClick={() => handleThumbnailClick(product?.image1)}
                                    />
                                    <img
                                        src={`http://localhost:8888/product/load/${product?.image2}.jpg`}
                                        style={{
                                            width: "106px",
                                            height: "100px",
                                            margin: "5px",
                                            cursor: "pointer",
                                            border: "1px solid black"
                                        }}
                                        alt="thumbnail"
                                        onClick={() => handleThumbnailClick(product?.image2)}
                                    />
                                    <img
                                        src={`http://localhost:8888/product/load/${product?.image3}.jpg`}
                                        style={{
                                            width: "106px",
                                            height: "100px",
                                            margin: "5px",
                                            cursor: "pointer",
                                            border: "1px solid black"
                                        }}
                                        alt="thumbnail"
                                        onClick={() => handleThumbnailClick(product?.image3)}
                                    />
                                    <img
                                        src={`http://localhost:8888/product/load/${product?.image4}.jpg`}
                                        style={{
                                            width: "106px",
                                            height: "100px",
                                            margin: "5px",
                                            cursor: "pointer",
                                            border: "1px solid black"
                                        }}
                                        alt="thumbnail"
                                        onClick={() => handleThumbnailClick(product?.image4)}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                    <div className="col-md-6 col-4 container">
                        <div className="ml-2">
                            <h2 style={{fontSize: "30px", paddingLeft: "0"}}>
                                {product?.productName}
                            </h2>
                            <p
                                style={{
                                    fontWeight: "bolder",
                                    fontSize: "20px",
                                    color: "red",
                                }}
                            >
                                Price: ${product?.price}
                            </p>
                            <p>{product?.description}</p>
                            <p>Stock Quantity: {product?.stockQuantity}</p>
                            <StarsReview rating={2.5} size={20}/>
                            <div className="form-outline mt-3" style={{display: 'flex', alignItems: 'center'}}>
                                <label className="form-label" htmlFor="typeNumber">Select Quantity:</label>
                                <input
                                    style={{width: '70px', marginLeft: '10px', outline: 'none', boxShadow: 'none'}}
                                    type="number"
                                    id="typeNumber"
                                    className="form-control"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value as unknown as number)}
                                />
                            </div>
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <DiamondTable product={product}/>
                                <ShellTable product={product}/>
                            </div>
                            <select style={{width: '200px', outline: 'none', boxShadow: 'none'}} className="form-select"
                                    aria-label="Default select example"
                                    onChange={handleSizeSelect}>
                                <option selected>Choose size...</option>
                                {size.map((size) => (
                                    <option key={size.sizeId} value={size.sizeId}>
                                        {size.valueSize}
                                    </option>
                                ))}
                            </select>
                            {sizeError && <p style={{color: 'red'}}>{sizeError}</p>}
                            <button
                                style={{borderRadius: '0'}}
                                className="btn btn-success mt-3 w-100"
                                onClick={addToCartHandler}
                            >
                                ADD TO CART
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/*<div className="container d-lg-none mt-5">*/}
            {/*    <div className="d-flex justify-content-center align-items-center">*/}
            {/*        {selectedImage ? (*/}
            {/*            <img*/}
            {/*                src={`http://localhost:8888/product/load/${selectedImage}.jpg`}*/}
            {/*                className="product-image"*/}
            {/*                alt="product"*/}
            {/*                style={{width: "340px", height: "340px", border: "1px solid black"}}*/}
            {/*            />*/}
            {/*        ) : (*/}
            {/*            <img*/}
            {/*                src={require("./../../Images/PublicImages/hm13-slider-1.png")}*/}
            {/*                className="w-auto h-100 product-image"*/}
            {/*                alt="product"*/}
            {/*            />*/}
            {/*        )}*/}
            {/*    </div>*/}
            {/*    <div className="d-flex justify-content-center mt-3">*/}
            {/*        {product?.image1 && (*/}
            {/*            <>*/}
            {/*                <img*/}
            {/*                    src={`http://localhost:8888/product/load/${product?.image1}.jpg`}*/}
            {/*                    style={{*/}
            {/*                        width: "80px",*/}
            {/*                        height: "80px",*/}
            {/*                        margin: "5px",*/}
            {/*                        cursor: "pointer",*/}
            {/*                        border: "1px solid black"*/}
            {/*                    }}*/}
            {/*                    alt="thumbnail"*/}
            {/*                    onClick={() => handleThumbnailClick(product.image1)}*/}
            {/*                />*/}
            {/*                <img*/}
            {/*                    src={`http://localhost:8888/product/load/${product?.image2}.jpg`}*/}
            {/*                    style={{*/}
            {/*                        width: "80px",*/}
            {/*                        height: "80px",*/}
            {/*                        margin: "5px",*/}
            {/*                        cursor: "pointer",*/}
            {/*                        border: "1px solid black"*/}
            {/*                    }}*/}
            {/*                    alt="thumbnail"*/}
            {/*                    onClick={() => handleThumbnailClick(product.image1)}*/}
            {/*                />*/}
            {/*                <img*/}
            {/*                    src={`http://localhost:8888/product/load/${product?.image3}.jpg`}*/}
            {/*                    style={{*/}
            {/*                        width: "80px",*/}
            {/*                        height: "80px", margin: "5px", cursor: "pointer", border: "1px solid black"*/}
            {/*                    }}*/}
            {/*                    alt="thumbnail"*/}
            {/*                    onClick={() => handleThumbnailClick(product.image1)}*/}
            {/*                />*/}
            {/*                <img*/}
            {/*                    src={`http://localhost:8888/product/load/${product?.image4}.jpg`}*/}
            {/*                    style={{*/}
            {/*                        width: "80px",*/}
            {/*                        height: "80px",*/}
            {/*                        margin: "5px",*/}
            {/*                        cursor: "pointer",*/}
            {/*                        border: "1px solid black"*/}
            {/*                    }}*/}
            {/*                    alt="thumbnail"*/}
            {/*                    onClick={() => handleThumbnailClick(product.image1)}*/}
            {/*                />*/}
            {/*            </>*/}
            {/*        )}*/}
            {/*    </div>*/}

            {/*    <div className="mt-4">*/}
            {/*        <div className="ml-2">*/}
            {/*            <h2>{product?.productName}</h2>*/}
            {/*            <p style={{fontWeight: 'bolder', color: 'red'}}>Giá: ${product?.price}</p>*/}
            {/*            <p>{product?.description}</p>*/}
            {/*            <p>Stock Quantity: {product?.stockQuantity}</p>*/}
            {/*            <StarsReview rating={2.5} size={20}/>*/}
            {/*            <input*/}
            {/*                style={{width: '70px', marginLeft: '10px'}}*/}
            {/*                type="number"*/}
            {/*                id="typeNumber"*/}
            {/*                className="form-control"*/}
            {/*                min="1"*/}
            {/*                value={quantity}*/}
            {/*                onChange={(e) => setQuantity(e.target.value as unknown as number)}*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <hr/>*/}
            {/*</div>*/}

            <>
                <div className='container mt-5' style={{height: 550}}>
                    <div className='homepage-carousel-title'>
                        <h1 style={{fontSize: '45px', marginBottom: '0'}} className='custom-heading'>Similar Items</h1>
                    </div>
                    <Carousel responsive={responsive} className='mt-5'>
                        {suggest.slice(0, 4).map((product) => (
                            <SimilarItems key={product.productId} product={product}/>
                        ))}
                    </Carousel>
                </div>
            </>

        </div>
    );
};
