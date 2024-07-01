import React, {useEffect, useState} from "react";
import ProductModel from "../../models/ProductModel";
import {ProductItem} from "./component/ProductItem";
import {Paging} from "../Utils/Paging";
import {SpinnerLoading} from "../Utils/SpinnerLoading";
import {AddProduct} from "./component/AddProduct";

interface ProductData {
    productId: string;
    collection: string;
    description: string;
    image_1: string;
    image_2: string;
    image_3: string;
    image_4: string;
    price: number;
    product_name: string;
    stock_quantity: number;
    category_id: number;
    shell_id: number;
}

export const Product = () => {
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalAmountOfProducts, setTotalAmountOfProducts] = useState(0);
    const [productsPerPage] = useState(8);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [searchCategory, setSearchCategory] = useState('All Category');
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [formData, setFormData] = useState<ProductData>({
        productId: '',
        collection: '',
        description: '',
        image_1: '',
        image_2: '',
        image_3: '',
        image_4: '',
        price: 0,
        product_name: '',
        stock_quantity: 0,
        category_id: 0,
        shell_id: 0,
    });

    const headers = localStorage.getItem('token');

    useEffect(() => {
        const fetchProducts = async () => {
            const baseUrl: string = "http://localhost:8888/home";
            let url: string = '';
            if (searchUrl === '') {
                url = `${baseUrl}/search-by-name?page=${currentPage - 1}&size=${productsPerPage}&keyword=${search}`;
            } else {
                let searchWithPage = searchUrl.replace('<pageNumber>', `${currentPage - 1}`);
                url = baseUrl + searchWithPage;
            }

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${headers}`
                }
            });

            const responseJson = await response.json();
            const responseData = responseJson.content;
            console.log(responseJson);
            setTotalAmountOfProducts(responseJson.totalElements)
            setTotalPages(responseJson.totalPages);

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

    const toggleAddModal = () => {
        setFormData({
            productId: '',
            collection: '',
            description: '',
            image_1: '',
            image_2: '',
            image_3: '',
            image_4: '',
            price: 0,
            product_name: '',
            stock_quantity: 0,
            category_id: 0,
            shell_id: 0,
        });
        setIsAddingNew(!isAddingNew);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8888/manage/promotion/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${headers}`
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setIsAddingNew(false);
            } else {
                console.error('Failed to create promotion');
            }
        } catch (error) {
            console.error('Error creating promotion: ', error);
        }
    };

    const searchHandleChange = () => {
        setCurrentPage(1);
        if (search === '') {
            setSearchUrl('');
        } else {
            setSearchUrl(`/search-by-name?keyword=${search}&page=<pageNumber>&size=${productsPerPage}`)
        }
        setSearchCategory('All Category')
    }

    const searchCategoryHandleChange = (value: string) => {
        setCurrentPage(1);
        if (
            value.toLowerCase() === 'engagement rings' ||
            value.toLowerCase() === 'wedding bands' ||
            value.toLowerCase() === 'men diamond ring' ||
            value.toLowerCase() === 'necklaces' ||
            value.toLowerCase() === 'earrings' ||
            value.toLowerCase() === 'bracelets'
        ) {
            setSearchCategory(value);
            setSearchUrl(`/by-category-sorted-by-price?categoryName=${value}&page=<pageNumber>&size=${productsPerPage}`)
        } else {
            setSearchCategory('All Category');
            setSearchUrl(`?page=<pageNumber>&size=${productsPerPage}`);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
        console.log(name + ':   ' + value)
    };

    const handleDelete = async (promotionId: string) => {
        try {
            const response = await fetch(`http://localhost:8888/manage/promotion/delete/${promotionId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${headers}`
                }
            });
            if (response.ok) {

            } else {
                console.error('Failed to delete promotion');
            }
        } catch (error) {
            console.error('Error deleting promotion: ', error);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8888/manage/promotion/update ', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${headers}`
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setIsUpdating(false);
            } else {
                console.error('Failed to update promotion');
            }
        } catch (error) {
            console.error('Error update promotion: ', error);
        }
    };


    const indexOfLastProducts: number = currentPage * productsPerPage;
    const indexOfFirstProduct: number = indexOfLastProducts - productsPerPage;
    let lastItem = productsPerPage * currentPage <= totalAmountOfProducts ?
        productsPerPage * currentPage : totalAmountOfProducts;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


    return (
        <div>
            <div className='container'>
                <div className="mb-4 mt-5 d-flex justify-content-between align-items-center">
                    <h2 className="text-dark">Product</h2>
                    <button onClick={() => setIsAddingNew(true)} className="btn btn-primary">
                        New Product
                    </button>
                </div>
                <div className='row mt-5 ms-4'>
                    <div style={{width: '300px'}} className='col-6'>
                        <div className='d-flex'>
                            <input className='form-control me-2 w-auto' type='search'
                                   placeholder='Search' aria-labelledby='Search'
                                   onChange={e => setSearch(e.target.value)}/>
                            <button className='btn btn-outline-dark' onClick={() => searchHandleChange()}>Search
                            </button>
                        </div>
                    </div>
                    <div className='col-4'>
                        <div className='dropdown'>
                            <button className='btn btn-outline-dark dropdown-toggle' type='button'
                                    id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded='false'
                            >
                                {searchCategory}
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <li onClick={() => searchCategoryHandleChange('All')}>
                                    <a className="dropdown-item">
                                        All category
                                    </a>
                                </li>
                                <li onClick={() => searchCategoryHandleChange('Engagement Rings')}>
                                    <a className="dropdown-item">
                                        Engagement Rings </a>
                                </li>
                                <li onClick={() => searchCategoryHandleChange('wedding bands')}>
                                    <a className="dropdown-item">
                                        Wedding Bands
                                    </a>
                                </li>
                                <li onClick={() => searchCategoryHandleChange('men diamond ring')}>
                                    <a className="dropdown-item">
                                        Men diamond ring
                                    </a>
                                </li>
                                <li onClick={() => searchCategoryHandleChange('women diamond ring')}>
                                    <a className="dropdown-item">
                                        Women diamond ring
                                    </a>
                                </li>
                                <li onClick={() => searchCategoryHandleChange('necklaces')}>
                                    <a className="dropdown-item">
                                        Necklaces
                                    </a>
                                </li>
                                <li onClick={() => searchCategoryHandleChange('earrings')}>
                                    <a className="dropdown-item">
                                        Earrings
                                    </a>
                                </li>
                                <li onClick={() => searchCategoryHandleChange('bracelets')}>
                                    <a className="dropdown-item">
                                        Bracelets
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    {totalAmountOfProducts > 0 ?
                        <>
                            <p></p>
                            {products.map(product => (
                                <ProductItem product={product} key={product.productId}/>
                            ))}
                        </>
                        :
                        <div className='m-5'>
                            <h3>Can't find what you are looking for?</h3>
                            <a type='button' className='btn main-color btn-md px-4 me-md-2 fw-bold text-black' href='#'>Library
                                Services</a>
                        </div>
                    }
                    {totalPages > 1 &&
                        <Paging currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>
                    }

                    <AddProduct
                        isOpen={isAddingNew}
                        onClose={toggleAddModal}
                        onSubmit={handleSubmit}
                        formData={formData}
                        handleChange={handleChange}
                    />
                </div>
            </div>
        </div>


    );
}