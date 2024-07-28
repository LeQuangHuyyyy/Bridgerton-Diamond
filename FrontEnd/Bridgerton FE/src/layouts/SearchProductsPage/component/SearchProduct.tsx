import ProductModel from "../../../models/ProductModel";
import {Link} from "react-router-dom";
import {useState} from "react";
import './SearchProduct.css';

export const SearchProduct: React.FC<{ product: ProductModel }> = (props) => {
    const [hovered, setHovered] = useState(false);

    const handleHover = () => {
        setHovered(true);
    };

    const handleLeave = () => {
        setHovered(false);
    };
    return (
            <Link to={`/detail/${props.product.productId}`} className='card text-decoration-none border-0 shadow-none' style={{ width: '300px',height: '350px', borderRadius: '0'}}>
                <div style={{padding: '0'}} className={`text-center card-body ${hovered ? 'hovered' : ''}`}
                     onMouseEnter={handleHover} onMouseLeave={handleLeave}>
                    <img
                        className='product-image'
                        src={hovered ? props.product.image2 :
                            props.product.image1}
                        alt="product image"
                    />
                    <div>
                        <h2 className='product-name'
                            style={{fontWeight: '600'}}>{props.product.productName.length > 50 ?
                            <h2 className='product-name'>{props.product.productName.substring(0, 50)}...</h2>
                            : <h2 className='product-name'>{props.product.productName}</h2>}</h2>
                        <p className='price'>${props.product.price}</p>
                    </div>
                </div>
            </Link>
    );
}