import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Gemini
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function generateWithRetry(params: any, retries = 3, delay = 1000): Promise<any> {
  try {
    return await ai.models.generateContent(params);
  } catch (error: any) {
    if (retries > 0 && (error.status === 503 || error.code === 503)) {
      console.warn(`Gemini 503 error, retrying... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return generateWithRetry(params, retries - 1, delay * 2);
    }
    throw error;
  }
}

app.use(express.json());

// API Routes
app.post("/api/chat/battle", async (req, res) => {
  const { enemyName, currentHp, maxHp, playerAction, userMessage } = req.body;
  
  try {
    const prompt = `
      You are ${enemyName}, an eccentric entity dwelling in the Abyss Spire. 
      You are CURRENTLY in a fight with the player.
      Your HP: ${currentHp}/${maxHp}.
      The player's latest action: ${playerAction}.
      ${userMessage ? `The player just said to you: "${userMessage}"` : ""}
      
      Personality: 
      - Highly conversational and "human-like" in your eccentricities.
      - You have a specific voice: maybe you're a tired bureaucrat, a manic cultist, or a polite but lethal butler.
      - React strongly to being hurt. If HP is high, you are smug. If HP is below 50%, you start to panic or offer ridiculous bribes.
      - If the player talks to you, respond directly to what they said with wit.
      
      Constraint: Keep it under 25 words. Be funny, emotional, and reactive.
    `;

    const response = await generateWithRetry({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are an NPC. Never break character. Be unpredictable and human-like in your reactions.",
      }
    });

    res.json({ message: response.text || "..." });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ message: "Curse these spirits... I have no words!" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
