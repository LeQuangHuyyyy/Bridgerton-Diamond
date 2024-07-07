import OrderItemModel from "./OrderItemModel";


class OrderDetailModel {
    userName: string;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    size: number;
    email: string;
    staff: string;
    orderDate: string;
    totalAmount: number;
    products: OrderItemModel[];
    status: string;
    image: string;
    orderAddress: string;
    totalProductInOrder: number;

    constructor(userName: string, orderId: number, productId: number, quantity: number, price: number, size: number, email: string, orderDate: string, totalAmount: number, products: OrderItemModel[], status: string, image: string, totalProductInOrder: number, saleStaff: string, orderAddress: string) {
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
        this.staff = saleStaff;
        this.orderAddress = orderAddress;
        this.totalProductInOrder = totalProductInOrder;
    }
}

export default OrderDetailModel;