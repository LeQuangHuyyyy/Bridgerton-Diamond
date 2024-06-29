import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import OrderDetailModel from '../../../models/OrderDetailModel';

interface OrderDetailProps {
    onClose: () => void;
}
const OrderDetail: React.FC<OrderDetailProps> = ({onClose}) => {
    const [detail, setDetail] = useState<OrderDetailModel>({
        orderId: 1,
        productId: 67890,
        quantity: 2,
        price: 100.00,
        size: 10
    });

    return (
        <div className="modal fade show d-block" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Order Details</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="mt-3">
                            <p><strong>Order ID:</strong> {detail.orderId}</p>
                            <p><strong>Product ID:</strong> {detail.productId}</p>
                            <p><strong>Quantity:</strong> {detail.quantity}</p>
                            <p><strong>Price:</strong> {detail.price}</p>
                            <p><strong>Size:</strong> {detail.size}</p>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
