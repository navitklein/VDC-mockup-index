
import { GoogleGenAI } from "@google/genai";
import { Mockup } from "../types";

export const getGeminiResponse = async (userPrompt: string, mockups: Mockup[]) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    const context = `
      You are the VDC (Virtual Design Center) Assistant. 
      Your job is to help developers navigate and understand the mockup index.
      
      Current Mockups:
      ${mockups.map(m => `- ${m.title} (${m.status}): ${m.description}
        Author: ${m.author}, Version: ${m.version}
        Azure Task: ${m.azureUrl || 'No task linked'}
        Documentation: ${m.docsUrl || 'No docs linked'}`).join('\n')}
      
      Rules:
      1. Be concise and professional.
      2. If asked about status, provide summaries.
      3. If a user asks for documentation or a task link for a specific mockup, provide it.
      4. If asked for a "best starting point", recommend the ones in 'In Development' or 'In Review'.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: context,
        temperature: 0.7,
      },
    });

    return response.text || "I'm sorry, I couldn't process that request.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Could not connect to AI assistant.";
  }
};
