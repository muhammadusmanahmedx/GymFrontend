import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Edit2,
  User,
  Mail,
  Phone,
  Eye,
  ChevronRight,
} from 'lucide-react';
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
import { mockMembers, Member, formatCurrency, defaultSettings } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { authFetch } from '@/lib/api';
import { useMembers } from '@/contexts/MembersContext';
import { useToast } from '@/hooks/use-toast';

const statusColors = {
  paid: 'bg-success/10 text-success border-success/20',
  pending: 'bg-warning/10 text-warning border-warning/20',
  overdue: 'bg-destructive/10 text-destructive border-destructive/20',
};

const Members = () => {
  const navigate = useNavigate();
  const { members, loading, create, update, remove, refresh } = useMembers();
  // local state for editing UI
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'left' | 'paid' | 'unpaid'>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: 'male',
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('gymSettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });
  const { user } = useAuth();

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
        // ignore and fall back to local/default
      }
    })();
  }, [user]);

  // listen for settings updates and refresh members UI
  useEffect(() => {
    const handler = (evt: Event) => {
      try {
        const ce = evt as CustomEvent;
        const newSettings = ce?.detail || (localStorage.getItem('gymSettings') ? JSON.parse(localStorage.getItem('gymSettings') as string) : null);
        if (newSettings && typeof newSettings.monthlyFee === 'number') {
          setSettings((prev) => ({ ...prev, monthlyFee: newSettings.monthlyFee }));
          try { if (typeof refresh === 'function') refresh(); } catch (e) { /* ignore */ }
        }
      } catch (e) {
        // ignore
      }
    };
    window.addEventListener('gymSettingsUpdated', handler as EventListener);
    return () => window.removeEventListener('gymSettingsUpdated', handler as EventListener);
  }, [refresh]);

  const { toast } = useToast();

  useEffect(() => {
    // keep local cache for quick offline fallback
    if (!loading && members.length) localStorage.setItem('gymMembers', JSON.stringify(members));
  }, [members, loading]);

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatusOrFee = (() => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'active' || statusFilter === 'left') return member.status === statusFilter;
      if (statusFilter === 'paid') return member.feeStatus === 'paid';
      if (statusFilter === 'unpaid') return member.feeStatus !== 'paid';
      return true;
    })();

    const matchesGender = (() => {
      if (genderFilter === 'all') return true;
      return (member as any).gender === genderFilter;
    })();

    return matchesSearch && matchesStatusOrFee && matchesGender;
  });

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (member: Member, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      gender: (member as any).gender || 'male',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    (async () => {
      try {
        if (editingMember) {
          await update(editingMember._id || editingMember.id, formData);
          toast({ title: 'Member updated', description: `${formData.name} has been updated successfully.` });
        } else {
          await create({ ...formData });
          toast({ title: 'Member added', description: `${formData.name} has been added successfully.` });
        }
        setIsModalOpen(false);
      } catch (err: any) {
        toast({ title: 'Error', description: err?.message || 'Failed to save member', variant: 'destructive' });
      }
    })();
  };

  const handleRowClick = (memberId: string) => {
    navigate(`/members/${memberId}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">Members</h1>
            <p className="text-sm text-muted-foreground">
              Manage your gym members
            </p>
          </div>
          <Button variant="hero" onClick={openAddModal} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v: 'all' | 'active' | 'left' | 'paid' | 'unpaid') => setStatusFilter(v)}>
            <SelectTrigger className="w-full sm:w-[220px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Members / Fees</SelectItem>
              <SelectItem value="active">Active Members</SelectItem>
              <SelectItem value="left">Left Members</SelectItem>
              <SelectItem value="paid">Members with Paid Fees</SelectItem>
              <SelectItem value="unpaid">Members with Pending / Unpaid Fees</SelectItem>
            </SelectContent>
          </Select>
          <Select value={genderFilter} onValueChange={(v: 'all' | 'male' | 'female') => setGenderFilter(v)}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mobile Card View */}
        <div className="space-y-3 sm:hidden">
          {filteredMembers.map((member) => {
            const memberId = member._id || member.id;
            return (
              <motion.div
                key={memberId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-border bg-card p-4 cursor-pointer active:bg-muted/50"
                onClick={() => handleRowClick(memberId)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate">{member.name}</p>
                      <p className="text-sm text-muted-foreground truncate">{member.phone}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0"
                    onClick={(e) => openEditModal(member, e)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex gap-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${member.status === 'active' 
                        ? 'bg-success/10 text-success border-success/20' 
                        : 'bg-muted text-muted-foreground border-border'
                      }`}
                    >
                      {member.status === 'active' ? 'Active' : 'Left'}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs capitalize ${statusColors[member.feeStatus]}`}
                    >
                      {member.feeStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <span className="text-sm font-medium text-foreground">
                      {formatCurrency(settings.monthlyFee)}
                    </span>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </motion.div>
            );
          })}
          
          {filteredMembers.length === 0 && (
            <div className="py-12 text-center text-muted-foreground text-sm">
              No members found matching your search.
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
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Fee Status</TableHead>
                  <TableHead>Monthly Fee</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => {
                  const memberId = member._id || member.id;
                  return (
                    <TableRow 
                      key={memberId} 
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleRowClick(memberId)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {member.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {member.phone}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={member.status === 'active' 
                            ? 'bg-success/10 text-success border-success/20' 
                            : 'bg-muted text-muted-foreground border-border'
                          }
                        >
                          {member.status === 'active' ? 'Active' : 'Left'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`capitalize ${statusColors[member.feeStatus]}`}
                        >
                          {member.feeStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {formatCurrency(settings.monthlyFee)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRowClick(memberId);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => openEditModal(member, e)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {filteredMembers.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              No members found matching your search.
            </div>
          )}
        </motion.div>

        {/* Add/Edit Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="mx-4 sm:mx-auto sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingMember ? 'Edit Member' : 'Add New Member'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    required
                    placeholder="Ali Hassan"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="ali@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    required
                    placeholder="+92 300 1234567"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="gender">Gender</Label>
                <div className="mt-1">
                  <Select value={formData.gender} onValueChange={(v: any) => setFormData((prev) => ({ ...prev, gender: v }))}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                Monthly fee: {formatCurrency(settings.monthlyFee)} (set in Settings)
              </p>

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
                  {editingMember ? 'Update Member' : 'Add Member'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Members;