import axios from 'axios';
import sampleData from '../../../assets/sampleData.json';

const openAIUrl = 'https://api.openai.com/v1/chat/completions';

const flattenJsonArray = (jsonArray) => {
  let res = {
    keys: [
      'Call_Id',
      'Call_Outcome',
      'Poor_Call_Reasons',
      'Timestamp',
      'User_Call_Rating',
      'User_Name',
      'User_Packet_Loss',
      'User_Round_Trip_Time',
    ],
    values: [
      jsonArray.map((obj) => {
        return Object.values(obj).join(',');
      }),
    ],
  };

  return res;
};

export async function fetchOpenAIResponse(userInput: string) {
  const data = JSON.stringify(flattenJsonArray(sampleData), null, 2);
  const prompt = `Question:
    ${userInput}
    `;
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

export async function fetchOLlamaAIResponse(userInput: string) {
  const data = JSON.stringify(flattenJsonArray(sampleData), null, 2);
  const prompt = `Question:
  ${userInput}`;
  const system = `using the following data:
  ${data.toString()}
  The data represents Call Quality Data objects called legs retrieved from Microsoft Teams.
  Please provide an answer and data that we can use to draw a bar chart that answers the question, only in the following format:
  {
      "answer": "Example answer", 
      "table": {
          "labels": ["Label 1", "Label 2", "Label 3", "Label 4", "Label 5"],
          "datasets": [
          {
              "label": "Bar Content Name",
              "data": [65, 59, 80, 81, 56],
              "backgroundColor": [
              "rgba(255, 99, 132, 0.8)",
              "rgba(255, 159, 64, 0.8)",
              "rgba(255, 205, 86, 0.8)",
              "rgba(75, 192, 192, 0.8)",
              "rgba(54, 162, 235, 0.8)"
              ],
              "borderColor": [
              "rgb(255, 99, 132)",
              "rgb(255, 159, 64)",
              "rgb(255, 205, 86)",
              "rgb(75, 192, 192)",
              "rgb(54, 162, 235)"
              ],
              "borderWidth": 1
          }
          ]
      }
  }
  the answer should only contain a json string that match with the format, no extra words besides the json`;

  const url = process.env.NEXT_PUBLIC_OLLAMA_HOST;
  if (userInput && prompt && url) {
    return await axios.post(
      url,
      {
        model: 'llama3.1',
        prompt: prompt,
        stream: false,
        system: system,
        options: {
          num_ctx: 8192
        },
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
