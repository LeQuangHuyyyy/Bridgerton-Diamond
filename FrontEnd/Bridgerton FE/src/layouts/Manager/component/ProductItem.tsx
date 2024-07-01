import ProductModel from "../../../models/ProductModel";

export const ProductItem: React.FC<{ product: ProductModel }> = (props) => {
    return (
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded col-2'
             style={{
                 width: '300px',
                 height: '420px'
             }}
        >
            <div className="text-decoration-none text-dark">

                <div className='text-center pb-2 mb-4' style={{height: '280px'}}>
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
                    <p className='price text-center ms-3'>
                        <small className='text-muted'
                               style={{fontWeight: 'bolder'}}>${props.product.price}</small>
                    </p>
                </div>
                <p className="d-flex">
                    <button className='w-50 mt-5 btn bg-body-secondary text-decoration-none '>
                        Edit
                    </button>
                    <button className=' w-50 mt-5 btn bg-body-secondary text-decoration-none '>
                        Delete
                    </button>
                </p>
            </div>
        </div>
    );
}