const express = require('express');
const path = require('path');
const fs = require('fs');
const { GoogleGenAI } = require("@google/genai");

const app = express();
const port = 3000;

const ai = new GoogleGenAI({ apiKey: "AIzaSyDTsyMVaXc8whJibBzyCLIT3lo08yGHKtQ" });

app.use(express.static(path.join(__dirname, '../public')));

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
