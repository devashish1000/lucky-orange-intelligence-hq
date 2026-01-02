
import { GoogleGenAI, Type } from "@google/genai";

// Use the mandatory initialization pattern as per Google GenAI SDK guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function askIntelligenceHQ(query: string, context: string) {
  try {
    const response = await ai.models.generateContent({
      // Using gemini-3-pro-preview for complex data-driven decision reasoning
      model: 'gemini-3-pro-preview',
      contents: `Context: ${context}\n\nUser Question: ${query}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Concise insight title without symbols or asterisks." },
                  description: { type: Type.STRING, description: "1-2 sentence scannable summary." },
                  category: { type: Type.STRING, description: "One of: Revenue, Retention, Adoption, Optimization." },
                  priority: { type: Type.STRING, description: "High, Medium, or Low." },
                  metrics: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        value: { type: Type.STRING, description: "The number or percentage, e.g., '22%' or '$18k'." },
                        label: { type: Type.STRING, description: "Short context label, e.g., 'Lower churn' or 'Revenue gain'." },
                        trend: { type: Type.STRING, description: "One of: positive, negative, neutral." }
                      },
                      required: ["value", "label", "trend"]
                    }
                  }
                },
                required: ["title", "description", "category", "priority", "metrics"]
              }
            }
          },
          required: ["insights"]
        },
        systemInstruction: `You are the "Lucky Orange Intelligence AI". 
        You analyze internal product and customer data to provide growth and retention intelligence.
        
        CRITICAL FORMATTING RULES:
        1. NO ASTERISKS (**) for emphasis.
        2. NO EMOJIS in text descriptions.
        3. Keep descriptions extremely concise (max 2 sentences).
        4. Focus on actionable growth, retention, and expansion insights.
        5. Extract specific numbers (percentages, dollar amounts) into the metrics array.
        6. Use a professional, executive-level tone.`,
      },
    });

    return response.text;
  } catch (error) {
    console.error("AI Query Error:", error);
    return JSON.stringify({
      insights: [{
        title: "Intelligence Engine Unavailable",
        description: "I'm having trouble connecting to the synthesis engine right now. Please try again in a moment.",
        category: "Optimization",
        priority: "Low",
        metrics: []
      }]
    });
  }
}
