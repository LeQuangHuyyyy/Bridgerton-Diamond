import ProductModel from "../../../models/ProductModel";
import {NavLink} from "react-router-dom";
import {useState} from "react";
import './ReturnProducts.css';
export const ReturnProducts: React.FC<{ product: ProductModel }> = (props) => {
    const [hovered, setHovered] = useState(false);

    const handleHover = () => {
        setHovered(true);
    };

    const handleLeave = () => {
        setHovered(false);
    };
    return (
        <NavLink to={`/detail/${props.product.productId}`} className='card text-decoration-none border-0 shadow-none' style={{height: '380px', borderRadius: '0'}}>
            <div style={{padding: '0'}} className={`text-center card-body ${hovered ? 'hovered' : ''}`} onMouseEnter={handleHover} onMouseLeave={handleLeave}>
                <img
                    className='product-image'
                    src={hovered ? props.product.image2 :
                        props.product.image1}
                    alt="product image"
                />
                <div>
                    <h2 className='product-name-homepage'
                    style={{fontWeight: '600'}}>{props.product.productName.length > 51 ? <h2 className='product-name-homepage'>{props.product.productName.substring(0,51)}...</h2>
                    : <h2 className='product-name-homepage'>{props.product.productName}</h2>}</h2>
                    <p className='price-homepage'>${props.product.price}</p>
                </div>
            </div>
        </NavLink>
    );
}
