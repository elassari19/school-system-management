// Finance data (Accounting, Fees Management, Expenses) — replace with API queries when the backend is ready.

export interface AccountingEntry {
  id: string;
  date: string;
  reference: string;
  description: string;
  account: string;
  type: 'Debit' | 'Credit';
  amount: number;
  status: 'Posted' | 'Draft' | 'Reconciled';
}

export const accountingData: AccountingEntry[] = [
  { id: 'j1', date: '2026-09-02', reference: 'JE-2026-001', description: 'September tuition collection', account: 'Tuition Income', type: 'Credit', amount: 18400, status: 'Posted' },
  { id: 'j2', date: '2026-09-04', reference: 'JE-2026-002', description: 'Teacher salaries - August', account: 'Salaries Expense', type: 'Debit', amount: 12600, status: 'Posted' },
  { id: 'j3', date: '2026-09-08', reference: 'JE-2026-003', description: 'Electricity & water bills', account: 'Utilities Expense', type: 'Debit', amount: 1450, status: 'Reconciled' },
  { id: 'j4', date: '2026-09-10', reference: 'JE-2026-004', description: 'Transport fuel invoices', account: 'Transportation Expense', type: 'Debit', amount: 980, status: 'Posted' },
  { id: 'j5', date: '2026-09-12', reference: 'JE-2026-005', description: 'Library books purchase', account: 'Supplies Expense', type: 'Debit', amount: 620, status: 'Draft' },
  { id: 'j6', date: '2026-09-15', reference: 'JE-2026-006', description: 'Workshop maintenance tools', account: 'Maintenance Expense', type: 'Debit', amount: 340, status: 'Reconciled' },
  { id: 'j7', date: '2026-09-17', reference: 'JE-2026-007', description: 'Cafeteria supplies restock', account: 'Meals Expense', type: 'Debit', amount: 875, status: 'Posted' },
  { id: 'j8', date: '2026-09-19', reference: 'JE-2026-008', description: 'Term 1 exam fees income', account: 'Tuition Income', type: 'Credit', amount: 5200, status: 'Posted' },
  { id: 'j9', date: '2026-09-21', reference: 'JE-2026-009', description: 'Petty cash top-up', account: 'Cash', type: 'Debit', amount: 1500, status: 'Posted' },
  { id: 'j10', date: '2026-09-23', reference: 'JE-2026-010', description: 'After-school activities income', account: 'Activities Income', type: 'Credit', amount: 2300, status: 'Reconciled' },
  { id: 'j11', date: '2026-09-25', reference: 'JE-2026-011', description: 'Admission flyers & ads', account: 'Marketing Expense', type: 'Debit', amount: 430, status: 'Draft' },
  { id: 'j12', date: '2026-09-28', reference: 'JE-2026-012', description: 'Sports equipment restock', account: 'Supplies Expense', type: 'Debit', amount: 760, status: 'Posted' },
];

export interface FeeRecord {
  id: string;
  student: string;
  class: string;
  feeType: string;
  term: string;
  amount: number;
  paid: number;
  status: 'Paid' | 'Partial' | 'Pending' | 'Overdue';
}

export const feeData: FeeRecord[] = [
  { id: 'f1', student: 'Awa Sarr', class: 'Grade 6A', feeType: 'Tuition', term: 'Term 1', amount: 480, paid: 480, status: 'Paid' },
  { id: 'f2', student: 'Cheikh Diop', class: 'Grade 5B', feeType: 'Tuition', term: 'Term 1', amount: 480, paid: 240, status: 'Partial' },
  { id: 'f3', student: 'Fatou Ndiaye', class: 'Grade 7A', feeType: 'Tuition', term: 'Term 1', amount: 480, paid: 0, status: 'Pending' },
  { id: 'f4', student: 'Moussa Ba', class: 'Grade 6A', feeType: 'Transportation', term: 'Term 1', amount: 150, paid: 150, status: 'Paid' },
  { id: 'f5', student: 'Aissatou Sow', class: 'Grade 8B', feeType: 'Meals', term: 'Term 1', amount: 120, paid: 60, status: 'Partial' },
  { id: 'f6', student: 'Oumar Kane', class: 'Grade 7A', feeType: 'Activities', term: 'Term 1', amount: 90, paid: 90, status: 'Paid' },
  { id: 'f7', student: 'Mariama Diallo', class: 'Grade 5B', feeType: 'Tuition', term: 'Term 1', amount: 480, paid: 0, status: 'Overdue' },
  { id: 'f8', student: 'Ibrahima Fall', class: 'Grade 6A', feeType: 'Exam', term: 'Term 1', amount: 60, paid: 60, status: 'Paid' },
  { id: 'f9', student: 'Ndeye Gueye', class: 'Grade 8B', feeType: 'Transportation', term: 'Term 1', amount: 150, paid: 0, status: 'Pending' },
  { id: 'f10', student: 'Abdoulaye Sene', class: 'Grade 7A', feeType: 'Meals', term: 'Term 1', amount: 120, paid: 120, status: 'Paid' },
  { id: 'f11', student: 'Khady Niasse', class: 'Grade 5B', feeType: 'Activities', term: 'Term 1', amount: 90, paid: 30, status: 'Partial' },
  { id: 'f12', student: 'Samba Camara', class: 'Grade 6A', feeType: 'Tuition', term: 'Term 1', amount: 480, paid: 0, status: 'Overdue' },
];

