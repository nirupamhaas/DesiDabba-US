import { GoogleGenAI, Schema, Type } from "@google/genai";
import { MenuItem, AISearchResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function searchMenuWithAI(query: string, menuItems: MenuItem[]): Promise<AISearchResult> {
  const menuContext = menuItems.map(item => 
    `ID: ${item.id}, Name: ${item.name}, Description: ${item.description}, Tags: ${item.tags.join(', ')}`
  ).join('\n');

  const prompt = `
You are an expert AI Chef for DesiDabba, an authentic Indian meal delivery service.
Your task is to recommend the best matching rice option(s) from our menu based on the customer's request.

Here is the Rice Menu:
${menuContext}

Customer Request: "${query}"

Instructions:
1. Analyze the customer's request and match it with the most suitable rice option(s) from the menu.
2. If the request is vague, recommend our most popular or versatile option.
3. Provide a short, engaging, and friendly "Chef's reasoning" for your recommendation.
4. Return matching item IDs and the reasoning.

Respond ONLY with valid JSON matching the schema.
`;

  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      itemIds: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "Array of matching menu item IDs."
      },
      reasoning: {
        type: Type.STRING,
        description: "Friendly chef-like explanation for the recommendation."
      }
    },
    required: ["itemIds", "reasoning"],
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.7,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AISearchResult;
    }
    
    throw new Error("No text in AI response");

  } catch (error) {
    console.error("AI Recommendation Error:", error);
    // Fallback response
    return {
      itemIds: [],
      reasoning: "My culinary senses are a bit overwhelmed right now! Please choose your favorite rice from the list below."
    };
  }
}
