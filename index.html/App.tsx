
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { performDeepScan, getLiveNews, getTacticalRebuttals } from './geminiService';
import { Scanner } from './components/Scanner';
import { ResultsView } from './components/ResultsView';
import { LoadingOverlay } from './components/LoadingOverlay';
import { RoadmapView } from './components/RoadmapView';
import { AboutView } from './components/AboutView';
import { Modal } from './components/Modal';
import { ResearchResult, ScanStatus, NewsItem, TacticalRebuttal, User } from './types';
import { verifyLicenseAPI } from './mockCodes';
import { 
  AlertCircle, Search, Shield, Zap, Globe, 
  Target, Sparkles, ChevronDown, LogOut,
  Loader2, ExternalLink,
  Check, ArrowRight,
  ShieldCheck, Layout, MessageCircle, Trash2, Clock, History,
  Key, Share2, Info
} from 'lucide-react';

type ActiveModal = 'none' | 'signin' | 'privacy' | 'terms' | 'cheat-sheet' | 'live-content' | 'battlecard' | 'checkout-success';
type ActiveView = 'landing' | 'dashboard' | 'roadmap' | 'about';

// Production configuration for https://tsepo-deep-research-v2.vercel.app
const SITE_URL = 'https://tsepo-deep-research-v2.vercel.app';
const LS_CHECKOUT_URL = 'https://deepresearch.lemonsqueezy.com/buy/8e6c4333-e578-4f81-9f2d-74d3d237937e?embed=0&test_mode=1'; 

