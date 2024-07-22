import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface UpdatePromotionProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    formData: {
        id: string;
        name: string;
        startDate: string;
        endDate: string;
        discountPercent: number;
        quantity: number;
        code: string;
        managerId: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
};

export const UpdatePromotion: React.FC<UpdatePromotionProps> = ({isOpen, onClose, onSubmit, formData, handleChange}) => {

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
                            <h5 className="modal-title">Update Promotion</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <form onSubmit={onSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Promotion Name</label>
                                    <input
                                        type="text"
                                        id="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Name"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Code</label>
                                    <input
                                        type="text"
                                        id="text"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="code"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">End Date</label>
                                    <input
                                        type="date"
                                        id="text"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Discount Percent</label>
                                    <input
                                        type="number"
                                        id="discountPercent"
                                        name="discountPercent"
                                        value={formData.discountPercent}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Discount Percent"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Quantity</label>
                                    <input
                                        type="number"
                                        id="number"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="quantity"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-primary">Update</button>
                                <button type="button" className="btn btn-danger" onClick={onClose}>Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

