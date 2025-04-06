import express from 'express';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import Groq from 'groq-sdk';

const app = express();
const port = 3000;

const __dirname_org = path.dirname(new URL(import.meta.url).pathname);
const __dirname =  __dirname_org.substring(1);
const genAI = new GoogleGenerativeAI ('AIzaSyCD1iSWUxyIdmFKOCavslLCTTA-hsZ2l4Q');
const groq = new Groq({ apiKey:'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'});

const stored_question_data = [];
// {
//  "uid":123,
//  "answer_index":n
//}

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

app.get("/check_answer", (req,res) => {

  var query_uid = parseInt(req.query.question_uid);
  var query_answer = req.query.answer;
  let saved_answer = null;
  for(let i=0;i<stored_question_data.length;i++){
    if(stored_question_data[i]["uid"]===query_uid){
      saved_answer = stored_question_data[i];
    }
  }
  if (saved_answer == null){
    res.json({"value":false});
    return
  }
  if(saved_answer["answer_index"] == query_answer){
    res.json({"value":true});
    return
  }
  else{
    res.json({"value":false});
  }
});

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

    const prompt = "approximate a equation to calculate the volume of the item in the picture! Only provide the final equation in the response. Use the naming convention as letter_ number. in the form v=. !!!!dont provide any information regarding what is in the picture!!! In latex text!!! Do not have any $ on the ends!!! all backslashes must be single backslashes! MUST BE VALID LATEX!!!!";

    const imageParts = [
      fileToGenerativePart(imagePath, "image/png"),
    ];

    const generatedContent = await model.generateContent([prompt, ...imageParts]);

    const result = (generatedContent.response.text());
    return result;
  }

async function passtogroq(imagelink){
  const chatCompletion = await groq.chat.completions.create({
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "approximate a equation to calculate the volume of the item in the picture! Only provide the final equation in the response. Use the naming convention as letter_ number. in the form v=. !!!!dont provide any information regarding what is in the picture!!! In latex text!!! Do not have any $ on the ends!!! all backslashes must be single backslashes! MUST BE VALID LATEX!!!!"

          },
          {
            "type": "image_url",
            "image_url": {
              "url": imagelink
            }
          }
        ]
      }
    ],
    "model": "meta-llama/llama-4-scout-17b-16e-instruct",
    "temperature": 1,
    "max_completion_tokens": 1024,
    "top_p": 1,
    "stream": false,
    "stop": null
  });
   return(chatCompletion.choices[0].message.content);
}

function rand_img_path_creator(){
  let newdata = chooseimage(path.join(__dirname, '../public/assets'));
  return (newdata[1]+ "/" +newdata[2]);
}

function shufflelist(list) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

function check_dupes(img1, img2){
  while(true){
  if(img1 === img2){
    img2 = rand_img_path_creator();
  }
  else{
    break;
  }
}
return img2;
}

async function createQuestion() {
    const selectedImage = chooseimage(path.join(__dirname, '../public/assets'));
    // const latexEquation = '$$ \\sum_{i=1}^{n} i^2 = \\frac{n(n+1)(2n+1)}{6} $$' //await passtogemini(selectedImage[0]);
    const latexEquation =  await passtogemini(selectedImage[0]);
    const imglink = selectedImage[1]+ "/" +selectedImage[2];
    const aimodel = "groq"; // remove later.
    let latexEquation = '';
    if(aimodel === 'gemini'){
       latexEquation = await passtogemini(selectedImage[0]);
       //'$$ \\sum_{i=1}^{n} i^2 = \\frac{n(n+1)(2n+1)}{6} $$'; //await passtogemini(selectedImage[0]);
    }else{
       latexEquation = await passtogroq("https://web.engr.oregonstate.edu/~renjitha/hacks/"+ imglink);
       //'$$ \\sum_{i=1}^{n} i^2 = \\frac{n(n+1)(2n+1)}{6} $$'; //await passtogroq("https://web.engr.oregonstate.edu/~renjitha/hacks/"+ imglink);
    }

    console.log(latexEquation);

    let unshuf_images= [imglink,rand_img_path_creator(),rand_img_path_creator(),rand_img_path_creator()];
    let images = shufflelist(unshuf_images);

    for(let j=0;j<images.length;j++){
      for(let i=0; i<images.length;i++){
        if (j === i){
          continue;
        }
        images[i]= check_dupes(images[j],images[i]);
      }
    }
    console.log(unshuf_images);

    let uid = Math.floor((Math.random()*100)+1);
    let correctanswer = (images.indexOf(imglink)+ 1);
    stored_question_data.push({
      "uid":uid,
      "answer_index":correctanswer
    });

    return ({
      "img_1":images[0],
      "img_2":images[1],
      "img_3":images[2],
      "img_4":images[3],
      "equation":"$$"+latexEquation+"$$",//the back slashes must be double backslashes
      "uid":uid
    });
}

// Start the Express server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
