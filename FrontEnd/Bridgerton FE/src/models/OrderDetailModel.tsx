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
    phoneNumber: string;
    saleStaff: string;
    saleId: number;

    constructor(userName: string, orderId: number, productId: number, quantity: number, price: number, size: number, email: string, orderDate: string, totalAmount: number, products: OrderItemModel[], status: string, image: string, totalProductInOrder: number, phoneNumber: string, saleStaff: string, saleId: number) {
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
        this.phoneNumber = phoneNumber;
        this.saleStaff = saleStaff;
        this.saleId = saleId;
    }
}
export default OrderDetailModel;