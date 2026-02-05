
import React, { useState, useEffect } from 'react';
import { Loader2, ShieldCheck, Database, Search, Target } from 'lucide-react';

const MESSAGES = [
  "Bypassing robot.txt...",
  "Gathering pricing structures...",
  "Analyzing feature parity...",
  "Scouring public reviews...",
  "Dismantling value propositions...",
  "Correlating SWOT data...",
  "Generating strategic rebuttals...",
  "Finalizing kill script..."
];

export const LoadingOverlay: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-24 space-y-8">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 rounded-full border-4 border-brand-500/20 animate-pulse"></div>
        <div className="absolute inset-0 rounded-full border-t-4 border-brand-500 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <Search className="w-12 h-12 text-brand-400 animate-pulse" />
        </div>
      </div>
      
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-semibold text-white">Deep Scanning Competitor</h3>
        <p className="text-brand-400 font-medium tracking-wide animate-pulse h-6">
          {MESSAGES[messageIndex]}
        </p>
      </div>

      <div className="flex gap-4">
        <StatusIcon icon={<Database className="w-5 h-5" />} label="Live Data" active />
        <StatusIcon icon={<Target className="w-5 h-5" />} label="Analysis" active />
        <StatusIcon icon={<ShieldCheck className="w-5 h-5" />} label="Strategy" active />
      </div>
    </div>
  );
};

const StatusIcon = ({ icon, label, active }: { icon: React.ReactNode; label: string; active: boolean }) => (
  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${
    active ? 'border-brand-500/50 bg-brand-500/10 text-brand-400' : 'border-slate-800 bg-slate-900 text-slate-500'
  }`}>
    {icon}
    {label}
  </div>
);
