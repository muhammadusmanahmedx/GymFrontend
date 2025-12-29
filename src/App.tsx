import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MembersProvider } from '@/contexts/MembersContext';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { DataProvider } from '@/contexts/DataContext';
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import MemberDetails from "./pages/MemberDetails";
import Fees from "./pages/Fees";
import Expenses from "./pages/Expenses";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import AccessControl from "./pages/AccessControl";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <MembersProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </TooltipProvider>
          </MembersProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;

const AppRoutes: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  // If logged in as superbadmin, expose only the Access Control screen
  if (isAuthenticated && (user as any)?.role === 'superbadmin') {
    return (
      <Routes>
        <Route path="/access-control" element={<AccessControl />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/access-control" replace />} />
      </Routes>
    );
  }

  const Private: React.FC<{ children: JSX.Element }> = ({ children }) => {
    if (!isAuthenticated) return <Navigate to="/auth" replace />;
    return children;
  };

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
      <Route path="/members" element={<Private><Members /></Private>} />
      <Route path="/members/:id" element={<Private><MemberDetails /></Private>} />
      <Route path="/fees" element={<Private><Fees /></Private>} />
      <Route path="/expenses" element={<Private><Expenses /></Private>} />
      <Route path="/settings" element={<Private><Settings /></Private>} />
      <Route path="/access-control" element={<Private><AccessControl /></Private>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
