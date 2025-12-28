import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CreditCard, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubscriptionBlockedModalProps {
  isOpen: boolean;
  gymName: string;
}

const SubscriptionBlockedModal: React.FC<SubscriptionBlockedModalProps> = ({ isOpen, gymName }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative mx-4 max-w-lg rounded-2xl border border-destructive/20 bg-card p-8 shadow-2xl"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                <AlertTriangle className="h-10 w-10 text-destructive" />
              </div>
              
              <h2 className="mb-2 text-2xl font-bold text-foreground">
                Subscription Blocked
              </h2>
              
              <p className="mb-6 text-muted-foreground">
                Access to <span className="font-semibold text-foreground">{gymName}</span> dashboard has been temporarily suspended due to payment issues.
              </p>
              
              <div className="mb-8 w-full rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">
                  Please renew your subscription to regain full access to all features including member management, fee tracking, and reports.
                </p>
              </div>
              
              <div className="flex w-full flex-col gap-3 sm:flex-row">
                <Button variant="hero" size="lg" className="flex-1">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Renew Subscription
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Support
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SubscriptionBlockedModal;
