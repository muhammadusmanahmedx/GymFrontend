import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Check,
  UserX,
  UserCheck,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { mockMembers, mockFees, Member, Fee, formatCurrency, defaultSettings } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const statusColors = {
  paid: 'bg-success/10 text-success border-success/20',
  pending: 'bg-warning/10 text-warning border-warning/20',
  overdue: 'bg-destructive/10 text-destructive border-destructive/20',
};

const MemberDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('gymMembers');
    return saved ? JSON.parse(saved) : mockMembers;
  });
  
  const [fees, setFees] = useState<Fee[]>(() => {
    const saved = localStorage.getItem('gymFees');
    return saved ? JSON.parse(saved) : mockFees;
  });

  const [settings] = useState(() => {
    const saved = localStorage.getItem('gymSettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const member = members.find((m) => m.id === id);
  const memberFees = fees.filter((f) => f.memberId === id);

  useEffect(() => {
    localStorage.setItem('gymMembers', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('gymFees', JSON.stringify(fees));
  }, [fees]);

  if (!member) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground">Member not found</p>
          <Button variant="outline" onClick={() => navigate('/members')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Members
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const handleToggleStatus = () => {
    const newStatus = member.status === 'active' ? 'left' : 'active';
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: newStatus } : m
      )
    );
    toast({
      title: newStatus === 'left' ? 'Member marked as left' : 'Member reactivated',
      description: `${member.name} has been ${newStatus === 'left' ? 'marked as left' : 'reactivated'}.`,
    });
  };

  const handleMarkFeePaid = (feeId: string) => {
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
    
    // Also update member's fee status
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, feeStatus: 'paid', lastPayment: new Date().toISOString().split('T')[0] }
          : m
      )
    );
    
    toast({
      title: 'Fee marked as paid',
      description: `Payment recorded for ${member.name}.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate('/members')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Members
        </Button>

        {/* Member Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-foreground">{member.name}</h1>
                  <Badge
                    variant="outline"
                    className={member.status === 'active' 
                      ? 'bg-success/10 text-success border-success/20' 
                      : 'bg-muted text-muted-foreground border-border'
                    }
                  >
                    {member.status === 'active' ? 'Active' : 'Left'}
                  </Badge>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Joined: {member.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="rounded-lg border border-border bg-card p-4 text-center">
                <p className="text-sm text-muted-foreground">Monthly Fee</p>
                <p className="text-xl font-bold text-foreground">
                  {formatCurrency(settings.monthlyFee)}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4 text-center">
                <p className="text-sm text-muted-foreground">Current Status</p>
                <Badge
                  variant="outline"
                  className={`mt-1 capitalize ${statusColors[member.feeStatus]}`}
                >
                  {member.feeStatus}
                </Badge>
              </div>
              <Button
                variant={member.status === 'active' ? 'outline' : 'hero'}
                onClick={handleToggleStatus}
              >
                {member.status === 'active' ? (
                  <>
                    <UserX className="mr-2 h-4 w-4" />
                    Mark as Left
                  </>
                ) : (
                  <>
                    <UserCheck className="mr-2 h-4 w-4" />
                    Reactivate
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Fee History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Fee History</h2>
              <p className="text-sm text-muted-foreground">
                Payment records for this member
              </p>
            </div>
          </div>

          {memberFees.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Month</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Paid Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {memberFees.map((fee) => (
                    <TableRow key={fee.id}>
                      <TableCell className="font-medium">{fee.month}</TableCell>
                      <TableCell>{formatCurrency(fee.amount)}</TableCell>
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
                            onClick={() => handleMarkFeePaid(fee.id)}
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
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              No fee records found for this member.
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default MemberDetails;
