
// Update GroundingChunk to be compatible with @google/genai SDK by making web properties optional
export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface NewsItem {
  title: string;
  url: string;
  snippet: string;
  date: string;
}

export interface TacticalRebuttal {
  objection: string;
  rebuttal: string;
  strategy: string;
}

export interface Battlecard {
  companyName: string;
  tagline: string;
  overview: string;
  strengths: string[];
  weaknesses: string[];
  keyFeatures: { feature: string; description: string }[];
  pricingModel: string;
}

export interface KillScript {
  openingHook: string;
  objections: {
    prospectSaying: string;
    yourRebuttal: string;
  }[];
  closingQuestion: string;
}

export interface ResearchResult {
  id: string;
  timestamp: number;
  targetUrl: string;
  homeUrl: string;
  industry: string;
  battlecard: Battlecard;
  killScript: KillScript;
  sources: GroundingChunk[];
  news?: NewsItem[];
  rebuttals?: TacticalRebuttal[];
}

export type ScanStatus = 'idle' | 'scanning' | 'success' | 'error';

export type AccountTier = 'Standard' | 'Lifetime Pro';

export interface User {
  name: string;
  credits: number | 'Unlimited';
  tier: AccountTier;
  licenseKey?: string;
  isSubscribed: boolean;
}
