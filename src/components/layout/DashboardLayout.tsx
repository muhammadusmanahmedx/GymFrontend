import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Receipt,
  LogOut,
  Dumbbell,
  Menu,
  X,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import SubscriptionBlockedModal from '@/components/SubscriptionBlockedModal';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Members', href: '/members', icon: Users },
  { name: 'Fees', href: '/fees', icon: CreditCard },
  { name: 'Expenses', href: '/expenses', icon: Receipt },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isBlocked = user?.subscriptionStatus === 'blocked';

  return (
    <>
      <SubscriptionBlockedModal isOpen={isBlocked} gymName={user?.gymName || ''} />
      
      <div className="flex min-h-screen bg-background">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-sidebar-border bg-sidebar transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-full flex-col">
            {/* Logo */}
            <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
              <Link to="/dashboard" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                  <Dumbbell className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-sidebar-foreground">
                  GymFlow
                </span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Gym name */}
            <div className="mx-4 my-4 rounded-lg bg-sidebar-accent p-3">
              <p className="text-xs text-sidebar-foreground/60">Managing</p>
              <p className="font-semibold text-sidebar-foreground truncate">
                {user?.gymName}
              </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute right-3 h-2 w-2 rounded-full bg-primary-foreground"
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* User & Logout */}
            <div className="border-t border-sidebar-border p-4">
              <div className="mb-3 rounded-lg bg-sidebar-accent p-3">
                <p className="text-sm font-medium text-sidebar-foreground">
                  {user?.name}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {user?.email}
                </p>
              </div>
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col">
          {/* Top bar */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-8">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="hidden lg:block">
              <h1 className="text-lg font-semibold">
                {navigation.find(n => n.href === location.pathname)?.name || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-auto p-4 lg:p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;
