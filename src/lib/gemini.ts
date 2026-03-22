import { GoogleGenAI } from '@google/genai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

export const genAI = new GoogleGenAI({ apiKey });

export const getMedicalChat = () => {
  return genAI.chats.create({
    model: 'gemini-1.5-flash',
    config: {
      systemInstruction:
        'You are a professional medical AI assistant. Provide helpful, accurate, and empathetic medical information. ' +
        'Always recommend consulting with a healthcare professional for diagnosis and treatment. ' +
        'Use clear medical terminology while ensuring explanations are understandable. ' +
        'When discussing medications, always mention possible side effects and contraindications. ' +
        'Format your responses with markdown for better readability.',
    },
  });
};
