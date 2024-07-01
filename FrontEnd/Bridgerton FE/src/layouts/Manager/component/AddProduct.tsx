import React from "react";

interface AddProductProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    formData: {
        productId: string;
        product_name: string;
        collection: string;
        description: string;
        image_1: string;
        image_2: string;
        image_3: string;
        image_4: string;
        price: number;
        stock_quantity: number;
        category_id: number;
        shell_id: number;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
};
export const AddProduct: React.FC<AddProductProps> = ({isOpen, onClose, onSubmit, formData, handleChange}) => {

    return (
        <>
            <div
                className={`modal ${isOpen ? 'show' : ''} `}
                style={{display: isOpen ? 'block' : 'none', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
                aria-modal="true"
                role="dialog"
            >
                <div className="modal-dialog">
                    <div className="modal-content"
                    >
                        <div className="modal-header ">
                            <h5 className="modal-title">Add New Product</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <form onSubmit={onSubmit}>
                            <div className="modal-body d-flex gap-5 ">
                                <div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Product Name</label>
                                        <input
                                            type="text"
                                            id="text"
                                            name="promotionName"
                                            value={formData.product_name}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Description</label>
                                        <input
                                            type="text"
                                            id="text"
                                            name="promotionStartDate"
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Price</label>
                                        <input
                                            type="number"
                                            id="text"
                                            name="promotionEndDate"
                                            value={formData.price}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Stock Quantity</label>
                                        <input
                                            type="number"
                                            id="text"
                                            name="promotionEndDate"
                                            value={formData.stock_quantity}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="collection" className="form-label">Collection</label>
                                        <input
                                            type="text"
                                            id="text"
                                            name="promotionEndDate"
                                            value={formData.collection}
                                            onChange={handleChange}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-3">
                                        <label htmlFor="category" className="form-label">Category</label>
                                        <select
                                            id="category"
                                            className="form-select"
                                            value={formData.category_id}
                                            onChange={handleChange}
                                        >
                                            <option value="" disabled>Select Collection</option>
                                            <option value="1">Engagement Rings</option>
                                            <option value="2">Wedding Bands</option>
                                            <option value="3">Men Diamond Ring</option>
                                            <option value="4">Women Diamond Ring</option>
                                            <option value="5">Diamond Necklaces</option>
                                            <option value="6">Diamond Earrings</option>
                                            <option value="7">Diamond Bracelets</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="category" className="form-label">Shell</label>
                                        <select
                                            id="category"
                                            className="form-select"
                                            value={formData.category_id}
                                            onChange={handleChange}
                                        >
                                            <option value="" disabled>Select Collection</option>
                                            <option value="1">Twist</option>
                                            <option value="13">Vintage-Inspired</option>
                                            <option value="3">Solitaire</option>
                                            <option value="4">Baguette</option>
                                            <option value="11">Three-Stone</option>
                                            <option value="32">Twist Pavé</option>
                                            <option value="24">Halo</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="image_1" className="form-label">Image1</label>
                                        <input
                                            type="file"
                                            id="image_1"
                                            name="image_1"
                                            value={formData.image_1}
                                            onChange={handleChange}
                                            className="form-control"
                                        />
                                    </div>
                                </div>


                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary">Create</button>
                                <button type="button" className="btn btn-danger" onClick={onClose}>Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );

}