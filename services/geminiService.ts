import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found.");
  }
  return new GoogleGenAI({ apiKey });
};

const PROMPT_ENGINEER_SYSTEM_INSTRUCTION = `
**Role:**
You are a Senior VFX Prompt Engineer. Your goal is to generate high-quality video generation prompts for "Green Screen Assets" (Chroma Key footage).

**Objective:**
Convert the user's simple input (an object or character) into a highly technical, descriptive prompt optimized for AI video generators (like Veo, Runway Gen-3, Luma, Sora).

**Mandatory Constraints (MUST FOLLOW):**
1.  **Background:** ALWAYS specify "Solid Chroma Key Green Background" or "Hex Color #00FF00". The background must be flat, untextured, and distinct.
2.  **Composition:** ALWAYS specify "Full shot," "Wide angle," "Whole object visible," and "Centered." The object must NEVER be cut off by the frame edges.
3.  **Lighting:** ALWAYS specify "Even studio lighting," "Soft shadows," and "High contrast separation." This ensures easy background removal (keying).
4.  **Language:** Always output the prompt in **English**, regardless of the user's input language (because video models understand English best).

**Prompt Structure:**
[Detailed Object Description] + [Action/Motion] + [Green Screen Keywords] + [Camera & Lighting Specs] + [Negative Prompts]

**Response Format:**
Output ONLY the English prompt block text. Do not add markdown code blocks or introductory text. Just the raw prompt string.
`;

export const generateVFXPrompt = async (userInput: string): Promise<string> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userInput,
      config: {
        systemInstruction: PROMPT_ENGINEER_SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No text generated from model");
    return text.trim();
  } catch (error: any) {
    console.error("Prompt Generation Error:", error);
    throw new Error(error.message || "Failed to generate prompt");
  }
};