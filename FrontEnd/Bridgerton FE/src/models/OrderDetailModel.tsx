import OrderItemModel from "./OrderItemModel";


class OrderDetailModel {
    userName: string;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    size: number;
    email: string;
    orderDate: string;
    totalAmount: number;
    products: OrderItemModel[];
    status: string;
    image: string;
    totalProductInOrder: number;

    constructor(userName: string, orderId: number, productId: number, quantity: number, price: number, size: number, email: string, orderDate: string, totalAmount: number, products: OrderItemModel[], status: string, image: string, totalProductInOrder: number) {
        this.userName = userName;
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
        this.price = price;
        this.size = size;
        this.email = email;
        this.orderDate = orderDate;
        this.totalAmount = totalAmount;
        this.products = products;
        this.status = status;
        this.image = image;
        this.totalProductInOrder = totalProductInOrder;
    }
}
export default OrderDetailModel;