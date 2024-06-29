import React from 'react';

interface AddAccountProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    formData: {
        name: string;
        password: string;
        phoneNumber: string;
        email: string;
        address: string;
        role: string
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => void;
}

const AddAccount: React.FC<AddAccountProps> = ({isOpen, onClose, onSubmit, formData, handleChange}) => (
    <div
        className={`modal ${isOpen ? 'show' : ''} `}
        style={{display: isOpen ? 'block' : 'none', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
        aria-modal="true"
        role="dialog"
    >
        <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Add New Account</h5>
                    <button type="button" className="btn-close" onClick={onClose}></button>
                </div>
                <form onSubmit={onSubmit}>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Name"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Password"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Phone Number</label>
                            <input
                                type="text"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Phone Numbe"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Email"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Address</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="form-control"
                                placeholder="Address"
                                required
                            />
                        </div>
                        <div className="col-12 col-sm-6 mb-3 d-flex mb-3 ">
                            <div className="col-9 me-5">
                                <label htmlFor="job" className="form-label">Function</label>
                                <select
                                    id="job"
                                    name="role"
                                    value={formData.role}
                                    className="form-select"
                                    onChange={handleChange}

                                >
                                    <option value="" selected>SELECT ROLE</option>
                                    <option value="CUSTOMER">Customer</option>
                                    <option value="ADMIN">Admin</option>
                                    <option value="MANAGER">Manager</option>
                                    <option value="DELIVERY_STAFF">Delivery Staff</option>
                                    <option value="SALE_STAFF">Sale Staff</option>
                                </select>
                            </div>
                            <div className="col-4">
                                <label htmlFor="status" className="form-label">Status</label>
                                <div className="form-check me-4">
                                    <input
                                        id="active-radio"
                                        type="radio"
                                        value="true"
                                        name="status"
                                        onChange={handleChange}
                                        className="form-check-input"
                                    />
                                    <label htmlFor="active-radio" className="form-check-label ms-2">Active</label>
                                </div>
                                <div className="form-check me-4">
                                    <input
                                        id="suspended-radio"
                                        type="radio"
                                        value="false"
                                        name="status"
                                        onChange={handleChange}
                                        className="form-check-input"
                                    />
                                    <label htmlFor="suspended-radio" className="form-check-label ms-2">Suspended</label>
                                </div>
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

export default AddAccount;
