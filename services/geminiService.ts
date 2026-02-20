
import { GoogleGenAI } from "@google/genai";
import { Tone } from "../types";

// Fix: Initialize GoogleGenAI with named parameter and direct process.env.API_KEY string.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const enhanceMessage = async (text: string, tone: Tone): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Improve this message for IIB Career Institute students.
        Original Text: "${text}"
        Required Tone: ${tone}
        
        Guidelines:
        1. Correct grammar and spelling.
        2. Make it professional yet engaging for students.
        3. Add relevant emojis.
        4. If the tone is URGENT, make it concise.
        5. If MOTIVATIONAL, add an inspiring touch.
        6. Return ONLY the enhanced message text without any explanations or quotes.`,
    });

    return response.text || text;
  } catch (error) {
    console.error("AI Enhancement failed:", error);
    return text;
  }
};
