class OrderItemModel {
    productName: string;
    quantity: number;
    price: number;
    size: number;
    warrantiesImage: string;
    certificateImage: string;

    constructor(productName: string, quantity: number, price: number, size: number, warrantiesImage: string, certificateImage: string) {
        this.productName = productName;
        this.quantity = quantity;
        this.price = price;
        this.size = size;
        this.warrantiesImage = warrantiesImage;
        this.certificateImage = certificateImage;
    }
}
export default OrderItemModel;