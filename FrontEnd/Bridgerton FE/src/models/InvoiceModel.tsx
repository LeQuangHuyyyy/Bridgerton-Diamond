class InvoiceModel{
    invoiceId: number;
    invoiceDate: Date;
    invoiceDueDate: Date;
    totalAmount: number;
    paidAmount: number;

    constructor(invoiceId: number, invoiceDate: Date, invoiceDueDate: Date, totalAmount: number, paidAmount: number){
        this.invoiceId = invoiceId;
        this.invoiceDate = invoiceDate;
        this.invoiceDueDate = invoiceDueDate;
        this.totalAmount = totalAmount;
        this.paidAmount = paidAmount;
    }
}
export default InvoiceModel;