import ProductModel from "../../../models/ProductModel";
import {NavLink} from "react-router-dom";
import './ReturnProducts.css';

export const ReturnProducts: React.FC<{ product: ProductModel }> = (props) => {
    return (
        <NavLink to={`/detail/${props.product.productId}`} className='card text-decoration-none border-0' style={{
            height: '380px',
            borderRadius: '10px',
            boxShadow: 'rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px',
            marginBottom: '20px'
        }}>
            <div style={{padding: '0'}} className='text-center card-body '>
                <img
                    className='product-image'
                    src={props.product.image1}
                    alt="product image"
                />
                <div>
                    <h2 className='product-name-homepage'
                        style={{fontWeight: '600'}}>{props.product.productName.length > 51 ?
                        <h2 className='product-name-homepage'>{props.product.productName.substring(0, 51)}...</h2>
                        : <h2 className='product-name-homepage'>{props.product.productName}</h2>}</h2>
                    <p className='price-homepage'>${props.product.price}</p>
                </div>
            </div>
        </NavLink>
    );
}
