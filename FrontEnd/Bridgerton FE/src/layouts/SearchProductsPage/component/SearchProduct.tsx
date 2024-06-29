import ProductModel from "../../../models/ProductModel";
import {Link} from "react-router-dom";

export const SearchProduct: React.FC<{ product: ProductModel }> = (props) => {
    return (
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded col-2'
             style={{
                 width: '300px',
                 height: '420px'
             }}
        >
            <Link className="text-decoration-none text-dark" to={`/detail/${props.product.productId}`}>
                <div className='text-center pb-2'>
                    {props.product.image1 ?
                        <img
                            className='product-image'
                            src={`http://localhost:8888/product/load-image/${props.product.image1}.jpg`}
                            alt='product image'
                        />
                        :
                        <img
                            className='product-image'
                            src={'https://i.pinimg.com/564x/f2/7c/89/f27c899fee5b10ffdcce5b57c7a4e111.jpg'}
                            alt="product image"
                        />
                    }
                    <h2 className='card-title'
                        style={{fontSize: '15px', fontWeight: '600'}}>
                        {props.product.productName}
                    </h2>
                    <p className='price text-center'><small className='text-muted'
                                                            style={{fontWeight: 'bolder'}}>${props.product.price}</small>
                    </p>
                </div>
                <p>
                    <Link className='btn-add-to-cart text-decoration-none text-center'
                          to={`/detail/${props.product.productId}`}>View Product</Link>
                </p>
            </Link>
        </div>
    );
}