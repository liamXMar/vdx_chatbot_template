import { fetchOLlamaAIResponse, fetchPandasAIResponse } from '@/app/api/ai/route';
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
    console.log(response);
    let cleanString = response.trim();

    // Use a regex to find the JSON block inside the string
    let jsonMatch = cleanString.match(/```(?:json)?([\s\S]*?)```/);

    if (jsonMatch && jsonMatch[1]) {
        cleanString = jsonMatch[1].trim(); // Extract the JSON part and trim it
    } 
    let jsonMatches = response.replace(/```/g, '').trim();
    console.log(jsonMatches);
    // Check if the input contains code block markers (```), and remove them if present
    if (cleanString.startsWith("```") && cleanString.endsWith("```")) {
        cleanString = cleanString.replace(/```(?:json)?/g, '').trim(); // Remove any ``` or ```json
    }
    if (cleanString[cleanString.length - 1] !== '}') {
      cleanString += '}';
    }

    if (jsonMatches) {
      try {
        return JSON.parse(cleanString);
      } catch (error) {
        console.error('Error parsing JSON from response:', error);
      }
    }
    else{
      console.error('no json found in response:', response);
    }
  };

  const handleOllamaBotResponses = (response: any): ChatMessage => {
    const content = extractJsonFromResponse(response)
    return {
      message: '',
      sender: Sender.Left,
      isGraphic: true,
      graphicData: content?.table,
    }
  };

  const handleUserMessage = async (userEntered) => {

    let tempDiv = document.createElement('div');
    tempDiv.innerHTML = userEntered;
    const userMessage = tempDiv.textContent || tempDiv.innerText || '';

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
      const pandasResponse = await fetchPandasAIResponse(userMessage);
      console.log(pandasResponse);
      const botMessage = pandasResponse?.data.result
      setChatMessages((prevChatMessages) => [
        ...prevChatMessages,
        {
          message: botMessage,
          sender: Sender.Left,
        },
      ]);
      setIfBotTyping(false);

      setIfBotTyping(true);
      const ollamaResponse = await fetchOLlamaAIResponse(userMessage, botMessage);
      console.log(ollamaResponse);
      setChatMessages((prevChatMessages) => [
        ...prevChatMessages,
        handleOllamaBotResponses(ollamaResponse?.data.response),
      ]);
      setIfBotTyping(false);

    } catch (e) {
      console.log(e);
      setIfBotTyping(false);
    }
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
                      key={i}
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
