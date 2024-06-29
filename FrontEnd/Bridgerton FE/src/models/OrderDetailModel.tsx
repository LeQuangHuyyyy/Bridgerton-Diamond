class OrderDetailModel {
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    size: number;

    constructor(orderId: number, productId: number, quantity: number, price: number, size: number) {
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
        this.size = size;
    }
}
export default OrderDetailModel;