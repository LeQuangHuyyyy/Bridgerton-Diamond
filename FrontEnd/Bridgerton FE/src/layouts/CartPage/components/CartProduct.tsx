import CartModel from "../../../models/CartModel";


export const CartProduct: React.FC<{ product: CartModel; onRemoveProduct: (productId: number) => void }> = (props) => {

    const handleRemoveProduct = () => {
        props.onRemoveProduct(props.product.productId);
    };
    return (
        <tr>
            <td className='text-center' scope="row">
                <img src={`http://localhost:8888/product/load-image/${props.product.image1}.jpg`}
                     alt="product"
                     style={{width: '70px', height: '70px'}}/>
            </td>
            <td className='text-center'>{props.product.productName}</td>
            <td className='text-center'>{props.product.quantity}</td>
            <td className='text-center'>{props.product.size}</td>
            <td className='text-center'>${props.product.totalPrice}</td>
            <td>
                <button onClick={handleRemoveProduct}>Remove</button>
            </td>
        </tr>
    );
}