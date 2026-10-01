import express from "express";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

// Sirve el index.html
app.use(express.static(__dirname));

// Conexión con OpenAI
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/api/ai", async (req, res) => {

  try {

    const message = req.body?.message;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "No se recibió ningún mensaje."
      });
    }

    const response = await client.responses.create({
      model: "gpt-5",
      input: [
        {
          role: "system",
          content:
            "Eres la IA integrada en un reproductor de vídeos. Responde en español de manera clara, útil y sencilla."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    res.json({
      answer: response.output_text
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Error al comunicarse con la IA."
    });
  }
});

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Servidor funcionando en el puerto ${PORT}`
  );
});
