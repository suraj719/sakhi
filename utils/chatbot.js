import { toast } from "sonner";
import axios from "axios";

const GEMINI_API = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const fetchGeminiResponse = async (prompt, apikey) => {
  if (!apikey) {
    toast.error("API key is not configured");
    return;
  }
  if (!prompt.trim()) {
    toast.error("Prompt cannot be empty");
    return;
  }

  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        params: { key: apikey },
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      toast.error("invalid response");
    }
    return response.data.candidates[0].content.parts[0].text;
  } catch (e) {
    toast.error(e.message);
    throw new Error(e);
  }
};

const chatbot = async (question, conversationHistory) => {
  // Create a formatted conversation history string
  const historyText = conversationHistory
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join("\n");

  const prompt = `You are a legal advice chatbot designed to provide helpful, accurate, and empathetic legal guidance to women in India. Your goal is to assist Indian women in understanding their legal rights, options, and resources in a clear and supportive manner. 
  You will have to talk to the user about their problems and ask questions accordingly. Dont blast them with questions in a single response. ask your questions one by one and gain information and context from them.

Key Instructions:
1. Keep responses concise and focused
2. Ask specific follow-up questions when more context is needed
3. Always base advice on Indian legal principles
4. Be empathetic and non-judgmental
5. Prioritize user safety and well-being
6. Provide relevant Indian helpline numbers and resources when appropriate
7. Maintain conversation context and refer back to previous messages when relevant

Previous Conversation:
${historyText}

User's latest message: ${question}

Provide a response that:
- Acknowledges the user's message
- Asks relevant follow-up questions if needed
- Gives clear, actionable advice based on available information
- Includes specific Indian resources/helplines if relevant`;

  return fetchGeminiResponse(prompt, GEMINI_API);
};

export default chatbot;
