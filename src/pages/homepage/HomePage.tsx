import { fetchOpenAIResponse } from '@/app/api/ai/route';
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
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Chart } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

enum Sender {
  Left = 'left',
  Right = 'right',
}
type ChatMessage = {
  message: string;
  sender: Sender;
};

const Homepage = () => {
  const [ifBotTyping, setIfBotTyping] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      message: 'Hello, Please enter your question!',
      sender: Sender.Left,
    },
  ]);

  // Function to handle user messages
  const handleUserMessage = async (userMessage) => {
    // Create a new user message object
    const newUserMessage = {
      message: userMessage,
      sender: Sender.Right,
    };
    let updatedChatMessages = [...chatMessages, newUserMessage];
    setChatMessages(updatedChatMessages);

    setIfBotTyping(true);
    const aiResponse = (await fetchOpenAIResponse(userMessage)).data;
    console.log(aiResponse);

    const newBotMessage = {
      message: aiResponse,
      sender: Sender.Left,
    };

    updatedChatMessages = [...chatMessages, newBotMessage];
    setChatMessages(updatedChatMessages);
  };

  const labels = ['jan', 'feb', 'mar', 3, 4, 5, 6, 7];
  const data = {
    labels: labels,
    datasets: [
      {
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 205, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(201, 203, 207, 0.2)',
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(255, 159, 64)',
          'rgb(255, 205, 86)',
          'rgb(75, 192, 192)',
          'rgb(54, 162, 235)',
          'rgb(153, 102, 255)',
          'rgb(201, 203, 207)',
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
          width: '700px',
          backgroundColor: 'black',
        }}
      >
        {/* All components are wrapped in the MainContainer */}
        <MainContainer>
          {/* All chat logic will be contained in the ChatContainer */}
          <ChatContainer>
            {/* Shows all our messages */}
            <MessageList>
              {/* <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>
                Chat Messages
              </h3> */}
              {/* <Bar data={data} />; */}
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
      {ifBotTyping ? <TypingIndicator content="VDX Bot is typing" /> : <></>}
      <MessageInput
        placeholder="Type Message here"
        onSend={handleUserMessage}
      />
    </>
  );
};

export default Homepage;
