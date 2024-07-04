import React from "react";

interface AddDiamondProp {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    formData: {
        diamondId: string;
        carat: string;
        price: string;
        cut: string;
        color: string;
        clarity: string;
        certification: string;
        status: boolean;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const AddDiamond: React.FC<AddDiamondProp> = ({isOpen, onClose, onSubmit, formData, handleChange}) => {

    return (
        <>
            <div
                className={`modal ${isOpen ? 'show' : ''} `}
                style={{display: isOpen ? 'block' : 'none', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
                aria-modal="true"
                role="dialog"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title"> New Diamond</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <form onSubmit={onSubmit}>
                            <div className="modal-body">
                                <div className="d-flex ">
                                    <div>
                                        <div className="mb-3">
                                            <label htmlFor="carat" className="form-label">Carat</label>
                                            <input
                                                type="text"
                                                id="carat"
                                                name="carat"
                                                value={formData.carat}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="Carat"
                                                required
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="cut" className="form-label">Cut</label>
                                            <input
                                                type="text"
                                                id="cut"
                                                name="cut"
                                                value={formData.cut}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="Cut"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="mb-3">
                                            <label htmlFor="color" className="form-label">Color</label>
                                            <input
                                                type="text"
                                                id="color"
                                                name="color"
                                                value={formData.color}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="Color"
                                                required
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="clarity" className="form-label">Clarity</label>
                                            <input
                                                type="text"
                                                id="clarity"
                                                name="clarity"
                                                value={formData.clarity}
                                                onChange={handleChange}
                                                className="form-control"
                                                placeholder="Clarity"
                                                required
                                            />
                                        </div>
                                    </div>

                                </div>

                                <div className="mb-3">
                                    <label htmlFor="price" className="form-label">Price</label>
                                    <input
                                        type="text"
                                        id="price"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Price"
                                        required
                                    />
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
