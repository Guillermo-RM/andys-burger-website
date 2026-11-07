export type ExpenseItem = {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  date: string;
  supplier: string;
  description: string;
  category: string;
  quantity: number;
  unit?: string;
  unitPrice: number;
  total: number;
};

export type Invoice = {
  id: string;
  number: string;
  date: string;
  supplier: string;
  subtotal: number;
  tax: number;
  total: number;
  items: ExpenseItem[];
};
