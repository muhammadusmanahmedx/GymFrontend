import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Receipt, Filter } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatCurrency } from '@/data/mockData';
import { useData } from '@/contexts/DataContext';
import * as expensesApi from '@/services/expensesApi';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const categoryColors: Record<string, string> = {
  equipment: 'bg-primary/10 text-primary border-primary/20',
  utilities: 'bg-muted text-muted-foreground border-border',
  rent: 'bg-muted text-muted-foreground border-border',
  salary: 'bg-success/10 text-success border-success/20',
  maintenance: 'bg-warning/10 text-warning border-warning/20',
  other: 'bg-muted text-muted-foreground border-border',
};

// months will be generated from user's registration month through next month

const Expenses = () => {
  const { expenses, refreshAll } = useData();
  const { user } = useAuth();
  const [months, setMonths] = useState<{ value: string; label: string }[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'other' as any,
    date: new Date().toISOString().split('T')[0],
  });

  const { toast } = useToast();

  const filteredExpenses = (Array.isArray(expenses) ? expenses : []).filter((expense: any) => {
    if (selectedMonth === 'all') return true;
    const d = expense.date || expense.createdAt || expense.dateString || '';
    return String(d).startsWith(selectedMonth);
  });

  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    (async () => {
      try {
        const gymId = (user as any)?.gymId || (user as any)?._id || (user as any)?.id;
        if (!gymId) throw new Error('No gym id available for current user');
        const payload = {
          gymId,
          description: formData.description,
          amount: parseFloat(formData.amount),
          category: formData.category,
          date: formData.date,
        };
        const created: any = await expensesApi.createExpense(payload);
        try {
          await refreshAll();
        } catch (e) {
          // ignore; UI will update on next refresh
        }
        setIsModalOpen(false);
        setFormData({ description: '', amount: '', category: 'other', date: new Date().toISOString().split('T')[0] });
        toast({ title: 'Expense added', description: `${formData.description} - ${formatCurrency(parseFloat(formData.amount))} recorded.` });
      } catch (err: any) {
        toast({ title: 'Error', description: err?.message || 'Failed to add expense', variant: 'destructive' });
      }
    })();
  };

  useEffect(() => {
    // generate month filter range based on user's registration date
    (function generateMonths() {
      const monthsArr: { value: string; label: string }[] = [];
      monthsArr.push({ value: 'all', label: 'All Months' });
      let start: Date;
      if (user && (user as any).createdAt) {
        start = new Date((user as any).createdAt);
      } else if (user && (user as any).registeredAt) {
        start = new Date((user as any).registeredAt);
      } else {
        // fallback to 6 months ago
        start = new Date();
        start.setMonth(start.getMonth() - 6);
      }
      // normalize to first day of month
      start = new Date(Date.UTC(start.getFullYear(), start.getMonth(), 1));

      const now = new Date();
      // include next month as it goes on
      const end = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1));

      let cursor = new Date(start);
      while (cursor <= end) {
        const y = cursor.getUTCFullYear();
        const m = cursor.getUTCMonth();
        const value = `${y}-${String(m + 1).padStart(2, '0')}`;
        const label = cursor.toLocaleString(undefined, { month: 'long', year: 'numeric' });
        monthsArr.push({ value, label });
        cursor = new Date(Date.UTC(y, m + 1, 1));
      }

      setMonths(monthsArr);
    })();
  }, [user]);

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Expenses</h1>
            <p className="text-sm text-muted-foreground">
              Track and manage your gym expenses
            </p>
          </div>
          <Button variant="hero" onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>

        {/* Filter & Total */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Filter className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem key={month.value} value={month.value}>
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-xl border border-primary/20 bg-primary/10 px-4 sm:px-6 py-3">
            <p className="text-xs sm:text-sm font-medium text-primary">Total Expenses</p>
            <p className="text-xl sm:text-2xl font-bold text-primary">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="space-y-3 sm:hidden">
          {filteredExpenses.map((expense) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted flex-shrink-0">
                    <Receipt className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">{expense.description}</p>
                    <p className="text-sm text-muted-foreground">{expense.date}</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs capitalize ${categoryColors[expense.category]}`}
                >
                  {expense.category}
                </Badge>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-foreground">
                  {formatCurrency(expense.amount)}
                </span>
              </div>
            </motion.div>
          ))}
          
          {filteredExpenses.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No expenses found for the selected period.
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
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <Receipt className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <span className="font-medium text-foreground">
                          {expense.description}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`capitalize ${categoryColors[expense.category]}`}
                      >
                        {expense.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {expense.date}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(expense.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredExpenses.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              No expenses found for the selected period.
            </div>
          )}
        </motion.div>

        {/* Add Expense Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="mx-4 sm:mx-auto sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  required
                  placeholder="What was this expense for?"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="amount">Amount (Rs)</Label>
                <Input
                  id="amount"
                  type="number"
                  required
                  min="0"
                  step="1"
                  placeholder="0"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, amount: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: any) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="rent">Rent</SelectItem>
                    <SelectItem value="salary">Salary</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="mt-1"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="hero" className="w-full sm:w-auto">
                  Add Expense
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Expenses;
