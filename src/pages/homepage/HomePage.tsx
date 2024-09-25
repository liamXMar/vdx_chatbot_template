import { fetchOLlamaAIResponse } from '@/app/api/ai/route';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';
import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

enum Sender {
  Left = 'left',
  Right = 'right',
}
type ChatMessage = {
  message: string;
  sender: Sender;
  isGraphic?: boolean;
  graphicData?: any;
};

const Homepage = () => {
  const [ifBotTyping, setIfBotTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      message: 'Hello, Please enter your question!',
      sender: Sender.Left,
    },
  ]);

  const extractJsonFromResponse = (response: string): any | null => {
    const jsonObjects: any[] = [];
    const jsonMatches = response.match(/{[\s\S]*?}/g); // Match all objects enclosed in {}

    if (jsonMatches) {
      jsonMatches.forEach((jsonMatch) => {
        try {
          // Fix common JSON formatting issues, like missing commas or closing brackets
          let fixedJson = jsonMatch
            .replace(/,\s*([\]}])/g, '$1') // Remove trailing commas before closing brackets
            .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":'); // Ensure keys are quoted

          const parsedJson = JSON.parse(fixedJson);
          console.log(parsedJson);
          jsonObjects.push(parsedJson);
        } catch (error) {
          console.error('Error parsing JSON from response:', error);
        }
      });
    }

    return jsonObjects;
  };

  const handleMultipleBotResponses = (response: any): ChatMessage[] => {
    let messages: ChatMessage[] = [];

    const jsonObjects = extractJsonFromResponse(response);
    jsonObjects.forEach((actualRes) => {
      if (actualRes.answer) {
        const textMessage: ChatMessage = {
          message: actualRes.answer,
          sender: Sender.Left,
        };
        messages.push(textMessage);
      }
      if (actualRes.table) {
        const graphicMessage: ChatMessage = {
          message: '',
          sender: Sender.Left,
          isGraphic: true,
          graphicData: actualRes.table,
        };
        messages.push(graphicMessage);
      }
    });

    if (messages.length === 0) {
      messages.push({
        message: response,
        sender: Sender.Left,
      });
    }

    return messages;
  };

  const handleUserMessage = async (userMessage) => {
    console.log(userMessage);
    const newUserMessage = {
      message: userMessage,
      sender: Sender.Right,
    };

    setChatMessages((prevChatMessages) => [
      ...prevChatMessages,
      newUserMessage,
    ]);

    setIfBotTyping(true);
    try {
      const aiResponse = await fetchOLlamaAIResponse(userMessage);
      console.log(aiResponse);
      const botMessages = handleMultipleBotResponses(aiResponse?.data.response);
      setChatMessages((prevChatMessages) => [
        ...prevChatMessages,
        ...botMessages,
      ]);
      setIfBotTyping(false);
    } catch (e) {
      console.log(e);
      setIfBotTyping(false);
    }
  };

  //   const data = {
  //     labels: ['Dallas Meeting Room', 'Buffalo Meeting Room', 'Paris Executive'],
  //     datasets: [
  //       {
  //         label: 'Example Chart Display',
  //         data: [3, 2, 3],
  //         backgroundColor: [
  //           'rgba(255, 99, 132, 0.8)',
  //           'rgba(255, 159, 64, 0.8)',
  //           'rgba(75, 192, 192, 0.8)',
  //         ],
  //         borderColor: [
  //           'rgb(255, 99, 132)',
  //           'rgb(255, 159, 64)',
  //           'rgb(75, 192, 192)',
  //         ],
  //         borderWidth: 1,
  //       },
  //     ],
  //   };
  return (
    <>
      {/* A container for the chat window */}
      <div
        style={{
          position: 'relative',
          height: '80vh',
          width: '85%',
          margin: 'auto',
        }}
      >
        <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>
          Chat with VDX Bot
        </h3>
        <MainContainer>
          {/* All chat logic will be contained in the ChatContainer */}
          <ChatContainer>
            {/* Shows all our messages */}
            <MessageList>
              {/* <Message
                model={{
                  message: '',
                  direction: 'outgoing',
                  position: 'single',
                }}
              >
                <Message.CustomContent>
                  <Bar data={data} />
                </Message.CustomContent>
              </Message> */}
              {chatMessages.map((message, i) => {
                if (message.isGraphic && message.graphicData) {
                  return (
                    <Message
                      model={{
                        message: '',
                        direction:
                          message.sender === Sender.Left
                            ? 'incoming'
                            : 'outgoing',
                        position: 'single',
                      }}
                    >
                      <Message.CustomContent>
                        <Bar data={message.graphicData} />
                      </Message.CustomContent>
                    </Message>
                  );
                } else {
                  return (
                    <Message
                      key={i}
                      model={{
                        message: message.message,
                        direction:
                          message.sender === Sender.Left
                            ? 'incoming'
                            : 'outgoing',
                        position: 'single',
                      }}
                      style={
                        message.sender === Sender.Left
                          ? { textAlign: 'left' }
                          : {}
                      }
                    />
                  );
                }
              })}
            </MessageList>
          </ChatContainer>
        </MainContainer>
      </div>
      <div style={{ marginTop: '50px' }}>
        {ifBotTyping ? <TypingIndicator content="VDX Bot is typing" /> : <></>}
        <MessageInput
          placeholder="Type Message here"
          onSend={handleUserMessage}
        />
      </div>
    </>
  );
};

export default Homepage;
