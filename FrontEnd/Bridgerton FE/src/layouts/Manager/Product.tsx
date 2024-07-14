import React, {useEffect, useState} from "react";
import ProductModel from "../../models/ProductModel";
import {SpinnerLoading} from "../Utils/SpinnerLoading";
import {AddProduct} from "./component/AddProduct";
import {Button, Image, message, Table} from "antd";
import productModel from "../../models/ProductModel";

interface ProductData {
    productId: number;
    collection: string;
    description: string;
    image1: File | string;
    image2: File | string;
    image3: File | string;
    image4: File | string;
    price: number;
    productName: string;
    stockQuantity: number;
    categoryId: number;
    diamondId: number;
    shellId: number;
    warrantyImage: string,
    certificateImage: string,
}

interface Diamond {
    diamondId: number;
    name: string;
    carat: number;
    color: string;
    clarity: string;
    cut: string;
}

export const Product = () => {
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalAmountOfProducts, setTotalAmountOfProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [searchCategory, setSearchCategory] = useState('All Category');
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [diamonds, setDiamonds] = useState<Diamond[]>([]);
    const [product, setProduct] = useState<ProductModel>();
    const [formData, setFormData] = useState<ProductData>({
        productId: 0,
        collection: '',
        description: '',
        image1: '',
        image2: '',
        image3: '',
        image4: '',
        price: 0,
        productName: '',
        stockQuantity: 0,
        categoryId: 0,
        diamondId: 0,
        shellId: 0,
        certificateImage: '',
        warrantyImage: ''
    });


    const headers = localStorage.getItem('token');

    useEffect(() => {
        fetchProducts ();
    }, [currentPage, searchUrl]);

    const fetchProducts = async () => {
        const baseUrl: string = "https://deploy-be-b176a8ceb318.herokuapp.com/home";
        let url: string = '';
        if (searchUrl === '') {
            url = `${baseUrl}/search-by-name?keyword=${search}`;
        } else {
            url = baseUrl;
        }

        try {
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${headers}`
                }
            });

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();
            const responseData = responseJson.content;
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
                    shellId: responseData[key].shellId,
                    certificateImage: responseData[key].certificateImage,
                    warrantyImage: responseData[key].warrantyImage,
                });
            }
            setProducts(loadedProducts);
            setIsLoading(false);
            window.scrollTo(0, 0);
        } catch (error: any) {
            setIsLoading(true);
            message.error('Failed to fetch products');
        }
    };

    fetchProducts().catch((error: any) => {
        setIsLoading(false);
        setHttpError(error.message);
    });



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
            productId: 0,
            collection: '',
            description: '',
            image1: '',
            image2: '',
            image3: '',
            image4: '',
            price: 0,
            productName: '',
            stockQuantity: 0,
            categoryId: 0,
            diamondId: 0,
            shellId: 0,
            certificateImage: '',
            warrantyImage: ''
        });
        setIsAddingNew(!isAddingNew);
    }

    // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const {name, files} = e.target;
    //     if (files && files.length > 0) {
    //         const fileName = files[0].name;
    //         console.log(name + ':    ' + files[0].name)
    //         setFormData((prevFormData) => ({
    //             ...prevFormData,
    //             [name]: files[0],
    //         }));
    //
    //         switch (name) {
    //             case 'image1':
    //                 setImage1(fileName);
    //                 break;
    //             case 'image2':
    //                 setImage2(fileName);
    //                 break;
    //             case 'image3':
    //                 setImage3(fileName);
    //                 break;
    //             case 'image4':
    //                 setImage4(fileName);
    //                 break;
    //             default:
    //                 break;
    //         }
    //     }
    // };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, files} = e.target;
        if (files && files[0]) {
            setFormData({
                ...formData,
                [name]: files[0]
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent, product: productModel) => {
        e.preventDefault();
        console.log('product: ', product)
        try {
            const requestBody = {
                productId: '',
                collection: product.collection,
                description: product.description,
                image1: product.image1,
                image2: product.image2,
                image3: product.image3,
                image4: product.image4,
                price: product.price,
                productName: product.productName,
                stockQuantity: product.stockQuantity,
                categoryId: product.categoryId,
                shellId: product.shellId,
                certificateImage: product.certificateImage,
                warrantyImage: product.warrantyImage,
            }

            const createProduct = await fetch('https://deploy-be-b176a8ceb318.herokuapp.com/product/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${headers}`
                },
                body: JSON.stringify(requestBody)
            });
            if (createProduct.ok) {
                setIsAddingNew(false);
                message.success('Product created successfully');
            } else {
                message.error('Failed to create product');
            }

        } catch (error) {
            console.error('Error creating product: ', error);
        }
    };

    const searchHandleChange = () => {
        setCurrentPage(1);
        if (search === '') {
            setSearchUrl('');
        } else {
            setSearchUrl(`/search-by-name?keyword=${search}`)
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
            setSearchUrl(`/by-category-sorted-by-price?categoryName=${value}`)
        } else {
            setSearchCategory('All Category');
            setSearchUrl(``);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };




    // const handleUpdate = async (e: React.FormEvent) => {
    //     e.preventDefault();
    //     try {
    //         const response = await fetch('https://deploy-be-b176a8ceb318.herokuapp.com/manage/promotion/update ', {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${headers}`
    //             },
    //             body: JSON.stringify(formData)
    //         });
    //         if (response.ok) {
    //             setIsUpdating(false);
    //         } else {
    //             console.error('Failed to update promotion');
    //         }
    //     } catch (error) {
    //         console.error('Error update promotion: ', error);
    //     }
    // };


    const columns = [
        {
            title: 'Image',
            dataIndex: 'image1',
            key: 'image1',
            render: (text: string) => (
                <Image
                    width={100}
                    src={text}
                    alt='product image'
                />
            ),
        },
        {
            title: 'Product Name',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (text: number) => (
                <span style={{fontWeight: 'bolder'}}>${text}</span>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text: string) => (
                <span style={{textAlign: 'center'}}>${text}</span>
            ),
        },
        {
            title: 'Quantity',
            dataIndex: 'stockQuantity',
            key: 'stockQuantity',
            render: (text: number) => (
                <span>{text}</span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: string, record: ProductModel) => (
                <Button type="primary" danger>
                    Delete
                </Button>
            ),
        },
    ];
    return (
        <div>

            <div className='container'>
                <div className="mb-4 d-flex justify-content-between align-items-center">
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
                            <Table dataSource={products} columns={columns} rowKey="productId"/>
                        </>
                        :
                        <div className='m-5'>
                            <h3>Can't find what you are looking for?</h3>
                        </div>
                    }
                    <AddProduct
                        isOpen={isAddingNew}
                        onClose={toggleAddModal}
                        onSubmit={handleSubmit}
                        formData={formData}
                        handleChange={handleChange}
                        handleFileChange={handleFileChange}
                    />
                </div>
            </div>
        </div>


    );
}