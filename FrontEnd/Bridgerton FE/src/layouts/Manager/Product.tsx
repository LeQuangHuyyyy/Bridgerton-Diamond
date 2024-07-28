import React, {useEffect, useState} from "react";
import {SpinnerLoading} from "../Utils/SpinnerLoading";
import {AddProduct} from "./component/AddProduct";
import {UpdateProduct} from "./component/UpdateProduct";
import {Button, Image, message, Pagination, Table} from "antd";
import ProductModel from "../../models/ProductModel";
import {EditOutlined} from "@ant-design/icons";

const token = localStorage.getItem('token');
const headers = {
    'Authorization': `Bearer ${token}`
}

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
        const fetchProducts = async () => {
            const baseUrl: string = "https://deploy-be-b176a8ceb318.herokuapp.com/home";
            let url: string = '';
            if (searchUrl === '') {
                url = `${baseUrl}/search-by-name?keyword=${search}&page=${currentPage - 1}`;
            } else {
                url = `${baseUrl}${searchUrl}&page=${currentPage - 1}`;
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
                setTotalAmountOfProducts(responseJson.totalElements);
                setTotalPages(responseJson.totalPages);
                console.log(responseData)
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
                        diamondId: responseData[key].diamonds[0].diamondId,
                        shellId: responseData[key].shellId,
                        certificateImage: responseData[key].certificateImage,
                        warrantyImage: responseData[key].warrantyImage,
                    });
                }
                setProducts(loadedProducts);
                setIsLoading(false);
            } catch (error: any) {
                setIsLoading(true);
                message.error('Failed to fetch products');
            }
        };

        fetchProducts().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        });
    }, [currentPage, searchUrl, isUpdating]);


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

    const toggleUpdateModal = () => {
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
        setIsUpdating(false)
    }

    const handleToEdit = (e: React.FormEvent, record: ProductModel) => {
        const productToEdit = products.find(product => product.productId === record.productId);
        if (productToEdit) {
            setFormData(productToEdit);
            setIsUpdating(!isUpdating);
        }
    }

    const handleUpdate = async (e: React.FormEvent, product: ProductModel) => {
        e.preventDefault();
        try {
            const requestBody = {
                productId: product.productId,
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
                diamondId: product.diamondId
            }

            const createProduct = await fetch('https://deploy-be-b176a8ceb318.herokuapp.com/product/update', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${headers}`
                },
                body: JSON.stringify(requestBody)
            });

            if (createProduct.ok) {
                setIsAddingNew(false);
                message.success('Product update successfully');
                setIsUpdating(false)
            } else {
                message.error('Failed to update product');
                console.log(requestBody)
                setIsUpdating(false)
            }


        } catch (error) {
            console.error('Error update product: ', error);
        }
    };


    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, files} = e.target;
        if (files && files[0]) {
            setFormData({
                ...formData,
                [name]: files[0]
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent, product: ProductModel) => {
        e.preventDefault();
        try {
            const requestBody = {
                productId: 0,
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
                diamondId: product.diamondId
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
                console.log(requestBody)
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
            value === 'Engagement Rings' ||
            value === 'Wedding Bands' ||
            value === 'Women diamond ring' ||
            value === 'Men diamond ring' ||
            value === 'Diamond Necklaces' ||
            value === 'Diamond Earrings' ||
            value === 'Diamond Bracelets'
        ) {
            setSearchCategory(value);
            setSearchUrl(`/by-category-sorted-by-price?categoryName=${value}`)
        } else {
            setSearchCategory('All category');
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

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };


    const columns = [
        {
            title: 'ID',
            dataIndex: 'productId',
            key: 'productId',
            className: 'text-center',
        },
        {
            title: 'Image',
            dataIndex: 'image1',
            key: 'image1',
            className: 'text-center',
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
            className: 'text-center',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            className: 'text-center',
            render: (text: number) => (
                <span style={{fontWeight: 'bolder'}}>${text.toLocaleString()}</span>
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            className: 'text-center',
            render: (text: string) => (
                <span style={{textAlign: 'center'}}>{text}</span>
            ),
        },
        {
            title: 'Quantity',
            dataIndex: 'stockQuantity',
            key: 'stockQuantity',
            className: 'text-center',
            render: (text: number) => (
                <span>{text}</span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (record: ProductModel) => (
                <>
                    <Button onClick={(event) => handleToEdit(event, record)}>
                        <EditOutlined/>
                    </Button>
                </>

            ),
        },
    ];
    return (
        <div>
            <div className='container'>
                <div className='row ms-4'>
                    <div style={{width: '300px'}} className='col-6'>
                        <div
                            className='d-flex'>
                            <input
                                style={{borderRadius: '0', marginTop: 0}}
                                className='form-control me-2 w-auto' type='search'
                                placeholder='Search' aria-labelledby='Search'
                                onChange={e => setSearch(e.target.value)}/>
                            <button
                                style={{borderRadius: '0', height: '38px'}}
                                className='btn btn-outline-dark' onClick={() => searchHandleChange()}>Search
                            </button>
                        </div>

                    </div>
                    <div className='col-4 mb-3'>
                        <div className='dropdown'>
                            <button style={{borderRadius: '0'}} className='btn btn-outline-dark dropdown-toggle'
                                    type='button'
                                    id='dropdownMenuButton1' data-bs-toggle='dropdown' aria-expanded='false'
                            >
                                {searchCategory}
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <li onClick={() => searchCategoryHandleChange('All category')}>
                                    <a className="dropdown-item">
                                        All category
                                    </a>
                                </li>
                                <li onClick={() => searchCategoryHandleChange('Engagement Rings')}>
                                    <a className="dropdown-item">
                                        Engagement Rings </a>
                                </li>
                                <li onClick={() => searchCategoryHandleChange('Wedding Bands')}>
                                    <a className="dropdown-item">
                                        Wedding Bands
                                    </a>
                                </li>
                                <li onClick={() => searchCategoryHandleChange('Men diamond ring')}>
                                    <a className="dropdown-item">
                                        Men diamond ring
                                    </a>
                                </li>
                                <li onClick={() => searchCategoryHandleChange('Women diamond ring')}>
                                    <a className="dropdown-item">
                                        Women diamond ring
                                    </a>
                                </li>
                                <li onClick={() => searchCategoryHandleChange('Diamond Necklaces')}>
                                    <a className="dropdown-item">
                                        Necklaces
                                    </a>
                                </li>
                                <li onClick={() => searchCategoryHandleChange('Diamond Earrings')}>
                                    <a className="dropdown-item">
                                        Earrings
                                    </a>
                                </li>
                                <li onClick={() => searchCategoryHandleChange('Diamond Bracelets')}>
                                    <a className="dropdown-item">
                                        Bracelets
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <h2 style={{fontSize: 45}} className="custom-heading text-center mt-2">Product Management</h2>

                    <button style={{width: 150, marginLeft: 20, borderRadius: '0'}} onClick={() => setIsAddingNew(true)}
                            className="btn btn-outline-success">
                        New Product
                    </button>
                    {totalAmountOfProducts > 0 ?
                        <>
                            <Table dataSource={products} columns={columns} rowKey="productId"
                                   pagination={false}/>
                            <Pagination
                                current={currentPage}
                                total={totalAmountOfProducts}
                                pageSize={10}
                                onChange={handlePageChange}
                                showSizeChanger={false}

                                style={{textAlign: 'end', marginTop: '20px'}}
                            />
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
                    <UpdateProduct
                        isOpen={isUpdating}
                        onClose={toggleUpdateModal}
                        onSubmit={handleUpdate}
                        formData={formData}
                        handleChange={handleChange}
                        handleFileChange={handleFileChange}
                    />
                </div>
            </div>
        </div>
    );
}
