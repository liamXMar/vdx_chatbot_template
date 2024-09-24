import axios from 'axios';

const openAIUrl = 'https://api.openai.com/v1/chat/completions';

export async function fetchOpenAIResponse(prompt: string) {
  return await axios.post(openAIUrl, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo-16k', // Replace with the latest model
      prompt: prompt,
      max_tokens: 2048,
    }),
  });
}
