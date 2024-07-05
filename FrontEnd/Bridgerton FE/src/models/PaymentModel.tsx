class PaymentModel{
    paymentsId: number;
    paymentAmount: number;
    paymentMode: string;
    paymentTime: Date;
    description: string;
    paymentCode: string;
    orderId: number;

    constructor(paymentsId: number, paymentAmount: number, paymentMode: string, paymentTime: Date, description: string, paymentCode: string, orderId: number){
        this.paymentsId = paymentsId;
        this.paymentAmount = paymentAmount;
        this.paymentMode = paymentMode;
        this.paymentTime = paymentTime;
        this.description = description;
        this.paymentCode = paymentCode;
        this.orderId = orderId;
    }
}
export default PaymentModel;