const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files like CSS, JS, and images (if you have any in the 'public' folder)
app.use(express.static(path.join(__dirname, 'public')));

// Serve the static HTML file (e.g., index.html) from the 'public' folder
app.get('/', (req, res) => {
  // Directly send the index.html file from the public directory
  res.sendFile(path.join(__dirname, '..', '/public', '/htmls','quiz.html'));
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
