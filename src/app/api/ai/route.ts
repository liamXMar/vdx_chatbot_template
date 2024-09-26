import axios, { AxiosResponse } from 'axios';
import sampleData from '../../../assets/sampleData.json';

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

export async function fetchOLlamaAIResponse(userInput: string) {
//   const data = JSON.stringify(sampleData, null, 2);
  //   const prompt = `Question:
  //   ${userInput}
  //   using the following data:
  //   ${data.toString()}
  //   The data represents Call Quality Data objects called legs retrieved from Microsoft Teams.
  //   A call has a unique ID named Call_Id, and contains multiple legs. A leg is a representation of a specific segment of a call (from a source to a destination).
  //   For example, A call between UserA and UserB contains 2 legs: one frome UserA to UserB, and another one from UserB to UserA.
  //   The call is considered a good call if the outcome is a success. Otherwise it's considered a Poor call and the outcome is a failure.
  //   The field that stores that outcome is named Call_Outcome.
  //   If the call is a poor call, the field Poor_Call_Reasons stores the reason why the call failed. For example,
  //   it can be because of the Network Switch, or Dropped Streams, or High Jitter, etc.
  //   In general, the field names that starts with "Call" are represting data for an entire call. The field names that starts with "User" are specific to a leg,
  //   and contains infos about the source User of a leg.
  //   Call_Type represents the type of the call, it can be Peer-to-Peer or Conference. Peer-to-Peer calls are calls between two users.
  //   Conference calls are calls with multiple users in it.
  //   Calls are made from a Microsoft Teams client (Call_Teams_Client), using a device. A device can be critical, or healthy. We're counting them in our data,
  //   the fields are called Meeting_Critical_Device_Count and Meeting_Healthy_Device_Count.
  //   Please provide an answer and data that we can use to draw a bar chart that answers the question, only in the following format:
  //   {
  //       "answer": "Example answer",
  //       "table": {
  //           "labels": ["Label 1", "Label 2", "Label 3", "Label 4", "Label 5"],
  //           "datasets": [
  //           {
  //               "label": "Bar Content Name",
  //               "data": [65, 59, 80, 81, 56],
  //               "backgroundColor": [
  //               "rgba(255, 99, 132, 0.8)",
  //               "rgba(255, 159, 64, 0.8)",
  //               "rgba(255, 205, 86, 0.8)",
  //               "rgba(75, 192, 192, 0.8)",
  //               "rgba(54, 162, 235, 0.8)"
  //               ],
  //               "borderColor": [
  //               "rgb(255, 99, 132)",
  //               "rgb(255, 159, 64)",
  //               "rgb(255, 205, 86)",
  //               "rgb(75, 192, 192)",
  //               "rgb(54, 162, 235)"
  //               ],
  //               "borderWidth": 1
  //           }
  //           ]
  //       }
  //   }
  //   the answer should only include one json that match with the format, no extra words besides the json
  //   `;

//   const query = ``;
  const url = process.env.NEXT_PUBLIC_OLLAMA_HOST;
  if (userInput && url) {
    return await axios.post(
      url,
      {
        data: sampleData,
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
