
import React, { useEffect } from 'react';
import { Search, Globe, Zap, Target, Briefcase, Lock, Sparkles } from 'lucide-react';

interface ScannerProps {
  onScan: (targetUrl: string, homeUrl: string, industry: string) => void;
  isLoading: boolean;
  onUpdate: (targetUrl: string, homeUrl: string, industry: string) => void;
  initialValues: { target: string; home: string; industry: string };
  isSubscribed: boolean;
  compact?: boolean;
}

const INDUSTRIES = [
  "SaaS / Software",
  "Fintech",
  "EdTech",
  "HealthTech",
  "E-commerce",
  "Cybersecurity",
  "Artificial Intelligence",
  "Agency / Services",
  "CRM / Sales",
  "Productivity / SaaS",
  "Fintech / Payments"
];

export const Scanner: React.FC<ScannerProps> = ({ onScan, isLoading, onUpdate, initialValues, isSubscribed, compact }) => {
  const [targetUrl, setTargetUrl] = React.useState(initialValues.target);
  const [homeUrl, setHomeUrl] = React.useState(initialValues.home);
  const [industry, setIndustry] = React.useState(initialValues.industry);

  useEffect(() => {
    setTargetUrl(initialValues.target);
    setHomeUrl(initialValues.home);
    setIndustry(initialValues.industry);
  }, [initialValues]);

  useEffect(() => {
    onUpdate(targetUrl, homeUrl, industry);
  }, [targetUrl, homeUrl, industry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubscribed && targetUrl.trim() && homeUrl.trim()) {
      onScan(targetUrl.trim(), homeUrl.trim(), industry);
    }
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3 p-3 glass rounded-2xl border-slate-700/50">
        <div className="flex-1 min-w-[200px] flex items-center gap-3 px-3 py-1.5 bg-slate-900/50 rounded-xl border border-slate-700/50">
          <Globe className="w-4 h-4 text-emerald-400" />
          <input
            type="url"
            placeholder="Your URL"
            value={homeUrl}
            onChange={(e) => setHomeUrl(e.target.value)}
            className="bg-transparent border-none text-xs focus:ring-0 text-slate-100 p-0 w-full"
            required
          />
        </div>
        <div className="flex-1 min-w-[200px] flex items-center gap-3 px-3 py-1.5 bg-slate-900/50 rounded-xl border border-slate-700/50">
          <Target className="w-4 h-4 text-rose-400" />
          <input
            type="url"
            placeholder="Competitor URL"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            className="bg-transparent border-none text-xs focus:ring-0 text-slate-100 p-0 w-full"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !isSubscribed}
          className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
        >
          {isLoading ? <Zap className="w-3 h-3 animate-spin" /> : <Search className="w-3 h-3" />}
          {isLoading ? 'Scanning' : 'Research'}
        </button>
      </form>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-brand-400 via-indigo-400 to-brand-500 bg-clip-text text-transparent leading-[1.2] py-2">
          Competitive Intelligence
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Uncover rival vulnerabilities and win more deals with real-time web analysis.
        </p>
      </div>

      {!isSubscribed && (
        <div className="max-w-3xl mx-auto mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center gap-3 text-amber-400 animate-pulse">
          <Lock className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-wider">Authentication Required: Enter License Key</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className={`space-y-4 max-w-3xl mx-auto transition-opacity ${!isSubscribed ? 'opacity-50 grayscale-[0.5]' : ''}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="glass p-3 rounded-2xl border border-slate-700/50 flex items-center space-x-3 focus-within:border-brand-500/50 transition-colors">
            <Globe className="w-5 h-5 text-emerald-400" />
            <div className="flex-1">
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest">Your Home URL</label>
              <input
                type="url"
                placeholder="https://yourbrand.com"
                value={homeUrl}
                onChange={(e) => setHomeUrl(e.target.value)}
                disabled={isLoading || !isSubscribed}
                className="w-full bg-transparent border-none text-sm focus:ring-0 placeholder:text-slate-600 text-slate-100 p-0"
                required
              />
            </div>
          </div>
          
          <div className="glass p-3 rounded-2xl border border-slate-700/50 flex items-center space-x-3 focus-within:border-brand-500/50 transition-colors">
            <Target className="w-5 h-5 text-rose-400" />
            <div className="flex-1">
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest">Competitor Target</label>
              <input
                type="url"
                placeholder="https://competitor.io"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                disabled={isLoading || !isSubscribed}
                className="w-full bg-transparent border-none text-sm focus:ring-0 placeholder:text-slate-600 text-slate-100 p-0"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 glass p-3 rounded-2xl border border-slate-700/50 flex items-center space-x-3 focus-within:border-brand-500/50 transition-colors text-left">
            <Briefcase className="w-5 h-5 text-brand-400" />
            <div className="flex-1">
              <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-widest">Market Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                disabled={isLoading || !isSubscribed}
                className="w-full bg-transparent border-none text-sm focus:ring-0 text-slate-100 p-0 cursor-pointer appearance-none"
              >
                {INDUSTRIES.map(i => <option key={i} value={i} className="bg-slate-900">{i}</option>)}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !targetUrl || !homeUrl || !isSubscribed}
            className={`flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold transition-all shadow-lg md:min-w-[200px] ${
              isLoading || !targetUrl || !homeUrl || !isSubscribed
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-brand-600 hover:bg-brand-500 text-white hover:scale-[1.02] active:scale-95'
            }`}
          >
            {isLoading ? (
              <Zap className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            {isLoading ? 'Analyzing...' : 'Execute Deep Scan'}
          </button>
        </div>
      </form>
    </div>
  );
};
