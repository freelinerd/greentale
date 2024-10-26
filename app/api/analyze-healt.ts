import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const image = formData.get("image") as File;

  if (!image) {
    return NextResponse.json({ error: "No se ha proporcionado ninguna imagen" }, { status: 400 });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const imageParts = [
      {
        inlineData: {
          data: Buffer.from(await image.arrayBuffer()).toString("base64"),
          mimeType: image.type,
        },
      },
    ];

    const result = await model.generateContent([
      "Analiza la salud de esta planta y proporciona la siguiente información en español sin ningún otro formato que no sea listar la siguiente información:\n" +
        "Estado de salud: (Bueno, Regular, o Necesita atención)\n" +
        "-\n" +
        "Problemas detectados:\n" +
        "- (Lista de problemas, si los hay)\n" +
        "-\n" +
        "Recomendaciones:\n" +
        "- (Lista de recomendaciones para mejorar la salud de la planta)\n",
      ...imageParts,
    ]);

    const plantHealth = result.response.text();

    return NextResponse.json({ plantHealth });
  } catch (error) {
    console.error("Error al analizar la salud de la planta:", error);
    return NextResponse.json(
      { error: "Error al analizar la salud de la planta" },
      { status: 500 },
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};