import ProductModel from "../../models/ProductModel";
import {Link} from "react-router-dom";

export const CheckoutAndReview: React.FC<{ product: ProductModel | undefined, mobile: boolean }> = (props) => {
    return (
        <div className={props.mobile ? 'card d-flex mt-5' : 'card col-3 container d-flex mb-5 justify-content-center'}>
            <div className='card-body container'>
                <div className='mt-3'>
                    <p>
                        <b>0/5 </b>
                        Product Checked Out
                    </p>
                    <hr/>
                    {props.product && props.product.stockQuantity && props.product.stockQuantity > 0 ?
                        <h4 className='text-success'>
                            Available
                        </h4>
                        :
                        <h4 className='Text-danger'>
                            Waiting for restock
                        </h4>
                    }
                </div>
                <Link to='/#' className='btn btn-success btn-lg'>Sign in</Link>
                <hr/>
                <p className='mt-3'>
                    This number can change until placing the order has been confirmed.
                </p>
                <p>
                    Sign in to be able to leave a review.
                </p>
            </div>
        </div>
    );
}