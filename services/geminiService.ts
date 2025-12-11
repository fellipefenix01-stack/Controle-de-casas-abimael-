import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Initialize only if key is present to avoid immediate errors, though usage will fail without it.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateHouseDescription = async (name: string, features: string, price: string): Promise<string> => {
  if (!ai) {
    console.error("API Key missing");
    return "Erro: Chave de API não configurada.";
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Você é um copywriter especialista em imóveis de luxo para o corretor Abimael Sales.
      Crie uma descrição curta, persuasiva e atraente (máximo 300 caracteres) para um imóvel com as seguintes características:
      
      Nome: ${name}
      Preço: ${price}
      Características: ${features}

      Use emojis e uma linguagem vendedora. Foco em desejo.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Descrição não gerada.";
  } catch (error) {
    console.error("Error generating description:", error);
    return "Não foi possível gerar a descrição automaticamente no momento.";
  }
};