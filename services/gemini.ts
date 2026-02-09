
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { ProductData, AnalysisResult } from "../types";

export async function analyzeSku(
  selectedSku: ProductData,
  competitors: ProductData[],
  guidelineParts: { inlineData: { data: string; mimeType: string } }[],
  companyName: string,
  guidelineText?: string
): Promise<AnalysisResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Analyze this product for company: ${companyName}.
    
    SELECTED SKU:
    ${JSON.stringify(selectedSku, null, 2)}
    
    COMPETITORS:
    ${JSON.stringify(competitors, null, 2)}
    
    ${guidelineText ? `RAW GUIDELINE DATA (Consumed as Text Fallback):\n${guidelineText}` : `Please provide the comparison report based on the attached PDF guidelines.`}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { text: prompt },
        ...guidelineParts
      ]
    },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER, description: 'Overall efficiency score 0-100' },
          comparison: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                metric: { type: Type.STRING },
                skuValue: { type: Type.NUMBER },
                competitorAvg: { type: Type.NUMBER },
                recommendation: { type: Type.STRING }
              },
              required: ['metric', 'skuValue', 'competitorAvg', 'recommendation']
            }
          },
          topEdits: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              bullets: { type: Type.STRING },
              description: { type: Type.STRING },
              rulesLink: { type: Type.STRING },
              competitorRef: { type: Type.STRING }
            },
            required: ['title', 'bullets', 'description', 'rulesLink', 'competitorRef']
          },
          complianceCheck: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                status: { type: Type.STRING, description: 'pass, fail, or warning' },
                issue: { type: Type.STRING }
              },
              required: ['status', 'issue']
            }
          }
        },
        required: ['score', 'comparison', 'topEdits', 'complianceCheck']
      }
    },
  });

  try {
    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    const data = JSON.parse(text);
    return data as AnalysisResult;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Invalid analysis result from AI core. Please check input parameters.");
  }
}
