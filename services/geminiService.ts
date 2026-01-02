
import { GoogleGenAI } from "@google/genai";

// Use the mandatory initialization pattern as per Google GenAI SDK guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function askIntelligenceHQ(query: string, context: string) {
  try {
    const response = await ai.models.generateContent({
      // Upgraded to gemini-3-pro-preview for complex data-driven decision reasoning
      model: 'gemini-3-pro-preview',
      contents: `Context: ${context}\n\nUser Question: ${query}`,
      config: {
        systemInstruction: `You are the "Lucky Orange Intelligence AI". 
        You analyze internal product and customer data to help Lucky Orange employees make data-driven decisions.
        Use a professional, insightful, and concise tone. 
        If specific data points are provided in context, use them. 
        Focus on actionable growth, retention, and expansion insights.
        Keep answers under 150 words.`,
      },
    });
    // Directly accessing the .text property from the response as per guidelines
    return response.text;
  } catch (error) {
    console.error("AI Query Error:", error);
    return "I'm sorry, I'm having trouble connecting to the intelligence engine right now. Please try again in a moment.";
  }
}
