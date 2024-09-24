import { fetchOpenAIResponse } from '@/app/api/ai/route';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from '@chatscope/chat-ui-kit-react';
import React, { useState } from 'react';

enum Sender {
  Left = 'left',
  Right = 'right',
}
type ChatMessage = {
  message: string;
  sender: Sender;
};

const Homepage = () => {
  const [query, setQuery] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      message: 'Hello, Please enter your question!',
      sender: Sender.Left,
    },
  ]);
  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const aiResponse = (await fetchOpenAIResponse(query)).data;
    console.log(aiResponse);
    // setResponse(aiResponse);
  };

  // Function to handle user messages
  const handleUserMessage = async (userMessage) => {
    // Create a new user message object
    const newUserMessage = {
      message: userMessage,
      sender:  Sender.Right,
    };

    // Update chat messages state with the new user message
    const updatedChatMessages = [...chatMessages, newUserMessage];
    setChatMessages(updatedChatMessages);
  };

  return (
    <>
      {/* A container for the chat window */}
      <div style={{ position: 'relative', height: '100vh', width: '700px', backgroundColor:'black' }}>
        {/* All components are wrapped in the MainContainer */}
        <MainContainer>
          {/* All chat logic will be contained in the ChatContainer */}
          <ChatContainer>
            {/* Shows all our messages */}
            <MessageList>
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
      <MessageInput
        placeholder="Type Message here"
        onSend={handleUserMessage}
      />
    </>
  );
};

export default Homepage;
