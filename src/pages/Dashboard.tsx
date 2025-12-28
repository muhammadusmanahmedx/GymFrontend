import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, CreditCard, AlertTriangle, TrendingDown, Receipt } from 'lucide-react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/layout/DashboardLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import { getDashboardStats, mockMembers, Member, formatCurrency, defaultSettings } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const Dashboard = () => {
  const navigate = useNavigate();
  const [members] = useState<Member[]>(() => {
    const saved = localStorage.getItem('gymMembers');
    return saved ? JSON.parse(saved) : mockMembers;
  });

  const [settings] = useState(() => {
    const saved = localStorage.getItem('gymSettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const stats = getDashboardStats(members, settings.monthlyFee);
  const defaulters = members.filter(m => m.feeStatus === 'overdue' && m.status === 'active');

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-muted-foreground">
            Welcome back! Here's what's happening with your gym today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Members"
            value={stats.totalMembers}
            icon={Users}
            variant="primary"
            trend={{ value: 12, isPositive: true }}
            delay={0}
          />
          <StatsCard
            title="Fees Collected"
            value={formatCurrency(stats.feesCollected)}
            icon={CreditCard}
            variant="success"
            trend={{ value: 8, isPositive: true }}
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
            value={formatCurrency(stats.monthlyExpenses)}
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
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Defaulters List
              </h2>
              <p className="text-sm text-muted-foreground">
                Members with overdue payments
              </p>
            </div>
            <Badge variant="destructive" className="ml-auto">
              {stats.defaulters} members
            </Badge>
          </div>

          {defaulters.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Amount Due</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {defaulters.map((member) => (
                    <TableRow 
                      key={member.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => navigate(`/members/${member.id}`)}
                    >
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {member.email}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {member.phone}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-destructive">
                          {formatCurrency(settings.monthlyFee)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No defaulters! All fees are up to date.
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
