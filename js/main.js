import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "AIzaSyDTsyMVaXc8whJibBzyCLIT3lo08yGHKtQ" });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "approximate a equation to calculate the volume of the item in the picture! Only provide the final equation in the response. Use the naming convention as letter_ number. in the form v=. !!!!dont provide any information regarding what is in the picture!!! In latex text!!!",});
  console.log(response.text);
}

main();