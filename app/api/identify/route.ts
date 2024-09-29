import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const image = formData.get("image") as File;

  if (!image) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
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
      "Identify this plant and provide the following information in spanish with no other         format than listing the following information:\n" +
        "Nombre Comun: Common name\n" +
        "Nombre Cientifico Scientific name\n" +
        "-\n" +
        "Descripción: Brief description\n" +
        "-\n" +
        "Cuidados: Care instructions (Regado: watering, Luz: sunlight, Tierra: soil)\n" +
        "-\n" +
        "Tiempo que tarda en dar frutos: Time to bear fruit o Fruit-bearing time.\n" +
        "Tiempo que tarda en germinar semillas: Seed germination time or Time for seed germination.\n" +
        "Clima adecuado para la planta: Suitable climate for the plant or Optimal climate conditions for the plant.\n",
      ...imageParts,
    ]);

    const plantInfo = result.response.text();

    return NextResponse.json({ plantInfo });
  } catch (error) {
    console.error("Error identifying plant:", error);
    return NextResponse.json(
      { error: "Failed to identify plant" },
      { status: 500 },
    );
  }
}