const App: React.FC = () => {
  // Navigation & Core State
  const [activeView, setActiveView] = useState<ActiveView>('landing');
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [recentScans, setRecentScans] = useState<ResearchResult[]>([]);
  
  // Input Data
  const [targetUrl, setTargetUrl] = useState('');
  const [homeUrl, setHomeUrl] = useState('');
  const [industry, setIndustry] = useState('SaaS / Software');
  
  // Modal & Dropdown UI State
  const [activeModal, setActiveModal] = useState<ActiveModal>('none');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  // Logic State
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [redeemCode, setRedeemCode] = useState('');
  const [isVerifyingLicense, setIsVerifyingLicense] = useState(false);
  
  // Secondary Loading States
  const [isNewsLoading, setIsNewsLoading] = useState(false);
  const [isKillScriptsLoading, setIsKillScriptsLoading] = useState(false);
  const [isBattlecardLoading, setIsBattlecardLoading] = useState(false);
  const [newsResults, setNewsResults] = useState<NewsItem[] | null>(null);
  const [tacticalRebuttals, setTacticalRebuttals] = useState<TacticalRebuttal[] | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  /**
   * navigateTo: Standard navigation utility for SPA behavior.
   * Ensures clicking Dashboard resets the scan view if requested.
   */
  const navigateTo = useCallback((view: ActiveView, resetResearch: boolean = false) => {
    setActiveView(view);
    setActiveModal('none');
    setError(null);
    setShowProfileDropdown(false);

    // If "Dashboard" link is clicked or landing requested, clear the active intelligence
    if (resetResearch || view === 'landing') {
      setResult(null);
      setStatus('idle');
      setTargetUrl('');
      setHomeUrl('');
    }

    // Manual popstate handling for seamless URL updates
    const path = view === 'landing' ? '/' : `/${view}`;
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Handle direct navigation or back buttons on Vercel
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/about') setActiveView('about');
      else if (path === '/roadmap') setActiveView('roadmap');
      else if (path === '/dashboard') setActiveView('dashboard');
      else setActiveView('landing');
    };
    handlePopState(); // Initial check
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync History on Init
  useEffect(() => {
    const saved = localStorage.getItem('DR_SCANS_HISTORY');
    if (saved) {
      try { setRecentScans(JSON.parse(saved)); } catch (e) { console.error("History parse failed", e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('DR_SCANS_HISTORY', JSON.stringify(recentScans));
  }, [recentScans]);

  // Authenticate user from local storage
  useEffect(() => {
    const checkAuth = async () => {
      const savedKey = localStorage.getItem('DR_LICENSE_KEY');
      if (savedKey) {
        setIsVerifyingLicense(true);
        const isValid = await verifyLicenseAPI(savedKey);
        setIsVerifyingLicense(false);
        setUser({
          name: 'Elite Member',
          credits: isValid ? 'Unlimited' : 0,
          tier: isValid ? 'Lifetime Pro' : 'Standard',
          isSubscribed: isValid,
          licenseKey: savedKey
        });
        // If they visit the root and are already subscribed, send them to dashboard
        if (isValid && window.location.pathname === '/') {
          setActiveView('dashboard');
        }
      } else {
        setUser({ name: 'Guest', credits: 0, tier: 'Standard', isSubscribed: false });
      }
    };
    checkAuth();
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeepScan = async () => {
    if (!targetUrl.trim() || !homeUrl.trim()) {
      setError("Critical Inputs Missing: Provide Target and Home Turf URLs.");
      return;
    }
    setIsBattlecardLoading(true);
    setStatus('scanning');
    setError(null);
    try {
      const data = await performDeepScan(targetUrl, homeUrl, industry);
      setResult(data);
      setRecentScans(prev => [data, ...prev.filter(s => s.targetUrl !== data.targetUrl)].slice(0, 10));
      setStatus('success');
    } catch (err: any) {
      setError("Intelligence Engine failure. Please re-run scan.");
      setStatus('error');
    } finally {
      setIsBattlecardLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!redeemCode.trim()) return;
    setIsVerifyingLicense(true);
    setError(null);
    const isPro = await verifyLicenseAPI(redeemCode);
    if (isPro) {
      localStorage.setItem('DR_LICENSE_KEY', redeemCode);
      setUser({ name: 'Elite Member', credits: 'Unlimited', tier: 'Lifetime Pro', isSubscribed: true, licenseKey: redeemCode });
      navigateTo('dashboard', true); // Success: transition to fresh dashboard
      setRedeemCode('');
    } else {
      setError("Redemption failed: Invalid license key.");
    }
    setIsVerifyingLicense(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem('DR_LICENSE_KEY');
    setUser({ name: 'Guest', credits: 0, tier: 'Standard', isSubscribed: false });
    setShowProfileDropdown(false);
    setResult(null);
    navigateTo('landing', true);
  };

  const getNavClass = (view: ActiveView) => {
    const isActive = activeView === view;
    return `px-4 py-2 rounded-xl transition-all relative group flex flex-col items-center gap-1 text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-brand-400 bg-brand-500/10 drop-shadow-[0_0_8px_rgba(14,165,233,0.5)]' : 'text-slate-500 hover:text-white hover:bg-slate-800/50'}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-200 selection:bg-brand-500/30">
      {/* Dynamic Navigation */}
      <nav className="glass sticky top-0 z-[60] border-b border-slate-800/50 px-6 py-4 shadow-2xl">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => navigateTo(user?.isSubscribed ? 'dashboard' : 'landing', true)}
          >
            <div className="bg-brand-500 p-2 rounded-xl shadow-[0_0_15px_rgba(14,165,233,0.3)] group-hover:scale-110 transition-transform">
                <Search className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-white uppercase italic">
              DEEP<span className="text-brand-500">RESEARCH</span>
            </span>
          </div>
          
          <div className="hidden lg:flex items-center space-x-2">
            <button 
              onClick={() => navigateTo(user?.isSubscribed ? 'dashboard' : 'landing', true)} 
              className={getNavClass(user?.isSubscribed ? 'dashboard' : 'landing')}
            >
              Dashboard
            </button>
            <button 
              onClick={() => navigateTo('roadmap')} 
              className={getNavClass('roadmap')}
            >
              Roadmap
            </button>
            <button 
              id="about-nav-btn"
              onClick={() => navigateTo('about')} 
              className={getNavClass('about')}
            >
              About
            </button>
            <div className="h-6 w-px bg-slate-800 mx-4"></div>
            {user?.isSubscribed ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)} 
                  className="flex items-center gap-3 text-white bg-slate-900 border border-slate-700/50 hover:border-brand-500/50 px-4 py-2 rounded-xl transition-all shadow-lg font-bold"
                >
                  <div className="w-6 h-6 rounded bg-brand-500 flex items-center justify-center text-[10px] font-black">{user.name[0]}</div>
                  <span className="text-xs">{user.name}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
                </button>
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-3 w-56 glass border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-1 animate-in slide-in-from-top-2 duration-200">
                    <button 
                      onClick={handleSignOut} 
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors font-black uppercase tracking-wider"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => setActiveModal('signin')} 
                className="bg-brand-600 hover:bg-brand-500 text-white px-6 py-2.5 rounded-xl transition-all font-black uppercase tracking-widest text-xs shadow-lg shadow-brand-600/20"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1 flex overflow-hidden">
        {/* Intelligence Workspace */}
        <div className="flex-1 overflow-y-auto bg-[#01040f]/50 relative">
          {activeView === 'roadmap' ? (
            <div className="container mx-auto px-4 py-12">
              <RoadmapView onBack={() => navigateTo(user?.isSubscribed ? 'dashboard' : 'landing')} />
            </div>
          ) : activeView === 'about' ? (
            <div className="container mx-auto px-4 py-12">
              <AboutView onBack={() => navigateTo(user?.isSubscribed ? 'dashboard' : 'landing')} />
            </div>
          ) : activeView === 'landing' ? (
            <LandingView 
              onGetStarted={() => user?.isSubscribed ? navigateTo('dashboard') : setActiveModal('signin')} 
              onUpgrade={() => window.open(LS_CHECKOUT_URL)} 
            />
          ) : (
            <div className="container mx-auto px-4 py-8 max-w-6xl">
               {status === 'scanning' ? (
                 <LoadingOverlay />
               ) : (
                 <div className="space-y-12 animate-in fade-in zoom-in duration-500">
                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                      <div className="space-y-1">
                        <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase">Intelligence Hub</h2>
                        <p className="text-slate-500 text-sm font-medium">Analyzing real-time web context to dismantle rivals.</p>
                      </div>
                      <Scanner 
                        compact 
                        onScan={handleDeepScan} 
                        isLoading={isBattlecardLoading} 
                        onUpdate={(t, h, i) => { setTargetUrl(t); setHomeUrl(h); setIndustry(i); }}
                        initialValues={{ target: targetUrl, home: homeUrl, industry }}
                        isSubscribed={!!user?.isSubscribed}
                      />
                   </div>

                   {result ? (
                     <ResultsView result={result} />
                   ) : (
                     <div className="py-40 text-center max-w-2xl mx-auto space-y-10">
                        <div className="w-32 h-32 bg-brand-500/10 rounded-[2.5rem] border border-brand-500/20 flex items-center justify-center mx-auto animate-pulse">
                           <Target className="w-14 h-14 text-brand-400" />
                        </div>
                        <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase">Scanning Offline</h2>
                        <p className="text-slate-500 text-xl font-medium">Input a target competitor to initialize the dismantling sequence.</p>
                     </div>
                   )}
                 </div>
               )}
            </div>
          )}
        </div>
      </main>

      {/* Authentication Modal */}
      <Modal isOpen={activeModal === 'signin'} onClose={() => setActiveModal('none')} title="Authenticate Elite Status">
        <form className="space-y-8" onSubmit={handleSignIn}>
          <div className="text-center space-y-2">
            <p className="text-slate-400 text-sm font-medium">Enter your Lifetime Access key to unlock deep reasoning.</p>
          </div>
          <div className="space-y-5">
            <div className="relative group">
              <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500" />
              <input 
                type="text" 
                value={redeemCode} 
                onChange={(e) => setRedeemCode(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:border-brand-500 font-mono text-center tracking-widest transition-all" 
                placeholder="DEEP-REDM-CODE" 
              />
            </div>
            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-xs font-black flex items-center gap-3 animate-in shake duration-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}
            <button 
              id="authenticate-btn"
              type="submit" 
              disabled={isVerifyingLicense} 
              className="w-full py-5 bg-brand-600 hover:bg-brand-500 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all shadow-xl shadow-brand-600/20"
            >
              {isVerifyingLicense ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
              {isVerifyingLicense ? 'Authorizing...' : 'Authenticate Elite Status'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const LandingView = ({ onGetStarted, onUpgrade }: any) => (
  <div className="animate-in fade-in duration-1000">
    <section className="relative pt-32 pb-48 px-6 text-center">
      <div className="container mx-auto max-w-5xl">
        <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-[10px] font-black uppercase tracking-[0.3em] mb-12 animate-pulse">
          <Sparkles className="w-4 h-4" /> Live Web Intelligence 2025
        </span>
        <h1 className="text-7xl md:text-9xl font-black text-white mb-10 tracking-tighter leading-none italic uppercase">
          Dismantle Rival <br/> <span className="text-brand-400">Strategies</span>
        </h1>
        <p className="text-slate-400 text-2xl max-w-3xl mx-auto mb-16 leading-relaxed font-medium">
          Elite competitive intelligence scanning the live web to generate tactical battlecards and kill scripts in seconds.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <button onClick={onGetStarted} className="px-12 py-6 bg-brand-600 hover:bg-brand-500 text-white rounded-[2rem] font-black text-xl shadow-2xl transition-all hover:scale-105 active:scale-95 uppercase tracking-widest italic">Initialize Scan</button>
          <button onClick={onUpgrade} className="px-12 py-6 glass border-slate-700 hover:border-brand-500 text-slate-300 rounded-[2rem] font-black text-xl transition-all uppercase tracking-widest italic">Lifetime Pro Access</button>
        </div>
      </div>
    </section>
  </div>
);

export default App;
