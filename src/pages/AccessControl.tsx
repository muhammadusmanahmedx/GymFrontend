import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { authFetch } from '@/lib/api';
import { format } from 'date-fns';

const AccessControl = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    setError(null);
      try {
      const data: any = await authFetch('/users', { method: 'GET' });
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error('access control load', msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const toggle = async (id: string, current: boolean) => {
    try {
      await authFetch(`/admin/users/${id}/authorize`, { method: 'PUT', body: JSON.stringify({ authorized: !current }) });
      setRows((r) => r.map((row) => (String(row._id || row.id) === String(id) ? { ...row, authorized: !current } : row)));
    } catch (e) {
      console.error('toggle auth', e);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-full mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Access Control</h2>
          <div className="flex items-center gap-3">
            <button onClick={load} className="text-sm text-primary underline">Refresh</button>
            <button onClick={handleLogout} className="text-sm text-destructive underline">Logout</button>
          </div>
        </div>
        <div className="rounded-lg border bg-card">
          <Table className="table-auto w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">ID</TableHead>
                <TableHead className="min-w-[8rem]">Username</TableHead>
                <TableHead className="min-w-[10rem]">Name</TableHead>
                <TableHead className="min-w-[12rem]">Email</TableHead>
                <TableHead className="min-w-[10rem]">Gym Name</TableHead>
                <TableHead className="min-w-[10rem]">Gym Location</TableHead>
                <TableHead className="min-w-[8rem]">Role</TableHead>
                <TableHead className="min-w-[12rem]">Authorized</TableHead>
                <TableHead className="w-32">Created</TableHead>
                <TableHead className="min-w-[12rem]">Last Updated</TableHead>
                <TableHead className="min-w-[6rem]">Gym ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11}>Loading...</TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-destructive">{error}</TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11}>No users found.</TableCell>
                </TableRow>
              ) : (
                rows.map((r, i) => (
                  <TableRow key={r._id || r.id || i}>
                    <TableCell className="break-all">{i + 1}</TableCell>
                    <TableCell>{r.username || '-'}</TableCell>
                    <TableCell>{r.name || '-'}</TableCell>
                    <TableCell>{r.email || '-'}</TableCell>
                    <TableCell>{r.gymName || '-'}</TableCell>
                    <TableCell>{r.gymLocation || '-'}</TableCell>
                    <TableCell>{r.role || '-'}</TableCell>
                    <TableCell className="min-w-[12rem]">
                      <Button size="sm" variant={r.authorized ? 'outline' : 'ghost'} onClick={() => toggle(r._id || r.id, !!r.authorized)}>
                        {r.authorized ? 'Authorized' : 'Unauthorized'}
                      </Button>
                    </TableCell>
                    <TableCell>{r.createdAt ? format(new Date(r.createdAt), 'yyyy-MM-dd') : '-'}</TableCell>
                    <TableCell>{r.updatedAt ? format(new Date(r.updatedAt), 'yyyy-MM-dd HH:mm') : '-'}</TableCell>
                    <TableCell className="break-all">{`g-${101 + i}`}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AccessControl;
