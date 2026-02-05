import React, { useEffect, useState, useRef } from 'react';
import { ChevronLeft, Quote, Globe, Heart, Shield, Sparkles, Camera, Upload, Target } from 'lucide-react';

interface AboutViewProps {
  onBack: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onBack }) => {
  const [founderPhoto, setFounderPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const saved = localStorage.getItem('DR_FOUNDER_PHOTO');
    if (saved) setFounderPhoto(saved);
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setFounderPhoto(base64);
        localStorage.setItem('DR_FOUNDER_PHOTO', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="mb-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors text-sm font-bold group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </button>
      </div>

      <article className="glass p-12 md:p-20 rounded-[3rem] border-slate-800 shadow-2xl relative overflow-hidden bg-gradient-to-b from-slate-900/50 to-slate-950/80">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <Target className="w-48 h-48 text-brand-500" />
        </div>

        <header className="relative z-10 text-center space-y-8 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-black uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            Founder's Mission
          </div>
          <h1 className="text-4xl md:text-6xl font-serif italic text-white leading-tight font-bold">
            The Mission Behind DeepResearch
          </h1>
          <div className="h-1 w-24 bg-brand-500/50 mx-auto rounded-full"></div>
        </header>

        <section className="serif-content space-y-10 text-xl md:text-2xl text-slate-300 leading-relaxed italic relative">
          <Quote className="absolute -top-10 -left-10 w-24 h-24 text-brand-500/5 -z-0" />
          
          <div className="relative z-10 space-y-10">
            <p>
              I built DeepResearch because I saw a gap in how modern founders stay competitive. Most tools give you raw data, but they don't give you tactical weaponry.
            </p>
            
            <p>
              My goal was to create an AI partner that doesn't just 'find' your competitors, but helps you dismantle their strategy in seconds. Whether you are a solo founder in South Africa or a sales lead in Silicon Valley, DeepResearch gives you the elite intelligence usually reserved for the biggest companies in the world.
            </p>

            <p>
              This is a human-led project. I am committed to building this in public and ensuring that every 'Lifetime' member gets value that far exceeds their investment.
            </p>

            <div className="pt-16 flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="relative">
                <div 
                  onClick={triggerUpload}
                  className="w-32 h-32 rounded-full bg-slate-800 border-4 border-brand-500/30 shadow-2xl overflow-hidden cursor-pointer hover:border-brand-400 transition-all group relative"
                >
                  {founderPhoto ? (
                    <img 
                      src={founderPhoto} 
                      alt="Founder" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-600 group-hover:text-brand-400 transition-colors">
                      <Upload className="w-8 h-8 mb-1" />
                      <span className="text-[10px] font-black uppercase tracking-tighter">Avatar</span>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handlePhotoUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              <div className="text-center md:text-left">
                <p className="text-white font-serif font-bold not-italic text-3xl tracking-tight">Tsepo Motsatse</p>
                <p className="text-brand-500 text-sm uppercase tracking-[0.3em] font-sans font-black mt-1">Founder, DeepResearch AI</p>
                <div className="h-px w-16 bg-brand-500 mt-4 md:mx-0 mx-auto opacity-50"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-24 pt-16 border-t border-slate-800/50">
          <div className="text-center space-y-8">
            <h2 className="text-2xl font-black text-white tracking-widest uppercase font-sans">Strategic Vision</h2>
            <p className="serif-content text-2xl text-slate-400 leading-relaxed max-w-2xl mx-auto italic">
              "Our mission is to democratize competitive intelligence. You shouldn't need a Fortune 500 budget to get Fortune 500 insights."
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 text-left font-sans">
              <div className="p-8 bg-slate-900/40 border border-slate-800/60 rounded-[2rem] flex items-start gap-5 hover:border-brand-500/30 transition-colors">
                <Shield className="w-8 h-8 text-brand-400 shrink-0" />
                <div>
                  <h4 className="text-white font-black uppercase tracking-wider text-sm mb-2">Ethical Sourcing</h4>
                  <p className="text-slate-500 text-xs leading-relaxed font-semibold">We analyze only publicly available web data to ensure global compliance and maximum strategic transparency.</p>
                </div>
              </div>
              <div className="p-8 bg-slate-900/40 border border-slate-800/60 rounded-[2rem] flex items-start gap-5 hover:border-brand-500/30 transition-colors">
                <Heart className="w-8 h-8 text-rose-500 shrink-0" />
                <div>
                  <h4 className="text-white font-black uppercase tracking-wider text-sm mb-2">Founder First</h4>
                  <p className="text-slate-500 text-xs leading-relaxed font-semibold">Built for agile teams who need to pivot fast and dismantle larger competitors with superior intelligence.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </article>

      <div className="mt-16 text-center">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">Designed & Authenticated in South Africa • 2025</p>
      </div>
    </div>
  );
};