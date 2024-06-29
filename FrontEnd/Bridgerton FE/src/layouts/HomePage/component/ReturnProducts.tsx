import ProductModel from "../../../models/ProductModel";
import {Link, NavLink} from "react-router-dom";

export const ReturnProducts: React.FC<{ product: ProductModel }> = (props) => {
    return (
        <NavLink to={`/detail/${props.product.productId}`} className='card' style={{height: '420px'}}>
            <div className='text-center'>
                {props.product.image1 ?
                    <img
                        className='product-image'
                        src={`http://localhost:8888/product/load-image/${props.product.image1}.jpg`}
                        alt="product image"
                    />
                    :
                    <img
                        className='product-image'
                        src={'https://i.pinimg.com/564x/f2/7c/89/f27c899fee5b10ffdcce5b57c7a4e111.jpg'}
                        alt='product image'
                    />
                }
                <h2 className='mt-2 text-dark'
                    style={{fontSize: '15px', fontWeight: '600'}}>{props.product.productName}</h2>
                <p className='price' style={{fontWeight: 'bolder'}}>${props.product.price}</p>
                <p>
                    <Link className='btn-add-to-cart text-decoration-none text-center'
                          to={`/detail/${props.product.productId}`}>View Product</Link>
                </p>
            </div>
        </NavLink>
    );
}
