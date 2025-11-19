
import { GoogleGenAI, Modality } from "@google/genai";

/**
 * Generates a food image using Gemini 2.5 Flash Image (Nano Banana).
 * @param itemName Name of the item to generate
 * @param description Description to help the prompt
 * @returns Base64 Data URI of the generated image
 */
export const generateFoodImage = async (itemName: string, description: string): Promise<string | null> => {
  try {
    // Initialize client lazily to avoid runtime errors during app startup if key is missing
    // const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // const prompt = `Professional food photography of ${itemName}. ${description}. Close up, high resolution, studio lighting, photorealistic, 4k, appetizing, vibrant colors.`;

    // const response = await ai.models.generateContent({
    //   model: 'gemini-2.5-flash-image',
    //   contents: {
    //     parts: [
    //       {
    //         text: prompt,
    //       },
    //     ],
    //   },
    //   config: {
    //     responseModalities: [Modality.IMAGE],
    //   },
    // });

    // // Extract image data
    // const part = response.candidates?.[0]?.content?.parts?.[0];
    // if (part && part.inlineData) {
    //   const base64ImageBytes = part.inlineData.data;
    //   // Assuming PNG based on typical API response, but could be JPEG. 
    //   // The API usually returns the mimeType in inlineData.mimeType.
    //   const mimeType = part.inlineData.mimeType || 'image/png';
    //   return `data:${mimeType};base64,${base64ImageBytes}`;
    // }
    
    return null;

  } catch (error) {
    console.error(`Failed to generate image for ${itemName}:`, error);
    return null;
  }
};
