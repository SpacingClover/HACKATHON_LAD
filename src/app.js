import express from 'express';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const app = express();
const port = 3000;

const __dirname_org = path.dirname(new URL(import.meta.url).pathname);
const __dirname =  __dirname_org.substring(1);
console.log(__dirname);
const genAI = new GoogleGenerativeAI ('AIzaSyDTsyMVaXc8whJibBzyCLIT3lo08yGHKtQ');

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/htmls/quiz.html'));
});

app.get("/get_question", get_question_callback);

async function get_question_callback(req,res){
  
  let response;
  try{
    response = await createQuestion();
    }
    catch(e){
      console.log(e.message);
    }
    res.json(response);
}

 function chooseimage(baseDir) {

    const entries = fs.readdirSync(baseDir, { withFileTypes: true });             
    const folders = entries.filter(entry => entry.isDirectory()).map(dir => dir.name);
    const randomFolder = folders[Math.floor(Math.random() * folders.length)];

    const pngfiles = fs.readdirSync(path.join(baseDir, randomFolder)).filter(file => file.endsWith('.png'));
    const randomFile = pngfiles[Math.floor(Math.random() * pngfiles.length)];
    return [path.join(baseDir, randomFolder, randomFile), randomFolder, randomFile]; 
}

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString("base64"),
      mimeType
    },
  };
}

async function passtogemini(imagePath) {

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  
    const prompt = "approximate a equation to calculate the volume of the item in the picture! Only provide the final equation in the response. Use the naming convention as letter_ number. in the form v=. !!!!dont provide any information regarding what is in the picture!!! In latex text!!!";
  
    const imageParts = [
      fileToGenerativePart(imagePath, "image/png"),
    ];
  
    const generatedContent = await model.generateContent([prompt, ...imageParts]);
    
    const result = (generatedContent.response.text());
    return result;
  }


async function createQuestion() {
    const selectedImage = chooseimage(path.join(__dirname, '../public/assets'));
    const latexEquation = await passtogemini(selectedImage[0]);
    const imglink = selectedImage[1]+ "/" +selectedImage[2];
    console.log(imglink); 

    return ({
      "img_1":imglink,
      "img_2":imglink,
      "img_3":imglink,
      "img_4":imglink,
      "equation":"$$"+latexEquation+"$$",//the back slashes must be double backslashes
      "uid":123
    });
}

// Start the Express server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
