import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, CreditCard, AlertTriangle, TrendingDown, Receipt, ChevronRight, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import * as expensesApi from '@/services/expensesApi';
import { useData } from '@/contexts/DataContext';
import StatsCard from '@/components/dashboard/StatsCard';
import { getDashboardStats, mockMembers, Member, formatCurrency, defaultSettings } from '@/data/mockData';
import { useMembers } from '@/contexts/MembersContext';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const statusColors = {
  paid: 'bg-success/10 text-success border-success/20',
  pending: 'bg-warning/10 text-warning border-warning/20',
  overdue: 'bg-destructive/10 text-destructive border-destructive/20',
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { members } = useMembers();

  const [settings] = useState(() => {
    const saved = localStorage.getItem('gymSettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const stats = getDashboardStats(members, settings.monthlyFee);
  const { expenses } = useData();
  const monthlyExpenses = useMemo(() => {
    const arr = Array.isArray(expenses) ? expenses : [];
    const now = new Date();
    const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    return arr
      .filter((e: any) => {
        const d = e.date || e.createdAt || e.dateString;
        if (!d) return false;
        return String(d).startsWith(ym);
      })
      .reduce((s: number, e: any) => s + (Number(e.amount) || 0), 0);
  }, [expenses]);
  // find latest unpaid fee entry for each active member
  const unpaidEntries = members
    .filter((m: any) => m.status === 'active')
    .map((m: any) => {
      const fh: any[] = Array.isArray(m.feeHistory) ? m.feeHistory : [];
      // sort by month or dueDate descending to find latest
      const sorted = fh
        .slice()
        .sort((a, b) => {
          const am = a.month || (a.dueDate ? a.dueDate.slice(0,7) : '');
          const bm = b.month || (b.dueDate ? b.dueDate.slice(0,7) : '');
          return bm.localeCompare(am);
        });
      const latestUnpaid = sorted.find((f) => f.status !== 'paid');
      return latestUnpaid ? { member: m, fee: latestUnpaid } : null;
    })
    .filter(Boolean) as Array<{ member: any; fee: any }>;

  // UI filters for unpaid table
  const [searchQuery, setSearchQuery] = useState('');
  const [monthFilter, setMonthFilter] = useState('all');

  const filteredUnpaid = unpaidEntries.filter(({ member, fee }) => {
    // search by name, email, phone, or month
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      const hay = `${member.name} ${member.email || ''} ${member.phone || ''} ${fee.month || ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (monthFilter !== 'all') {
      if ((fee.month || (fee.dueDate ? fee.dueDate.slice(0,7) : '')) !== monthFilter) return false;
    }
    return true;
  });

  // monthlyExpenses is derived from `expenses` provided by DataProvider

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground lg:text-3xl">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm sm:text-base text-muted-foreground">
            Welcome back! Here's what's happening with your gym today.
          </p>
          {/* Managing gym name */}
          <div className="mt-2 text-sm text-muted-foreground">
            Managing: <span className="font-medium text-foreground">{useAuth().user?.gymName || '—'}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatsCard
            title="Total Members"
            value={stats.totalMembers}
            icon={Users}
            variant="primary"
            // trend={{ value: 12, isPositive: true }}
            delay={0}
          />
          <StatsCard
            title="Fees Collected"
            value={formatCurrency(stats.feesCollected)}
            icon={CreditCard}
            variant="success"
            // trend={{ value: 8, isPositive: true }}
            delay={0.1}
          />
          <StatsCard
            title="Pending Fees"
            value={formatCurrency(stats.pendingFees)}
            icon={TrendingDown}
            variant="warning"
            delay={0.2}
          />
          <StatsCard
            title="Monthly Expenses"
            value={formatCurrency(monthlyExpenses)}
            icon={Receipt}
            variant="default"
            delay={0.3}
          />
        </div>

        {/* Defaulters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-xl border border-border bg-card p-4 sm:p-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-warning/10">
              <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-warning" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-foreground">
                Unpaid Fees
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Latest unpaid fee per active member
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search name, phone, month..."
                  value={searchQuery}
                  onChange={(e: any) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <div className="w-44 hidden sm:block">
                <Select value={monthFilter} onValueChange={(v: any) => setMonthFilter(v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All months" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All months</SelectItem>
                    {Array.from(new Set(unpaidEntries.map(u => u.fee.month || (u.fee.dueDate ? u.fee.dueDate.slice(0,7) : '')))).filter(Boolean).map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Badge variant="warning" className="text-xs">
                {filteredUnpaid.length}
              </Badge>
            </div>
          </div>

          {filteredUnpaid.length > 0 ? (
            <>
              {/* Mobile Card View */}
              <div className="space-y-3 sm:hidden">
                {filteredUnpaid.map(({ member, fee }) => (
                  <div
                    key={member._id || member.id}
                    className="rounded-lg border border-border bg-muted/30 p-3 cursor-pointer"
                    onClick={() => navigate(`/members/${member._id || member.id}`)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{member.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{member.phone}</p>
                      </div>
                      <Badge variant="outline" className={`text-xs capitalize ${statusColors[fee.status]}`}>
                        {fee.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Month:</span>
                      <span className="font-semibold">{fee.month || (fee.dueDate ? fee.dueDate.slice(0,7) : '-')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-semibold">{formatCurrency(fee.amount || settings.monthlyFee)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Month</TableHead>
                      <TableHead className="text-right">Amount Due</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUnpaid.map(({ member, fee }) => (
                      <TableRow 
                        key={member._id || member.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => navigate(`/members/${member._id || member.id}`)}
                      >
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell className="text-muted-foreground">{member.email}</TableCell>
                        <TableCell className="text-muted-foreground">{member.phone}</TableCell>
                        <TableCell>{fee.month || (fee.dueDate ? fee.dueDate.slice(0,10) : '-')}</TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold text-foreground">{formatCurrency(fee.amount || settings.monthlyFee)}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <div className="py-6 sm:py-8 text-center text-muted-foreground text-sm">
              No unpaid fees found for active members.
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
