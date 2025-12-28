export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  membershipType: 'monthly' | 'quarterly' | 'yearly';
  feeStatus: 'paid' | 'pending' | 'overdue';
  feeAmount: number;
  lastPayment?: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: 'equipment' | 'utilities' | 'rent' | 'salary' | 'maintenance' | 'other';
  date: string;
}

export interface Fee {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paidDate?: string;
}

export const mockMembers: Member[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@email.com',
    phone: '+1 234 567 890',
    joinDate: '2024-01-15',
    membershipType: 'monthly',
    feeStatus: 'paid',
    feeAmount: 50,
    lastPayment: '2024-12-01',
  },
  {
    id: '2',
    name: 'Sarah Williams',
    email: 'sarah@email.com',
    phone: '+1 234 567 891',
    joinDate: '2024-02-20',
    membershipType: 'yearly',
    feeStatus: 'paid',
    feeAmount: 480,
    lastPayment: '2024-06-01',
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@email.com',
    phone: '+1 234 567 892',
    joinDate: '2024-03-10',
    membershipType: 'monthly',
    feeStatus: 'pending',
    feeAmount: 50,
  },
  {
    id: '4',
    name: 'Emma Davis',
    email: 'emma@email.com',
    phone: '+1 234 567 893',
    joinDate: '2024-04-05',
    membershipType: 'quarterly',
    feeStatus: 'overdue',
    feeAmount: 135,
  },
  {
    id: '5',
    name: 'James Wilson',
    email: 'james@email.com',
    phone: '+1 234 567 894',
    joinDate: '2024-05-12',
    membershipType: 'monthly',
    feeStatus: 'paid',
    feeAmount: 50,
    lastPayment: '2024-12-05',
  },
  {
    id: '6',
    name: 'Lisa Anderson',
    email: 'lisa@email.com',
    phone: '+1 234 567 895',
    joinDate: '2024-06-01',
    membershipType: 'monthly',
    feeStatus: 'overdue',
    feeAmount: 50,
  },
  {
    id: '7',
    name: 'David Brown',
    email: 'david@email.com',
    phone: '+1 234 567 896',
    joinDate: '2024-07-18',
    membershipType: 'yearly',
    feeStatus: 'paid',
    feeAmount: 480,
    lastPayment: '2024-07-18',
  },
  {
    id: '8',
    name: 'Jennifer Taylor',
    email: 'jennifer@email.com',
    phone: '+1 234 567 897',
    joinDate: '2024-08-22',
    membershipType: 'monthly',
    feeStatus: 'pending',
    feeAmount: 50,
  },
];

export const mockExpenses: Expense[] = [
  { id: '1', description: 'New treadmill', amount: 2500, category: 'equipment', date: '2024-12-01' },
  { id: '2', description: 'Electricity bill', amount: 450, category: 'utilities', date: '2024-12-05' },
  { id: '3', description: 'Monthly rent', amount: 3000, category: 'rent', date: '2024-12-01' },
  { id: '4', description: 'Trainer salary', amount: 2000, category: 'salary', date: '2024-12-01' },
  { id: '5', description: 'AC repair', amount: 350, category: 'maintenance', date: '2024-12-10' },
  { id: '6', description: 'Water bill', amount: 120, category: 'utilities', date: '2024-11-05' },
  { id: '7', description: 'Dumbbells set', amount: 800, category: 'equipment', date: '2024-11-15' },
  { id: '8', description: 'Monthly rent', amount: 3000, category: 'rent', date: '2024-11-01' },
  { id: '9', description: 'Trainer salary', amount: 2000, category: 'salary', date: '2024-11-01' },
  { id: '10', description: 'Cleaning supplies', amount: 150, category: 'other', date: '2024-11-20' },
];

export const mockFees: Fee[] = mockMembers.map((member) => ({
  id: `fee-${member.id}`,
  memberId: member.id,
  memberName: member.name,
  amount: member.feeAmount,
  dueDate: '2024-12-01',
  status: member.feeStatus,
  paidDate: member.lastPayment,
}));

export const getDashboardStats = () => {
  const totalMembers = mockMembers.length;
  const paidFees = mockMembers.filter(m => m.feeStatus === 'paid').reduce((sum, m) => sum + m.feeAmount, 0);
  const pendingFees = mockMembers.filter(m => m.feeStatus === 'pending' || m.feeStatus === 'overdue').reduce((sum, m) => sum + m.feeAmount, 0);
  const defaulters = mockMembers.filter(m => m.feeStatus === 'overdue').length;
  const currentMonthExpenses = mockExpenses
    .filter(e => e.date.startsWith('2024-12'))
    .reduce((sum, e) => sum + e.amount, 0);
  
  return {
    totalMembers,
    feesCollected: paidFees,
    pendingFees,
    defaulters,
    monthlyExpenses: currentMonthExpenses,
  };
};
