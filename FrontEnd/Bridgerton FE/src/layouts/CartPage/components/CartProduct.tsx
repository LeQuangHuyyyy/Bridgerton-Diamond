import CartModel from "../../../models/CartModel";


export const CartProduct: React.FC<{ product: CartModel; onRemoveProduct: (productId: number, sizeId: number) => void }> = (props) => {

    const handleRemoveProduct = () => {
        props.onRemoveProduct(props.product.productId, props.product.sizeId);
    };
    return (
        <tr>
            <td className='text-center' scope="row">
                <img src={props.product.image1}
                     alt="product"
                     style={{width: '70px', height: '70px'}}/>
            </td>
            <td className='text-center'>{props.product.productName}</td>
            <td className='text-center'>{props.product.quantity}</td>
            <td className='text-center'>{props.product.size}</td>
            <td className='text-center'>${props.product.totalPrice}</td>
            <td className='text-center'>
                <div onClick={handleRemoveProduct} style={{cursor: 'pointer'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         className="bi bi-trash" viewBox="0 0 16 16">
                        <path
                            d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path
                            d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                    </svg>
                </div>
            </td>
        </tr>
    );
}