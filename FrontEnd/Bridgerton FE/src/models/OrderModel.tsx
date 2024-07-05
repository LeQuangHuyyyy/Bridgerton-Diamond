import OrderDetailModel from "./OrderDetailModel";
import FeedbackModel from "./FeedbackModel";
import WarrantyModel from "./WarrantyModel";
import InvoiceModel from "./InvoiceModel";
import PaymentModel from "./PaymentModel";
import OrderStatus from "./OrderStatus";

class OrderModel {
    orderId: number;
    orderDate: Date;
    orderTotalAmount: number;
    orderDeliveryAddress: string;
    status: OrderStatus;
    discountCode: string;
    customerId: number;
    saleId: number;
    deliveryId: number;
    orderDetails : OrderDetailModel[];
    feedbacks : FeedbackModel[];
    warranties : WarrantyModel[];
    invoices : InvoiceModel[];
    payments : PaymentModel[];

    constructor(orderId: number, orderDate: Date, orderTotalAmount: number, orderDeliveryAddress: string, status: OrderStatus, discountCode: string, customerId: number, saleId: number, deliveryId: number, orderDetails : OrderDetailModel[], feedbacks : FeedbackModel[], warranties : WarrantyModel[], invoices : InvoiceModel[], payments : PaymentModel[]){
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