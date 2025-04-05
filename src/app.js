const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files like CSS, JS, and images (if you have any in the 'public' folder)
app.use(express.static(path.join(__dirname, 'public')));

// Serve the static HTML file (e.g., index.html) from the 'public' folder
app.get('/', (req, res) => {
    switch (req.url) {
        case '/':
            // Directly send the index.html file from the public directory
            res.sendFile(path.join(__dirname, '..', '/public', '/htmls','quiz.html'));
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
