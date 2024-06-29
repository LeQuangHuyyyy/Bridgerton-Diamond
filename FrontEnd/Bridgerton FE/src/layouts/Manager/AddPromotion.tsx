import React from "react";

interface AddPromotionProp {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    formData: {
        promotionId: string;
        promotionStartDate: string;
        promotionEndDate: string;
        promotionName: string;
        managerId: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
};

export const AddPromotion: React.FC<AddPromotionProp> = ({isOpen, onClose, onSubmit, formData, handleChange}) => {

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
                            <h5 className="modal-title">Add New Promotion</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <form onSubmit={onSubmit}>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Promotion Name</label>
                                    <input
                                        type="text"
                                        id="text"
                                        name="promotionName"
                                        value={formData.promotionName}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="Name"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Start Date</label>
                                    <input
                                        type="date"
                                        id="text"
                                        name="promotionStartDate"
                                        value={formData.promotionStartDate}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">End Date</label>
                                    <input
                                        type="date"
                                        id="text"
                                        name="promotionEndDate"
                                        value={formData.promotionEndDate}
                                        onChange={handleChange}
                                        className="form-control"
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
