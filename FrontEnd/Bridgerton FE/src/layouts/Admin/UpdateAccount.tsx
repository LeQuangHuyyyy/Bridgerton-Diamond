import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

interface UpdateAccountProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    formData: {
        name: string;
        email: string;
        phoneNumber: string;
        address: string;
        role: string;
        status: string;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
}

const UpdateAccount: React.FC<UpdateAccountProps> = ({isOpen, onClose, onSubmit, formData, handleChange}) => {
    return (
        <div>
            {isOpen && (
                <div
                    id="updateProductModal"
                    tabIndex={-1}
                    aria-hidden="true"
                    className="modal fade show d-block"
                    style={{backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
                >
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Update User</h5>
                                <button
                                    onClick={onClose}
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={onSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="Erisha"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="meesha123@gmail.com"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="phone" className="form-label">
                                            Phone
                                        </label>
                                        <input
                                            type="text"
                                            name="phoneNumber"
                                            id="phone"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="09*******"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="address" className="form-label">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            id="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="form-control"
                                            placeholder="Ho Chi Minh City"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="role" className="form-label">
                                            Role
                                        </label>
                                        <select
                                            id="role"
                                            name="role"
                                            value={formData.role}
                                            className="form-select"
                                            onChange={handleChange}
                                        >
                                            <option value="" disabled>
                                                Select roles
                                            </option>
                                            <option value="CUSTOMER">Customer</option>
                                            <option value="ADMIN">Admin</option>
                                            <option value="MANAGER">Manager</option>
                                            <option value="DELIVERY_STAFF">Delivery Staff</option>
                                            <option value="SALE_STAFF">Sale Staff</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="status" className="form-label">
                                            Status
                                        </label>
                                        <div className="form-check">
                                            <input
                                                id="active-radio"
                                                type="radio"
                                                value="true"
                                                name="status"
                                                checked={formData.status === 'true'}
                                                onChange={handleChange}
                                                className="form-check-input"
                                            />
                                            <label htmlFor="active-radio" className="form-check-label">
                                                Active
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                id="suspended-radio"
                                                type="radio"
                                                value="false"
                                                name="status"
                                                checked={formData.status === 'false'}
                                                onChange={handleChange}
                                                className="form-check-input"
                                            />
                                            <label htmlFor="suspended-radio" className="form-check-label">
                                                Suspended
                                            </label>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="submit" className="btn btn-primary">
                                            Update Account
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UpdateAccount;
