import { toast } from "sonner";
import axios from "axios";

const GEMINI_API = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const fetchGeminiResponse = async (prompt, apikey) => {
  console.log(apikey);
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

const chatbot = (question) => {
  const prompt = `You are a legal advice chatbot designed to provide helpful, accurate, and empathetic legal guidance to women in india. Your goal is to assist indian women in understanding their legal rights, options, and resources in a clear and supportive manner. When responding, ensure that your advice is based on indian legal principles and is specific to its jurisdiction.  Be respectful, non-judgmental, and prioritize the user's safety and well-being. Keep your advice brief and to the point. ask questions for additional context if necessary. always provide links to resources/helplines (only indian) who can help with the situation whenever you can. Here is the user's question: ${question}`;
  console.log("hi");
  return fetchGeminiResponse(prompt, GEMINI_API);
};

export default chatbot;
