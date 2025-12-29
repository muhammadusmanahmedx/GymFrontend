export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  gender?: 'male' | 'female';
  status: 'active' | 'left';
  feeStatus: 'paid' | 'pending' | 'overdue';
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
  month: string;
}

export interface GymSettings {
  monthlyFee: number;
  gymName: string;
}

export const defaultSettings: GymSettings = {
  monthlyFee: 3000,
  gymName: 'FitZone Gym',
};

export const mockMembers: Member[] = [
  {
    id: '1',
    name: 'Ali Hassan',
    email: 'ali@email.com',
    phone: '+92 300 1234567',
    joinDate: '2024-01-15',
    gender: 'male',
    status: 'active',
    feeStatus: 'paid',
    lastPayment: '2024-12-01',
  },
  {
    id: '2',
    name: 'Fatima Khan',
    email: 'fatima@email.com',
    phone: '+92 301 2345678',
    joinDate: '2024-02-20',
    gender: 'female',
    status: 'active',
    feeStatus: 'paid',
    lastPayment: '2024-06-01',
  },
  {
    id: '3',
    name: 'Ahmed Raza',
    email: 'ahmed@email.com',
    phone: '+92 302 3456789',
    joinDate: '2024-03-10',
    gender: 'male',
    status: 'active',
    feeStatus: 'pending',
  },
  {
    id: '4',
    name: 'Ayesha Malik',
    email: 'ayesha@email.com',
    phone: '+92 303 4567890',
    joinDate: '2024-04-05',
    gender: 'female',
    status: 'active',
    feeStatus: 'overdue',
  },
  {
    id: '5',
    name: 'Usman Ali',
    email: 'usman@email.com',
    phone: '+92 304 5678901',
    joinDate: '2024-05-12',
    gender: 'male',
    status: 'active',
    feeStatus: 'paid',
    lastPayment: '2024-12-05',
  },
  {
    id: '6',
    name: 'Sana Ahmed',
    email: 'sana@email.com',
    phone: '+92 305 6789012',
    joinDate: '2024-06-01',
    gender: 'female',
    status: 'active',
    feeStatus: 'overdue',
  },
  {
    id: '7',
    name: 'Bilal Shah',
    email: 'bilal@email.com',
    phone: '+92 306 7890123',
    joinDate: '2024-07-18',
    gender: 'male',
    status: 'left',
    feeStatus: 'paid',
    lastPayment: '2024-07-18',
  },
  {
    id: '8',
    name: 'Zainab Hussain',
    email: 'zainab@email.com',
    phone: '+92 307 8901234',
    joinDate: '2024-08-22',
    gender: 'female',
    status: 'active',
    feeStatus: 'pending',
  },
];

export const mockExpenses: Expense[] = [
  { id: '1', description: 'New treadmill', amount: 250000, category: 'equipment', date: '2024-12-01' },
  { id: '2', description: 'Electricity bill', amount: 45000, category: 'utilities', date: '2024-12-05' },
  { id: '3', description: 'Monthly rent', amount: 80000, category: 'rent', date: '2024-12-01' },
  { id: '4', description: 'Trainer salary', amount: 60000, category: 'salary', date: '2024-12-01' },
  { id: '5', description: 'AC repair', amount: 15000, category: 'maintenance', date: '2024-12-10' },
  { id: '6', description: 'Water bill', amount: 5000, category: 'utilities', date: '2024-11-05' },
  { id: '7', description: 'Dumbbells set', amount: 80000, category: 'equipment', date: '2024-11-15' },
  { id: '8', description: 'Monthly rent', amount: 80000, category: 'rent', date: '2024-11-01' },
  { id: '9', description: 'Trainer salary', amount: 60000, category: 'salary', date: '2024-11-01' },
  { id: '10', description: 'Cleaning supplies', amount: 8000, category: 'other', date: '2024-11-20' },
];

export const generateMockFees = (members: Member[], monthlyFee: number): Fee[] => {
  const fees: Fee[] = [];
  const months = ['2024-12', '2024-11', '2024-10'];
  
  members.forEach((member) => {
    if (member.status === 'active') {
      fees.push({
        id: `fee-${member.id}-2024-12`,
        memberId: member.id,
        memberName: member.name,
        amount: monthlyFee,
        dueDate: '2024-12-01',
        status: member.feeStatus,
        paidDate: member.lastPayment,
        month: '2024-12',
      });
    }
    
    // Add historical fees
    if (member.id === '1' || member.id === '2' || member.id === '5') {
      fees.push({
        id: `fee-${member.id}-2024-11`,
        memberId: member.id,
        memberName: member.name,
        amount: monthlyFee,
        dueDate: '2024-11-01',
        status: 'paid',
        paidDate: '2024-11-05',
        month: '2024-11',
      });
    }
  });
  
  return fees;
};

export const mockFees: Fee[] = generateMockFees(mockMembers, defaultSettings.monthlyFee);

export const getDashboardStats = (members: Member[] = mockMembers, monthlyFee: number = defaultSettings.monthlyFee) => {
  const activeMembers = members.filter(m => m.status === 'active');
  const totalMembers = activeMembers.length;
  const paidFees = activeMembers.filter(m => m.feeStatus === 'paid').length * monthlyFee;
  const pendingFees = activeMembers.filter(m => m.feeStatus === 'pending' || m.feeStatus === 'overdue').length * monthlyFee;
  const defaulters = activeMembers.filter(m => m.feeStatus === 'overdue').length;
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

export const formatCurrency = (amount: number): string => {
  return `Rs ${amount.toLocaleString()}`;
};
