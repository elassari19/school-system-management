import { ResourceColumn } from '@/components/tables/resource-table';
import { AccountingEntry, ExpenseRecord, FeeRecord } from './finance-data';

export const accountingColumns: ResourceColumn<AccountingEntry>[] = [
  { key: 'date', header: 'Date', type: 'date' },
  { key: 'reference', header: 'Reference', className: 'font-medium' },
  { key: 'description', header: 'Description', className: 'max-w-56' },
  { key: 'account', header: 'Account' },
  { key: 'type', header: 'Type' },
  { key: 'amount', header: 'Amount', type: 'currency' },
  { key: 'status', header: 'Status', type: 'status' },
];

export const accountingSearchKeys = ['reference', 'description', 'account', 'type', 'status'] as const;

export const feesColumns: ResourceColumn<FeeRecord>[] = [
  { key: 'student', header: 'Student', className: 'font-medium' },
  { key: 'class', header: 'Class' },
  { key: 'feeType', header: 'Fee Type' },
  { key: 'term', header: 'Term' },
  { key: 'amount', header: 'Amount', type: 'currency' },
  { key: 'paid', header: 'Paid', type: 'currency' },
  { key: 'status', header: 'Status', type: 'status' },
];

export const feesSearchKeys = ['student', 'class', 'feeType', 'term', 'status'] as const;

export const expensesColumns: ResourceColumn<ExpenseRecord>[] = [
  { key: 'date', header: 'Date', type: 'date' },
  { key: 'category', header: 'Category', className: 'font-medium' },
  { key: 'description', header: 'Description', className: 'max-w-56' },
  { key: 'vendor', header: 'Vendor' },
  { key: 'paymentMethod', header: 'Payment Method' },
  { key: 'amount', header: 'Amount', type: 'currency' },
  { key: 'status', header: 'Status', type: 'status' },
];

export const expensesSearchKeys = ['category', 'description', 'vendor', 'paymentMethod', 'status'] as const;
