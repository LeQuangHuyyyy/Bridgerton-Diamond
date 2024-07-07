class OrderItemModel {
    productName: string;
    quantity: number;
    price: number;
    size: number;

    constructor(productName: string, quantity: number, price: number, size: number) {
        this.productName = productName;
        this.quantity = quantity;
        this.price = price;
        this.size = size;
    }
}
export default OrderItemModel;