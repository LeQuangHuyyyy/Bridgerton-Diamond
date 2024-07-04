import React from "react";

interface AddProductProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    formData: {
        productId: string;
        collection: string;
        description: string;
        image1: File | string;
        image2: File | string;
        image3: File | string;
        image4: File | string;
        price: number;
        productName: string;
        stockQuantity: number;
        categoryId: number;
        shellId: number;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AddProduct: React.FC<AddProductProps> = ({
                                                          isOpen,
                                                          onClose,
                                                          onSubmit,
                                                          formData,
                                                          handleChange,
                                                          handleFileChange,
                                                      }) => {
    return (
        <div
            className={`modal ${isOpen ? 'show' : ''}`}
            style={{display: isOpen ? 'block' : 'none', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
            aria-modal="true"
            role="dialog"
        >
            <div className="modal-dialog" style={{maxWidth: '100%'}}>
                <div className="modal-content" style={{maxWidth: '80%', marginLeft: '11%'}}>
                    <div className="modal-header">
                        <h5 className="modal-title">Add New Product</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={onSubmit} encType="multipart/form-data">
                        <div className="modal-body d-flex gap-5">
                            <div className="col-5">
                                <div className="mb-3">
                                    <label htmlFor="productName" className="form-label">Product Name</label>
                                    <input
                                        type="text"
                                        id="productName"
                                        name="productName"
                                        value={formData.productName}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input
                                        type="text"
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="price" className="form-label">Price</label>
                                    <input
                                        type="number"
                                        id="price"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="stockQuantity" className="form-label">Stock Quantity</label>
                                    <input
                                        type="number"
                                        id="stockQuantity"
                                        name="stockQuantity"
                                        value={formData.stockQuantity}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="collection" className="form-label">Collection</label>
                                    <input
                                        type="text"
                                        id="collection"
                                        name="collection"
                                        value={formData.collection}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor="categoryId" className="form-label">Category</label>
                                    <select
                                        id="categoryId"
                                        name="categoryId"
                                        className="form-select"
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>Select Category</option>
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
                                    <label htmlFor="shellId" className="form-label">Shell</label>
                                    <select
                                        id="shellId"
                                        name="shellId"
                                        className="form-select"
                                        value={formData.shellId}
                                        onChange={handleChange}
                                    >
                                        <option value="" disabled>Select Shell</option>
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
                                    <label htmlFor="image1" className="form-label">Image 1</label>
                                    <input
                                        type="file"
                                        id="image1"
                                        name="image1"
                                        className="form-control"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="image2" className="form-label">Image 2</label>
                                    <input
                                        type="file"
                                        id="image2"
                                        name="image2"
                                        className="form-control"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="image3" className="form-label">Image 3</label>
                                    <input
                                        type="file"
                                        id="image3"
                                        name="image3"
                                        className="form-control"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="image4" className="form-label">Image 4</label>
                                    <input
                                        type="file"
                                        id="image4"
                                        name="image4"
                                        className="form-control"
                                        onChange={handleFileChange}
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
    );
};