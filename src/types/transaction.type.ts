import { Franchise } from '../enums/franchise.enum';
import { PaymentMethod } from '../enums/payment-method.enum';
import { SalesType } from '../enums/sales-type.enum';
import { Status } from '../enums/status.enum';

export type Transaction = {
  id: string;
  status: Status;
  paymentMethod: PaymentMethod;
  salesType: SalesType;
  createdAt: number;
  transactionReference: number;
  amount: number;
  franchise?: Franchise;
  deduction?: number;
};
