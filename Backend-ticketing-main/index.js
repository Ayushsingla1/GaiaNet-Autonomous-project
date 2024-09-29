const OpenAI = require('openai');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const client = new OpenAI({
  baseURL: 'https://llama.us.gaianet.network/v1',
  apiKey: ''
});

app.post('/', (req, res) => {
  console.log(req.body);
  return res.send('POST request received!');
});
app.post('/chatbot', async (req, res) => {
  try {
    console.log(req.body);
    
    const response = await client.chat.completions.create({
      model: "Meta-Llama-3-8B-Instruct-Q5_K_M",
      messages: [
        { role: "system", content: "You are a chatbot specialized in music. You should provide detailed responses only when asked about a singer, their albums, songs, or tours but keep it about 50 words. For any other questions, respond with a single line such as 'I'm here to help with music-related queries!' or 'That's interesting! How can I assist you with music?" },
        { role: "user", content: req.body.message }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return res.send(response.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).send('An error occurred while processing your request.');
  }
});
