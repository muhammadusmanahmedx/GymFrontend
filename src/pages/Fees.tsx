import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Check, Search, ChevronRight } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockFees, Fee, formatCurrency, defaultSettings, mockMembers, generateMockFees } from '@/data/mockData';
import * as feesApi from '@/services/feesApi';
import { useAuth } from '@/contexts/AuthContext';
import { authFetch } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const statusColors = {
  paid: 'bg-success/10 text-success border-success/20',
  pending: 'bg-warning/10 text-warning border-warning/20',
  overdue: 'bg-destructive/10 text-destructive border-destructive/20',
};

const Fees = () => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('gymSettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });
  const { user } = useAuth();

  const [fees, setFees] = useState<Fee[]>(() => {
    const saved = localStorage.getItem('gymFees');
    return saved ? JSON.parse(saved) : [];
  });

  // load authoritative settings
  useEffect(() => {
    (async () => {
      try {
        if (!user?._id && !user?.id) return;
        const userId = user._id || user.id;
        const res: any = await authFetch(`/settings/${encodeURIComponent(userId)}`);
        if (res && typeof res.monthlyFee === 'number') {
          setSettings((prev) => ({ ...prev, monthlyFee: res.monthlyFee }));
          try { localStorage.setItem('gymSettings', JSON.stringify({ ...settings, monthlyFee: res.monthlyFee })); } catch (e) { /* ignore */ }
        }
      } catch (e) {
        // ignore
      }
    })();
  }, [user]);

  // load fees from backend (fallback to mock-generated fees)
  useEffect(() => {
    (async () => {
      try {
        const res: any = await feesApi.getFees();
        const arr = Array.isArray(res) ? res : (res && Array.isArray(res.data) ? res.data : (res && Array.isArray(res.fees) ? res.fees : []));
        if (Array.isArray(arr) && arr.length > 0) {
          setFees(arr.map((f: any) => ({ id: f._id || f.id, memberId: String(f.memberId), memberName: f.memberName || f.member || '', amount: f.amount, month: f.month, dueDate: f.dueDate, status: f.status, paidDate: f.paidDate })));
        } else {
          // fallback
          const members = localStorage.getItem('gymMembers');
          setFees(generateMockFees(members ? JSON.parse(members) : mockMembers, settings.monthlyFee));
        }
      } catch (e) {
        const members = localStorage.getItem('gymMembers');
        setFees(generateMockFees(members ? JSON.parse(members) : mockMembers, settings.monthlyFee));
      }
    })();
  }, []);

  // listen for settings changes and re-fetch fees immediately
  useEffect(() => {
    const handler = (evt: Event) => {
      (async () => {
        try {
          const ce = evt as CustomEvent;
          const newSettings = ce?.detail || (localStorage.getItem('gymSettings') ? JSON.parse(localStorage.getItem('gymSettings') as string) : null);
          if (newSettings && typeof newSettings.monthlyFee === 'number') {
            setSettings((prev) => ({ ...prev, monthlyFee: newSettings.monthlyFee }));
            try { localStorage.setItem('gymSettings', JSON.stringify({ ...settings, monthlyFee: newSettings.monthlyFee })); } catch (e) { /* ignore */ }
          }
          try {
            const res: any = await feesApi.getFees();
            const arr = Array.isArray(res) ? res : (res && Array.isArray(res.data) ? res.data : (res && Array.isArray(res.fees) ? res.fees : []));
            if (Array.isArray(arr) && arr.length > 0) {
              setFees(arr.map((f: any) => ({ id: f._id || f.id, memberId: String(f.memberId), memberName: f.memberName || f.member || '', amount: f.amount, month: f.month, dueDate: f.dueDate, status: f.status, paidDate: f.paidDate })));
              return;
            }
          } catch (e) {
            // ignore
          }
          // fallback to regenerate mock fees using updated monthlyFee
          const members = localStorage.getItem('gymMembers');
          setFees(generateMockFees(members ? JSON.parse(members) : mockMembers, (newSettings && typeof newSettings.monthlyFee === 'number') ? newSettings.monthlyFee : settings.monthlyFee));
        } catch (e) {
          // ignore
        }
      })();
    };
    window.addEventListener('gymSettingsUpdated', handler as EventListener);
    return () => window.removeEventListener('gymSettingsUpdated', handler as EventListener);
  }, [settings]);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('gymFees', JSON.stringify(fees));
  }, [fees]);

  const filteredFees = fees.filter((fee) =>
    fee.memberName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMarkPaid = (feeId: string) => {
    setFees((prev) =>
      prev.map((fee) =>
        fee.id === feeId
          ? {
              ...fee,
              status: 'paid',
              paidDate: new Date().toISOString().split('T')[0],
            }
          : fee
      )
    );
    
    const fee = fees.find((f) => f.id === feeId);
    toast({
      title: 'Fee marked as paid',
      description: `Payment of ${formatCurrency(fee?.amount || 0)} from ${fee?.memberName} recorded.`,
    });
  };

  const paidCount = fees.filter((f) => f.status === 'paid').length;
  const pendingCount = fees.filter((f) => f.status === 'pending').length;
  const overdueCount = fees.filter((f) => f.status === 'overdue').length;

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Fee Management</h1>
          <p className="text-sm text-muted-foreground">
            Track and manage member fee payments
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="rounded-xl border border-success/20 bg-success/10 p-3 sm:p-4">
            <p className="text-xs sm:text-sm font-medium text-success">Paid</p>
            <p className="mt-1 text-xl sm:text-2xl font-bold text-success">{paidCount}</p>
          </div>
          <div className="rounded-xl border border-warning/20 bg-warning/10 p-3 sm:p-4">
            <p className="text-xs sm:text-sm font-medium text-warning">Pending</p>
            <p className="mt-1 text-xl sm:text-2xl font-bold text-warning">{pendingCount}</p>
          </div>
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 sm:p-4">
            <p className="text-xs sm:text-sm font-medium text-destructive">Overdue</p>
            <p className="mt-1 text-xl sm:text-2xl font-bold text-destructive">{overdueCount}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by member name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Mobile Card View */}
        <div className="space-y-3 sm:hidden">
          {filteredFees.map((fee) => (
            <motion.div
              key={fee.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">{fee.memberName}</p>
                    <p className="text-sm text-muted-foreground">Due: {fee.dueDate}</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs capitalize ${statusColors[fee.status]}`}
                >
                  {fee.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-foreground">
                  {formatCurrency(fee.amount)}
                </span>
                {fee.status !== 'paid' ? (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleMarkPaid(fee.id)}
                  >
                    <Check className="mr-1 h-4 w-4" />
                    Mark Paid
                  </Button>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Paid: {fee.paidDate}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
          
          {filteredFees.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No fees found matching your search.
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden sm:block rounded-xl border border-border bg-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paid Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFees.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">
                          {fee.memberName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(fee.amount)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {fee.dueDate}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`capitalize ${statusColors[fee.status]}`}
                      >
                        {fee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {fee.paidDate || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {fee.status !== 'paid' && (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleMarkPaid(fee.id)}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Mark Paid
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredFees.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              No fees found matching your search.
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Fees;
