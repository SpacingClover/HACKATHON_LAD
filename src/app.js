const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files like CSS, JS, and images (if you have any in the 'public' folder)
app.use(express.static(path.join(__dirname, '../public')));

// Serve the static HTML file (e.g., index.html) from the 'public' folder
app.get('/', (req, res) => {
    switch (req.url) {
        case '/':
            // Directly send the index.html file from the public directory
            res.sendFile(path.join(__dirname, '../public/htmls/quiz.html'));
            // res.sendFile(path.join(__dirname, '..', '/public'));
            break;
        case '/question_data':
            res.json({"thing":"hello world"});
            break;
        default:
            res.status(404).send('404 Not Found');
    }

});

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
