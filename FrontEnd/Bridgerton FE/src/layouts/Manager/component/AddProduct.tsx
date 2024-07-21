import React, {useEffect, useState} from "react";
import uploadFile from '../../../firebase/uploadFile';
import ProductModel from "../../../models/ProductModel";
import productModel from "../../../models/ProductModel";
import DiamondModel from "../../../models/DiamondModel"; // Path to your uploadFile function

const token = localStorage.getItem('token');
const headers = {
    'Authorization': `Bearer ${token}`

}

interface AddProductProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent, product: ProductModel) => void;

    formData: {
        productId: number;
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
        diamondId: number;
        shellId: number;
        warrantyImage: string,
        certificateImage: string,
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
    const [diamonds, setDiamonds] = useState<DiamondModel[]>([]);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const image1URL = formData.image1 instanceof File ? await uploadFile(formData.image1) : formData.image1;
            const image2URL = formData.image2 instanceof File ? await uploadFile(formData.image2) : formData.image2;
            const image3URL = formData.image3 instanceof File ? await uploadFile(formData.image3) : formData.image3;
            const image4URL = formData.image4 instanceof File ? await uploadFile(formData.image4) : formData.image4;

            const certificateImage = formData.certificateImage ? formData.certificateImage : "asdasdasd";
            const warrantyImage = formData.certificateImage ? formData.warrantyImage : "asdasdasd";

            const productData = new productModel(
                formData.productId,
                formData.productName,
                formData.price,
                formData.stockQuantity,
                formData.collection,
                formData.description,
                image1URL ?? "",
                image2URL ?? "",
                image3URL ?? "",
                image4URL ?? "",
                formData.categoryId,
                formData.diamondId,
                formData.shellId,
                certificateImage,
                warrantyImage
            );

            onSubmit(e, productData);
        } catch (error) {
            console.error("Error uploading files:", error);
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            const baseUrl: string = "https://deploy-be-b176a8ceb318.herokuapp.com/manager/diamond";
            const url: string = `${baseUrl}`;
            const response = await fetch(url, {headers: headers});
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            const responseJson = await response.json();
            const responseData = responseJson.data;
            const loadedDiamonds: DiamondModel[] = [];
            for (const key in responseData) {
                loadedDiamonds.push({
                    diamondId: responseData[key].diamondId,
                    carat: responseData[key].carat,
                    price: responseData[key].price,
                    cut: responseData[key].cut,
                    color: responseData[key].color,
                    clarity: responseData[key].clarity,
                    certification: responseData[key].certification,
                    productId: responseData[key].productId,
                    status: responseData[key].status,
                });
            }
            setDiamonds(loadedDiamonds);
        };
        fetchOrders().catch((error: any) => {
            console.log(error);
        })
    }, []);
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
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
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
                                <div className="mb-3">
                                    <label htmlFor="diamondId" className="form-label">Diamond</label>
                                    <select
                                        id="diamondId"
                                        name="diamondId"
                                        className="form-select"
                                        value={formData.diamondId}
                                        onChange={handleChange}>
                                        {diamonds.map((diamond) => (
                                            <option key={diamond.diamondId} value={diamond.diamondId}>
                                                {`ID: ${diamond.diamondId}, Carat: ${diamond.carat}, Price: ${diamond.price}, Cut: ${diamond.cut}, Color: ${diamond.color}, Clarity: ${diamond.clarity}, Certification: ${diamond.certification}, Product ID: ${diamond.productId}, Status: ${diamond.status}`}
                                            </option>
                                        ))}
                                    </select>
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
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Close
                            </button>
                            <button type="submit" className="btn btn-primary">
                                Save changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
