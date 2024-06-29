class OrderModel {
    orderId: number;
    orderDate: Date;
    orderTotalAmount: number;
    orderDeliveryAddress: string
    status: string;
    discountCode: string;
    customerId: number;
    saleId: number;
    deliveryId: number;
    orderDetails : string;
    feedbacks : string;
    warranties : string;
    invoices : string;
    payments : string;

    constructor(orderId: number, orderDate: Date, orderTotalAmount: number, orderDeliveryAddress: string, status: string, discountCode: string, customerId: number, saleId: number, deliveryId: number, orderDetails : string, feedbacks : string, warranties : string, invoices : string, payments : string) {
        this.orderId = orderId;
        this.orderDate = orderDate;
        this.orderTotalAmount = orderTotalAmount;
        this.orderDeliveryAddress = orderDeliveryAddress;
        this.status = status;
        this.discountCode = discountCode;
        this.customerId = customerId;
        this.saleId = saleId;
        this.deliveryId = deliveryId;
        this.orderDetails = orderDetails;
        this.feedbacks = feedbacks;
        this.warranties = warranties;
        this.invoices = invoices;
        this.payments = payments;
    }
}
export default OrderModel;