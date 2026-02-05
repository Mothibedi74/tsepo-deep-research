
import React from 'react';
import { Shield, Target, ExternalLink, Zap, AlertTriangle, TrendingUp, DollarSign, Quote, ArrowRight, CheckCircle2, Info, Globe, Sparkles, Newspaper, Calendar } from 'lucide-react';
import { ResearchResult } from '../types';

interface ResultsViewProps {
  result: ResearchResult;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ result }) => {
  const { battlecard, killScript, sources, news } = result;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-20 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 print:text-black print:bg-white print:p-0">
      
      {/* Pillar 1: Battlecard Header */}
      <div className="glass p-8 rounded-3xl border border-brand-500/20 shadow-xl relative overflow-hidden group print:shadow-none print:border-slate-300">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity print:hidden">
            <TrendingUp className="w-32 h-32 text-brand-400" />
        </div>
        <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-3 mb-4 print:hidden">
                <div className="bg-brand-500/20 p-2 rounded-lg">
                    <Zap className="w-6 h-6 text-brand-400" />
                </div>
                <span className="text-brand-400 font-bold tracking-widest text-xs uppercase bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">Executive Intelligence Report</span>
                {sources.length > 0 && (
                  <span className="text-emerald-400 font-bold tracking-widest text-xs uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                    <Globe className="w-3 h-3" />
                    Live Web Verified
                  </span>
                )}
            </div>
            <h2 className="text-4xl font-bold text-white print:text-black mb-2">{battlecard.companyName || "Competitor Profile"}</h2>
            <p className="text-brand-300 italic text-lg mb-4 print:text-slate-600">{battlecard.tagline}</p>
            <p className="text-slate-400 leading-relaxed max-w-3xl print:text-black">{battlecard.overview}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* News Sidebar (Pillar 1) */}
        <div className="space-y-6 lg:col-span-1 print:hidden">
          <div className="glass p-6 rounded-2xl border-slate-800 space-y-6">
            <h3 className="text-white font-bold flex items-center gap-2 text-sm uppercase tracking-widest">
              <Newspaper className="w-4 h-4 text-brand-400" />
              Latest Updates
            </h3>
            
            {news && news.length > 0 ? (
              <div className="space-y-4">
                {news.map((item, i) => (
                  <div key={i} className="group border-b border-slate-800 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-2">
                       <Calendar className="w-3 h-3 text-slate-500" />
                       <span className="text-[10px] text-slate-500 font-bold uppercase">{item.date || "Recent"}</span>
                    </div>
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="block text-slate-200 text-xs font-bold hover:text-brand-400 transition-colors mb-2 leading-tight">
                      {item.title}
                    </a>
                    <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">
                      {item.snippet}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Info className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                <p className="text-xs text-slate-600 italic leading-relaxed">Click "Live Web Content" on the dashboard to populate recent news scan.</p>
              </div>
            )}
          </div>
        </div>

        {/* Battlecard Core (Pillar 2) */}
        <div className="lg:col-span-3 space-y-8 print:col-span-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
            <div className="glass p-6 rounded-2xl border-emerald-500/20 print:border-slate-300 print:shadow-none">
              <div className="flex items-center gap-2 mb-4 text-emerald-400 print:text-emerald-700">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-wider text-sm">Key Strengths</h3>
              </div>
              <ul className="space-y-3">
                {battlecard.strengths?.map((s, i) => (
                  <li key={i} className="flex gap-3 text-slate-300 text-sm print:text-black">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500/30 shrink-0 mt-0.5 print:text-emerald-600" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass p-6 rounded-2xl border-rose-500/20 print:border-slate-300 print:shadow-none">
              <div className="flex items-center gap-2 mb-4 text-rose-400 print:text-rose-700">
                <Target className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-wider text-sm">Strategic Weaknesses</h3>
              </div>
              <ul className="space-y-3">
                {battlecard.weaknesses?.map((w, i) => (
                  <li key={i} className="flex gap-3 text-slate-300 text-sm print:text-black">
                    <AlertTriangle className="w-4 h-4 text-rose-500/30 shrink-0 mt-0.5 print:text-rose-600" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="glass rounded-2xl border-slate-700/50 overflow-hidden print:border-slate-300">
            <div className="bg-slate-800/50 px-6 py-4 border-b border-slate-700/50 flex justify-between items-center print:bg-slate-100">
              <h3 className="font-bold text-slate-100 flex items-center gap-2 print:text-black">
                <Shield className="w-5 h-5 text-brand-400" />
                Feature Comparison Matrix
              </h3>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/50 text-[10px] uppercase font-bold text-slate-500 tracking-widest print:bg-slate-50 print:text-black">
                  <tr>
                    <th className="px-6 py-3 border-b border-slate-800 print:border-slate-300">Feature</th>
                    <th className="px-6 py-3 border-b border-slate-800 print:border-slate-300">Target Capability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-slate-300">
                  {battlecard.keyFeatures?.map((f, i) => (
                    <tr key={i} className="hover:bg-slate-800/30 transition-colors print:hover:bg-transparent">
                      <td className="px-6 py-4 font-bold text-slate-200 print:text-black">{f.feature}</td>
                      <td className="px-6 py-4 text-slate-400 print:text-black leading-relaxed">{f.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl border-amber-500/20 print:border-slate-300">
            <div className="flex items-center gap-2 mb-4 text-amber-400 print:text-amber-700">
              <DollarSign className="w-5 h-5" />
              <h3 className="font-bold uppercase tracking-wider text-sm">Pricing Model & Commercial Intel</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed print:text-black">{battlecard.pricingModel}</p>
          </div>

          {/* Sources Section to satisfy @google/genai guidelines for Google Search grounding */}
          {sources && sources.length > 0 && (
            <div className="glass p-6 rounded-2xl border-slate-700/50 print:border-slate-300">
              <div className="flex items-center gap-2 mb-4 text-slate-300 print:text-black">
                <Globe className="w-5 h-5 text-brand-400" />
                <h3 className="font-bold uppercase tracking-wider text-sm">Research Sources</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {sources.map((source, idx) => source.web?.uri && (
                  <a 
                    key={idx} 
                    href={source.web.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-brand-500/50 hover:bg-slate-800 transition-all text-xs text-slate-400 hover:text-brand-400 print:text-black print:border-slate-300"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {source.web.title || "Reference Source"}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Kill Script Summary in Results for Print */}
          <div className="hidden print:block space-y-6 pt-8 border-t border-slate-300">
             <h3 className="text-xl font-black text-black uppercase italic">The Kill Script Summary</h3>
             <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                <div>
                   <span className="text-[10px] font-black uppercase text-slate-500">Opening Hook</span>
                   <p className="text-black italic font-medium">"{killScript.openingHook}"</p>
                </div>
                {killScript.objections?.slice(0, 2).map((obj, i) => (
                  <div key={i} className="space-y-1">
                     <p className="text-xs font-bold text-slate-500 italic">"Prospect: {obj.prospectSaying}"</p>
                     <p className="text-sm font-bold text-slate-800">"Response: {obj.yourRebuttal}"</p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
