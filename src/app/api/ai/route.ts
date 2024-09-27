import axios, { AxiosResponse } from 'axios';

const openAIUrl = 'https://api.openai.com/v1/chat/completions';

export async function fetchOpenAIResponse(userInput: string) {
  const prompt = '';
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

export async function fetchPandasAIResponse(userInput: string) {
  // const prompt = `Question:${userInput} Please provide an answer and data that we can use to draw a bar chart that answers the question, only in the following format: { "answer": "Example answer", "table": { "labels": ["Label 1", "Label 2", "Label 3", "Label 4", "Label 5"], "datasets": [ { "label": "Bar Content Name", "data": [65, 59, 80, 81, 56], "backgroundColor": [ "rgba(255, 99, 132, 0.8)", "rgba(255, 159, 64, 0.8)", "rgba(255, 205, 86, 0.8)", "rgba(75, 192, 192, 0.8)", "rgba(54, 162, 235, 0.8)" ], "borderColor": [ "rgb(255, 99, 132)", "rgb(255, 159, 64)", "rgb(255, 205, 86)", "rgb(75, 192, 192)", "rgb(54, 162, 235)" ], "borderWidth": 1 } ] } };`

  const url = process.env.NEXT_PUBLIC_PANDASAI_HOST;
  if (userInput && url) {
    return await axios.post(
      url,
      {
        query: userInput,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } else {
    return null;
  }
}

export async function fetchOLlamaAIResponse(userInput: string, answer: string) {
  // const data = JSON.stringify(sampleData, null, 2);
  const prompt = `Question:${userInput}
  Answer: ${answer} 
  Please provide the data with only data provided that can be uses to draw a bar chart, only in the following format: 
  { "table": { "labels": ["Label 1", "Label 2", "Label 3", "Label 4", "Label 5"], "datasets": 
   [ { "label": "Bar Content Name", "data": [65, 59, 80, 81, 56],
    "backgroundColor": [ "rgba(255, 99, 132, 0.8)", "rgba(255, 159, 64, 0.8)", 
    "rgba(255, 205, 86, 0.8)", "rgba(75, 192, 192, 0.8)", "rgba(54, 162, 235, 0.8)" ], 
    "borderColor": [ "rgb(255, 99, 132)", "rgb(255, 159, 64)", "rgb(255, 205, 86)", 
    "rgb(75, 192, 192)", "rgb(54, 162, 235)" ], "borderWidth": 1 } ] } }; no other words are needed, only the json object`

  const url = process.env.NEXT_PUBLIC_OLLAMA_HOST;
  if (userInput && prompt && url) {
    return await axios.post(
      url,
      {
        model: 'llama3.1',
        prompt: prompt,
        stream: false,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } else {
    return null;
  }
}
