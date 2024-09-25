import { fetchOLlamaAIResponse, fetchOpenAIResponse } from '@/app/api/ai/route';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  MessageCustomContent,
  MessageHtmlContent,
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
    try {
      const jsonMatch = response.match(/{.*}/s); // 's' flag allows '.' to match newlines

      if (jsonMatch && jsonMatch[0]) {
        // Parse the matched JSON string
        const parsedJson = JSON.parse(jsonMatch[0]);
        return parsedJson;
      }

      return null;
    } catch (error) {
      console.error('Error parsing JSON from response:', error);
      return null;
    }
  };

  const handleMultipleBotResponses = (response: any): ChatMessage[] => {
    let messages: ChatMessage[] = [];

    const actualRes = extractJsonFromResponse(response);
    if (actualRes) {
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
    } else {
      messages.push({
        message: response,
        sender: Sender.Left,
      });
    }

    return messages;
  };

  // Function to handle user messages
  const handleUserMessage = async (userMessage) => {
    // Create a new user message object
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
      console.log(aiResponse?.data.response);
      const newBotMessages: ChatMessage[] = handleMultipleBotResponses(
        aiResponse?.data.response
      );
      const newBotMessage = {
        message: aiResponse?.data.response,
        sender: Sender.Left,
      };
      newBotMessages.push(newBotMessage);

      setChatMessages((prevChatMessages) => [
        ...prevChatMessages,
        ...newBotMessages,
      ]);
      setIfBotTyping(false);
    } catch (e) {
      console.log(e);
      setIfBotTyping(false);
    }
  };

  const data = {
    labels: ['Dallas Meeting Room', 'Buffalo Meeting Room', 'Paris Executive'],
    datasets: [
      {
        label: 'Meeting Device Count',
        data: [3, 3, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(75, 192, 192, 0.8)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(75, 192, 192)',
        ],
        borderWidth: 1,
      },
    ],
  };
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
              <Message
                model={{
                  message: '',
                  direction: 'outgoing',
                  position: 'single',
                }}
              >
                <Message.CustomContent>
                  <Bar data={data} />
                </Message.CustomContent>
              </Message>
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
                }
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
