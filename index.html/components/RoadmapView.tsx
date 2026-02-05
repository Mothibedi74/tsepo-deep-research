import React, { useEffect } from 'react';
import { CheckCircle2, Clock, Rocket, Zap, Shield, TrendingUp, Sparkles, MessageSquare, ChevronLeft } from 'lucide-react';

const ROADMAP_DATA = [
  {
    phase: "Phase 1: Foundation",
    status: "Completed",
    items: [
      "Core DeepResearch AI Engine development",
      "Gemini 3 Pro integration for deep reasoning",
      "Live Web Search grounding for real-time intel",
      "Responsive Dark Mode Dashboard UI"
    ],
    icon: <Rocket className="w-5 h-5" />,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20"
  },
  {
    phase: "Phase 2: Intelligence +",
    status: "In Progress",
    items: [
      "Kill Script V2 with emotional sentiment analysis",
      "One-click PDF Export for sales battlecards",
      "CRM Connectors (HubSpot, Salesforce, Pipedrive)",
      "Multi-competitor comparison matrix"
    ],
    icon: <Zap className="w-5 h-5" />,
    color: "text-brand-400",
    bgColor: "bg-brand-500/10",
    borderColor: "border-brand-500/20"
  },
  {
    phase: "Phase 3: Automation",
    status: "Planned (Q3 2025)",
    items: [
      "Slack/Discord alerts for competitor pricing updates",
      "Developer API V1 public release",
      "White-labeled reports for agencies",
      "Collaborative Team Workspaces"
    ],
    icon: <Shield className="w-5 h-5" />,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20"
  },
  {
    phase: "Phase 4: Predictive",
    status: "2026 Strategy",
    items: [
      "AI Market Trend Prediction algorithms",
      "Automated SWOT updates via social listening",
      "Historical messaging evolution tracking",
      "Voice-enabled Sales Coach (Live API)"
    ],
    icon: <TrendingUp className="w-5 h-5" />,
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20"
  }
];

interface RoadmapViewProps {
  onBack: () => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ onBack }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-bold group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Research
        </button>
      </div>

      <div className="text-center mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3 h-3" />
          The Future of Intel
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Product Roadmap</h2>
        <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
          The plan to conquer the competitive intelligence market with AI-driven strategy.
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-brand-500/50 via-slate-800 to-transparent"></div>

        <div className="space-y-12">
          {ROADMAP_DATA.map((item, index) => (
            <div key={index} className="relative pl-24 group">
              <div className={`absolute left-[25px] top-0 w-4 h-4 rounded-full border-2 ${
                item.status === 'Completed' ? 'bg-emerald-500 border-emerald-500' : 
                item.status === 'In Progress' ? 'bg-brand-500 border-brand-500' : 'bg-slate-900 border-slate-700'
              } shadow-[0_0_15px_rgba(14,165,233,0.3)] z-10 group-hover:scale-125 transition-transform`}></div>

              <div className={`glass p-8 rounded-3xl border ${item.borderColor} hover:bg-slate-900/40 transition-all duration-300 relative overflow-hidden`}>
                <div className={`absolute top-0 right-0 p-8 opacity-5 ${item.color}`}>
                  {item.icon}
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-white mb-1">{item.phase}</h3>
                    <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${item.color}`}>
                      {item.status === 'Completed' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {item.status}
                    </div>
                  </div>
                  <div className={`hidden md:flex p-3 rounded-2xl ${item.bgColor} ${item.color}`}>
                    {item.icon}
                  </div>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {item.items.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-400 text-sm leading-relaxed">
                      <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${item.status === 'Completed' ? 'bg-emerald-500' : 'bg-brand-500'}`}></div>
                      {bullet}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-24 p-8 glass border-brand-500/20 rounded-3xl text-center space-y-6">
        <MessageSquare className="w-10 h-10 text-brand-400 mx-auto" />
        <h3 className="text-2xl font-bold text-white">Have a feature request?</h3>
        <p className="text-slate-400 max-w-lg mx-auto text-sm leading-relaxed">
          The Roadmap is shaped by user feedback. Let's build something that makes sense together!
        </p>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-brand-600 hover:bg-brand-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg"
        >
          Back to Top
        </button>
      </div>
    </div>
  );
};