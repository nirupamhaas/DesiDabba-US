import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MenuItem, AISearchResult } from "../types";

// Initialize standard Gemini client
// NOTE: We only initialize this when needed to ensure we have the latest key if it changes, 
// but for this simple app it's okay to hold the reference if the env var is static.
// Following best practices, we'll instantiate inside the call if we expect dynamic keys,
// but here we assume a static process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const searchMenuWithAI = async (query: string, menu: MenuItem[]): Promise<AISearchResult> => {
  if (!process.env.API_KEY) {
      console.warn("Gemini API Key not found. Returning empty results.");
      return { itemIds: [], reasoning: "AI service unavailable (missing API key)." };
  }

  const model = "gemini-2.5-flash";

  // Simplify menu for token efficiency, only sending what's needed for decision making
  const simplifiedMenu = menu.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    category: item.category,
    price: item.price,
    tags: item.tags.join(', ')
  }));

  const systemInstruction = `
    You are an intelligent maître d' for a restaurant. 
    Your goal is to recommend the best matching items from the supplied MENU based on the user's natural language query.
    - Analyze the user's request (e.g., "healthy options under $15", "something spicy for 2 people").
    - Look at item descriptions, tags, categories, and prices in the MENU.
    - Return a list of matching 'id's.
    - Provide a very brief, friendly reasoning for your selection (max 1 sentence).
    - If nothing matches well, return an empty list and polite reasoning.
  `;

  const jsonSchema: Schema = {
      type: Type.OBJECT,
      properties: {
          itemIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of exact 'id's from the menu that best match the query."
          },
          reasoning: {
              type: Type.STRING,
              description: "A brief, friendly explanation of why these items were chosen."
          }
      },
      required: ["itemIds", "reasoning"]
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
            { text: `MENU DATA: ${JSON.stringify(simplifiedMenu)}` },
            { text: `USER QUERY: "${query}"` }
        ]
      },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: jsonSchema,
        temperature: 0.3 // Keep it relatively deterministic for search
      }
    });

    const responseText = response.text;
    if (!responseText) {
        throw new Error("Empty response from AI");
    }

    return JSON.parse(responseText) as AISearchResult;

  } catch (error) {
    console.error("AI Menu Search Error:", error);
    return {
        itemIds: [],
        reasoning: "Sorry, I'm having trouble reading the menu right now. Please try browsing standard categories."
    };
  }
};
