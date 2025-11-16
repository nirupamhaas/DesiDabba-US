import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MenuItem, AISearchResult } from "../types";

// Browser-safe way to get the API key. In a real deployment, this might come
// from a config file or a secure endpoint, but here we safely check for its
// existence to prevent crashes.
const getApiKey = (): string => {
  if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
    return process.env.API_KEY;
  }
  return '';
};

const apiKey = getApiKey();
// Initialize the AI client. It's safe to do this even with an empty key;
// the error will be handled gracefully inside the function call.
const ai = new GoogleGenAI({ apiKey });

export const searchMenuWithAI = async (query: string, menu: MenuItem[]): Promise<AISearchResult> => {
  // Gracefully handle the case where the API key is not available.
  if (!apiKey) {
      console.warn("Gemini API Key not found. AI search is disabled.");
      return { itemIds: [], reasoning: "AI service is currently unavailable." };
  }

  const model = "gemini-2.5-flash";

  // Simplify menu for token efficiency
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
