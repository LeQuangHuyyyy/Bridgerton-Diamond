import React, {ChangeEvent} from "react";

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
    handleChange: (e: React.ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => void;

};

export const UpdateDiamond: React.FC<AddDiamondProp> = ({isOpen, onClose, onSubmit, formData, handleChange}) => {

    return (
        <>
            <div
                className={`modal ${isOpen ? 'show' : ''} `}
                style={{display: isOpen ? 'block' : 'none', backgroundColor: 'rgba(0, 0, 0, 0.5)'}}
                aria-modal="true"
                role="dialog"
            >
                <div className="modal-dialog " style={{marginTop: '100px'}}>
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
                                            <select
                                                id="cut"
                                                name="cut"
                                                value={formData.cut}
                                                onChange={handleChange}
                                                className="form-control"
                                                required
                                            >
                                                <option value="" defaultChecked disabled> Cut</option>
                                                <option value="Heart">Heart</option>
                                                <option value="Round">Round</option>
                                                <option value="Oval">Oval</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="w-50">
                                        <div className="mb-3">
                                            <label htmlFor="cut" className="form-label">Color</label>
                                            <select
                                                id="color"
                                                name="color"
                                                value={formData.color}
                                                onChange={handleChange}
                                                className="form-control"
                                                required
                                            >
                                                <option value="" defaultChecked disabled> Color</option>
                                                <option value="D">D</option>
                                                <option value="J">J</option>
                                                <option value="E">E</option>
                                                <option value="G">G</option>
                                                <option value="F">F</option>
                                                <option value="H">H</option>
                                                <option value="K">K</option>
                                            </select>
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="clarity" className="form-label">Clarity</label>
                                            <select
                                                id="clarity"
                                                name="clarity"
                                                value={formData.clarity}
                                                onChange={handleChange}
                                                className="form-control"
                                                required
                                            >
                                                <option value="" defaultChecked disabled> Clarity</option>
                                                <option value="SL2">SL2</option>
                                                <option value="SL1">SL1</option>
                                                <option value="VS2">VS2</option>
                                                <option value="VS1">VS1</option>
                                                <option value="VVS2">VVS2</option>
                                                <option value="VVS1">VVS1</option>
                                                <option value="IF">IF</option>
                                                <option value="FL">FL</option>
                                            </select>
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
