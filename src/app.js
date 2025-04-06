const express = require('express');
const path = require('path');
const fs = require('fs');
import { GoogleGenAI } from "@google/genai";

const app = express();
const port = 3000;

const ai = new GoogleGenAI({ apiKey: "AIzaSyDTsyMVaXc8whJibBzyCLIT3lo08yGHKtQ" });

// Serve static files like CSS, JS, and images (if you have any in the 'public' folder)
app.use(express.static(path.join(__dirname, '../public')));

// Serve the static HTML file (e.g., index.html) from the 'public' folder
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/htmls/quiz.html'));
});

app.get("/get_question", (req,res) => {
  res.json({
    "img_1":"FiveShapes/Table.png",
    "img_2":"FourShapes/IceCream.png",
    "img_3":"OneShape/Book.png",
    "img_4":"OneShape/Orange.png",
    "equation":"$$\\zeta(2) = \\frac{\\pi^2}{6}$$",
    "uid":123
  });
});

async function chooseimage(baseDir) {             
    const folders = fs.readdirSync(baseDir);
    const randomFolder = folders[Math.floor(Math.random() * folders.length)];
    const files = fs.readdirSync(path.join(baseDir, randomFolder));
    const randomFile = files[Math.floor(Math.random() * files.length)];
    return path.join(baseDir, randomFolder, randomFile); 
}

async function passtogemini(imagePath) {

    const imagePath = path.resolve("path/to/your/image.jpg");
    const imageData = fs.readFileSync(imagePath).toString("base64");
    const mimeType = "image/jpeg";

    const model = ai.getGenerativeModel("gemini-pro-vision");
    const response = await model.generateContent([
        {
            inlineData: {
              mimeType: mimeType,
              data: imageData,
            },
        },
         "approximate a equation to calculate the volume of the item in the picture! Only provide the final equation in the response. Use the naming convention as letter_ number. in the form v=. !!!!dont provide any information regarding what is in the picture!!! In latex text!!!"
        ]);
        const result = await result.response;
        return response.text;
}


async function createQuestion() {
    
    const selectedImage = chooseimage(path.join(__dirname, '../public/assets'));
    const latexEquation = await passtogemini(selectedImage);
    return latexEquation;
}

// Start the Express server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});







// import { GoogleGenAI } from "@google/genai";
//
// const ai = new GoogleGenAI({ apiKey: "AIzaSyDTsyMVaXc8whJibBzyCLIT3lo08yGHKtQ" });
//
// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.0-flash",
//     contents: "approximate a equation to calculate the volume of the item in the picture! Only provide the final equation in the response. Use the naming convention as letter_ number. in the form v=. !!!!dont provide any information regarding what is in the picture!!! In latex text!!!",});
//   console.log(response.text);
// }

//main();
