import { GoogleGenAI, Type } from "@google/genai";
import { ResearchResult, NewsItem, TacticalRebuttal, GroundingChunk } from "./types";

const SYSTEM_INSTRUCTION = `
You are the DeepResearch AI Strategic Engine. 
Your goal is to dismantle a competitor and provide actionable intelligence across three pillars:
1. LIVE WEB CONTEXT: Use Search Grounding to find current (2025) news, pricing changes, or recent customer complaints.
2. INSTANT BATTLECARDS: A comprehensive SWOT and feature breakdown comparing the Target URL to the Home Turf URL.
3. KILL SCRIPTS: Sharp, conversational rebuttals designed to pivot from Target's perceived strengths to our actual advantages.

Analyze their messaging vs the user's company.
OUTPUT REQUIREMENTS:
1. Output MUST be a single, valid JSON object.
2. Focus on how the Target URL's strengths are weaknesses compared to the Home Turf URL.
3. Use Search Grounding extensively for current market data.
4. Be tactical, precise, and professional.
`;

export const getLiveNews = async (targetUrl: string): Promise<{ news: NewsItem[], sources: GroundingChunk[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Find the latest 3-5 news articles, press releases, or blog posts for the company at ${targetUrl}. Focus on 2024-2025 developments. Output as JSON.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          news: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                url: { type: Type.STRING },
                snippet: { type: Type.STRING },
                date: { type: Type.STRING }
              },
              required: ["title", "url", "snippet"]
            }
          }
        },
        required: ["news"]
      }
    }
  });
  const data = JSON.parse(response.text || '{"news":[]}');
  const sources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || []) as GroundingChunk[];
  return { news: data.news, sources };
};

export const getTacticalRebuttals = async (targetUrl: string, homeUrl: string, industry: string): Promise<{ rebuttals: TacticalRebuttal[], sources: GroundingChunk[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate 4 high-impact tactical rebuttals for a sales call in the ${industry} industry. 
    Target Competitor: ${targetUrl}
    Our Product: ${homeUrl}
    Focus on specific vulnerabilities identified via live search like pricing tiers, missing integrations, or support complaints. Output as JSON.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          rebuttals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                objection: { type: Type.STRING },
                rebuttal: { type: Type.STRING },
                strategy: { type: Type.STRING }
              },
              required: ["objection", "rebuttal", "strategy"]
            }
          }
        },
        required: ["rebuttals"]
      }
    }
  });
  const data = JSON.parse(response.text || '{"rebuttals":[]}');
  const sources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || []) as GroundingChunk[];
  return { rebuttals: data.rebuttals, sources };
};

export const performDeepScan = async (targetUrl: string, homeUrl: string, industry: string): Promise<ResearchResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Execute a full competitive analysis for the ${industry} sector.
    Target: ${targetUrl}
    Home Turf: ${homeUrl}
    
    Leverage Google Search to provide up-to-the-minute intelligence from 2025. Output JSON only.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      tools: [{ googleSearch: {} }],
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          battlecard: {
            type: Type.OBJECT,
            properties: {
              companyName: { type: Type.STRING },
              tagline: { type: Type.STRING },
              overview: { type: Type.STRING },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              keyFeatures: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    feature: { type: Type.STRING },
                    description: { type: Type.STRING }
                  },
                  required: ["feature", "description"]
                }
              },
              pricingModel: { type: Type.STRING }
            },
            required: ["companyName", "tagline", "overview", "strengths", "weaknesses", "keyFeatures", "pricingModel"]
          },
          killScript: {
            type: Type.OBJECT,
            properties: {
              openingHook: { type: Type.STRING },
              objections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    prospectSaying: { type: Type.STRING },
                    yourRebuttal: { type: Type.STRING }
                  },
                  required: ["prospectSaying", "yourRebuttal"]
                }
              },
              closingQuestion: { type: Type.STRING }
            },
            required: ["openingHook", "objections", "closingQuestion"]
          }
        },
        required: ["battlecard", "killScript"]
      }
    }
  });

  const jsonText = response.text || '{}';
  const parsedData = JSON.parse(jsonText);
  const sources = (response.candidates?.[0]?.groundingMetadata?.groundingChunks || []) as GroundingChunk[];

  return {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    targetUrl,
    homeUrl,
    industry,
    battlecard: parsedData.battlecard,
    killScript: parsedData.killScript,
    sources: sources
  };
};