import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { defaultSettings, GymSettings, formatCurrency } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const [settings, setSettings] = useState<GymSettings>(() => {
    const saved = localStorage.getItem('gymSettings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });
  const { toast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('gymSettings', JSON.stringify(settings));
    toast({
      title: 'Settings saved',
      description: 'Your gym settings have been updated successfully.',
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Configure your gym settings
          </p>
        </div>

        {/* Settings Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl rounded-xl border border-border bg-card p-6"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <SettingsIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Gym Configuration
              </h2>
              <p className="text-sm text-muted-foreground">
                Set your global gym fee and details
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <Label htmlFor="gymName">Gym Name</Label>
              <Input
                id="gymName"
                required
                placeholder="Your Gym Name"
                value={settings.gymName}
                onChange={(e) =>
                  setSettings((prev) => ({ ...prev, gymName: e.target.value }))
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="monthlyFee">Monthly Fee (Rs)</Label>
              <Input
                id="monthlyFee"
                type="number"
                required
                min="0"
                step="100"
                placeholder="3000"
                value={settings.monthlyFee}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    monthlyFee: parseFloat(e.target.value) || 0,
                  }))
                }
                className="mt-1"
              />
              <p className="mt-2 text-sm text-muted-foreground">
                This fee will be applied to all members. Current: {formatCurrency(settings.monthlyFee)}
              </p>
            </div>

            <Button type="submit" variant="hero" className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
