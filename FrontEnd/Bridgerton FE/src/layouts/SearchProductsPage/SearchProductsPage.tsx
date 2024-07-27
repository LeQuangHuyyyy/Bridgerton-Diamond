import React, {useEffect, useState} from "react";
import ProductModel from "../../models/ProductModel";
import {SearchProduct} from "./component/SearchProduct";
import {Paging} from "../Utils/Paging";
import {SpinnerLoading} from "../Utils/SpinnerLoading";

export const SearchProductsPage = () => {
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalAmountOfProducts, setTotalAmountOfProducts] = useState(0);
    const [productsPerPage] = useState(12);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [searchCategory, setSearchCategory] = useState('All Category');

    const token = localStorage.getItem('token');
    const headers = {
        'Authorization': `Bearer ${token}`
    }
    useEffect(() => {
        const fetchProducts = async () => {
            const baseUrl: string = "https://deploy-be-b176a8ceb318.herokuapp.com/home";
            let url: string = '';
            if (searchUrl === '') {
                url = `${baseUrl}/search-by-name?page=${currentPage - 1}&size=${productsPerPage}&keyword=${search}`;
            } else {
                let searchWithPage = searchUrl.replace('<pageNumber>', `${currentPage - 1}`);
                url = baseUrl + searchWithPage;
            }

            const response = await fetch(url, {headers: headers});

            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

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
                    shellId: responseData[key].shellId,
                    certificateImage: responseData[key].certificateImage,
                    warrantyImage: responseData[key].warrantyImage,
                    diamondId: responseData[key].diamondId
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

    const searchHandleChange = () => {
        setCurrentPage(1);
        if (search === '') {
            setSearchUrl('');
        } else {
            setSearchUrl(`/search-by-name?keyword=${search}&page=<pageNumber>&size=${productsPerPage}`)
        }
        setSearchCategory('Category')
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
            setSearchUrl(`/by-category-sorted-by-price?categoryName=${value}&page=<pageNumber>&size=${productsPerPage}`)
        } else {
            setSearchCategory('All Category');
            setSearchUrl(`?page=<pageNumber>&size=${productsPerPage}`);
        }
    }

    const indexOfLastProducts: number = currentPage * productsPerPage;
    const indexOfFirstProduct: number = indexOfLastProducts - productsPerPage;
    let lastItem = productsPerPage * currentPage <= totalAmountOfProducts ?
        productsPerPage * currentPage : totalAmountOfProducts;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    return (
        <div>
            <div>
                <div className="row g-0 mt-5">
                    <div className="col-sm-6 col-md-6">
                        <div>
                            <img className="col-image-left-search"
                                 src={'https://www.cartier.com/on/demandware.static/-/Library-Sites-CartierSharedLibrary-BGTJ/default/dw009b40c2/plp/High%20Jewellery/all-creations/le-voyage-recommence/header/1.%20TEST%20ONE%20PILEO_header.jpg'}
                                 alt='hero1'></img>
                        </div>
                    </div>
                    <div
                        style={{backgroundColor: '#F9F9F9'}}
                        className="col-4 col-md-6 container d-flex justify-content-center align-items-center custom-container">
                        <div style={{marginLeft: '100px',marginRight: '100px'}} className="ml-2">
                            <h1 className="custom-heading">Le Voyage Recommencé</h1>
                            <p style={{marginTop:'20px'}} className="custom-paragraph-search">
                                Our diamonds exemplify exceptional quality and timeless elegance. With brilliant cuts and flawless clarity, each piece reflects our dedication to perfection. Discover Bridgerton's refined beauty, where every gem tells a story of elegance and excellence.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='container'>
                <div className='row mt-5'>
                    <div style={{width: '300px'}} className='col-6'>
                        <div
                            className='d-flex'>
                            <input
                                style={{borderRadius: '0'}}
                                className='form-control me-2 w-auto' type='search'
                                placeholder='Search' aria-labelledby='Search'
                                onChange={e => setSearch(e.target.value)}/>
                            <button
                                style={{borderRadius: '0'}}
                                className='btn btn-outline-dark' onClick={() => searchHandleChange()}>Search
                            </button>
                        </div>
                    </div>
                    <div className='col-4'>
                        <div className='dropdown'>
                            <button
                                style={{borderRadius: '0'}}
                                className='btn btn-outline-dark dropdown-toggle' type='button'
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
                                        Necklace
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
                    {totalAmountOfProducts > 0 ?
                        <>
                            <div className='mt-3'>
                                <h5 className='paginate-totalAmount'>Number of results: ({totalAmountOfProducts})</h5>
                            </div>
                            <p className='paginate-totalAmount'>
                                {indexOfFirstProduct + 1} to {lastItem} of {totalAmountOfProducts} results
                            </p>
                            {products.map(product => (
                                <SearchProduct product={product} key={product.productId}/>
                            ))}
                        </>
                        :
                        <div className='m-5'>
                            <h3>No results found</h3>
                        </div>
                    }
                    {totalPages > 1 &&
                        <Paging currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>
                    }
                </div>
            </div>
        </div>
    );
}