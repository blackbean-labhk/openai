const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai').default;
const app = express();
const port = process.env.PORT || 6000;

require('dotenv').config();
app.use(bodyParser.json());

// Set your OpenAI API key
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('OpenAI API key not found.');
  process.exit(1);
}

app.get('/', (req, res) => {
  res.send('Greeting to Cyclic.sh');
})

const openai = new OpenAI({
    apiKey,
});
// Define a route to handle POST requests
app.post('/search-musician', async (req, res) => {
  const { musicianName } = req.body;

  if (!musicianName) {
    return res.status(400).json({ error: 'Missing musicianName in request body.' });
  }

  const messages = [
    { role: 'system', content: 'You are a search engine that finds Information.' },
    { role: 'user', content: `Search biography, awards, genre, music albums title and links, and social media links (links are easy to obtain. please find it) for the musician ${musicianName}` },
  ];

  try {
    const response = await await openai.chat.completions.create({
      model: 'gpt-4',
      messages,
      n: 1,
      stop: null,
      temperature: 1,
    });

    res.status(200).json({ answer: response.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API error:', error);
    res.status(500).json({ error: 'Error communicating with the OpenAI API.' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
