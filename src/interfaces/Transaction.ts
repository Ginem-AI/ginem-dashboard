export interface ITransaction {
  transactionId: number;
  transactionOrderId: number;
  transactionUserId: string;

  transactionAmount: number;
  transactionOngkirPrice: number;

  transactionProvider: "midtrans";
  transactionPaymentType?: string;

  transactionSnapToken?: string;
  transactionStatus: "pending" | "success" | "failed" | "expire" | "cancel";

  transactionRawResponse?: object;
}