export interface ExpenseRecord {
  id: string;
  date: string;
  category: string;
  description: string;
  vendor: string;
  paymentMethod: string;
  amount: number;
  status: 'Approved' | 'Pending' | 'Rejected';
}

export const expenseData: ExpenseRecord[] = [
  { id: 'e1', date: '2026-04-10', category: 'Utilities', description: 'Electricity & water bill - April', vendor: 'Senelec', paymentMethod: 'Bank Transfer', amount: 1180, status: 'Approved' },
  { id: 'e2', date: '2026-04-22', category: 'Supplies', description: 'Stationery restock - Q2', vendor: 'OfficePro Supplies', paymentMethod: 'Card', amount: 640, status: 'Approved' },
  { id: 'e3', date: '2026-05-08', category: 'Maintenance', description: 'Bus servicing (fleet A)', vendor: 'AutoSchool', paymentMethod: 'Bank Transfer', amount: 520, status: 'Approved' },
  { id: 'e4', date: '2026-05-19', category: 'Meals', description: 'Cafeteria groceries', vendor: 'FreshMarket', paymentMethod: 'Cash', amount: 860, status: 'Approved' },
  { id: 'e5', date: '2026-06-05', category: 'Activities', description: 'End-of-year field trips', vendor: 'EduTours', paymentMethod: 'Bank Transfer', amount: 480, status: 'Approved' },
  { id: 'e6', date: '2026-06-24', category: 'Marketing', description: 'Admission campaign flyers', vendor: 'AdSene', paymentMethod: 'Card', amount: 350, status: 'Rejected' },
  { id: 'e7', date: '2026-07-02', category: 'Salaries', description: 'Mid-year staff bonus', vendor: 'Staff Payroll', paymentMethod: 'Bank Transfer', amount: 8600, status: 'Approved' },
  { id: 'e8', date: '2026-07-18', category: 'Utilities', description: 'Electricity & water bill - July', vendor: 'Senelec', paymentMethod: 'Bank Transfer', amount: 1260, status: 'Approved' },
  { id: 'e9', date: '2026-08-06', category: 'Transportation', description: 'Annual bus insurance', vendor: 'AssurSchool', paymentMethod: 'Bank Transfer', amount: 1850, status: 'Approved' },
  { id: 'e10', date: '2026-08-27', category: 'Supplies', description: 'Library books order', vendor: 'LibreBook', paymentMethod: 'Bank Transfer', amount: 620, status: 'Pending' },
  { id: 'e11', date: '2026-09-03', category: 'Maintenance', description: 'AC repair - Block B', vendor: 'ClimPro', paymentMethod: 'Cash', amount: 430, status: 'Pending' },
  { id: 'e12', date: '2026-09-14', category: 'Meals', description: 'September cafeteria stock', vendor: 'FreshMarket', paymentMethod: 'Bank Transfer', amount: 875, status: 'Approved' },
];

export const monthlyCollections = [
  { name: 'Apr', value: 2100 },
  { name: 'May', value: 2650 },
  { name: 'Jun', value: 1980 },
  { name: 'Jul', value: 3200 },
  { name: 'Aug', value: 4100 },
  { name: 'Sep', value: 1230 },
];

export type ChartSlice = { name: string; value: number };

export const groupByMonth = (items: { date: string; amount: number }[]): ChartSlice[] => {
  const groups = new Map<string, number>();
  items.forEach((item) => {
    const month = new Date(item.date).toLocaleString('en-US', { month: 'short' });
    groups.set(month, (groups.get(month) ?? 0) + item.amount);
  });
  const order = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return [...groups.entries()]
    .sort(([a], [b]) => order.indexOf(a) - order.indexOf(b))
    .map(([name, value]) => ({ name, value }));
};

export const groupByField = <T extends { amount: number }>(
  items: T[],
  key: keyof T & string
): ChartSlice[] => {
  const groups = new Map<string, number>();
  items.forEach((item) => {
    const name = String(item[key]);
    groups.set(name, (groups.get(name) ?? 0) + Number(item.amount));
  });
  return [...groups.entries()].map(([name, value]) => ({ name, value }));
};
