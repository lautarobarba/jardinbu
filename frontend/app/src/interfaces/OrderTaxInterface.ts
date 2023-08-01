import { formatTitleCase } from '../utils/tools';
import { ClassTax } from './ClassTaxInterface';
import { User } from './User';

export interface OrderTax {
  id: number;
  name: string;
  description: string;
  classTax: ClassTax;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
  userMod: User;
}

export interface CreateOrderTaxDto {
  name: string;
  description?: string;
  classTaxId: number;
}

export interface UpdateOrderTaxDto extends CreateOrderTaxDto {
  id: number;
}

export const orderTaxToString = (orderTax: OrderTax) => {
  if (orderTax.description)
    return `${orderTax.id}. ${formatTitleCase(orderTax.name)} (${
      orderTax.description
    })`;
  return `${orderTax.id}. ${formatTitleCase(orderTax.name)}`;
};
