import React, { useState, useEffect } from "react";
import "./chatbot.css";
import NavBar from "../Navbar";

const apiKey = process.env.OPEN_AI_API_KEY;

function ChatBot() {
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState([
    {
      role: "system",
      content:
        "Answer the following question as a chatbot relating to mental health",
    },
  ]);
  const [responding, setResponding] = useState(false);

  useEffect(() => {
    console.log(conversation);
  });

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    // Create a new message object for the user's message
    const userMessage = { role: "user", content: input };

    // Add the user's message to the conversation
    setConversation([...conversation, userMessage]);
    setInput("");

    const updatedConversation = [...conversation, userMessage];

    try {
      // Extract the conversation messages without any non-serializable data
      const conversationMessages = updatedConversation.map(
        ({ role, content }) => ({
          role,
          content,
        })
      );

      setResponding(true);

      // Send the conversation messages to the server
      const response = await fetch("http://127.0.0.1:5000/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ conversation: conversationMessages }), // Send only the conversation messages
      });

      if (response.ok) {
        const data = await response.json();
        // Extract the chatbot's response from the API response
        const botMessage = { role: "bot", content: data["reply"] };

        // Add the chatbot's response to the conversation
        setConversation([...conversation, botMessage]);
        setResponding(false);
      } else {
        console.error("Failed to send the message to the server.");
      }
    } catch (error) {
      console.error("Error sending the message:", error);
    }
  };

  return (
    <div className="chat-visual-container">
      <NavBar />
      {/* Chat Box */}
      <div className="chat-box">
        {/* Previous Messages */}
        <div className="previous-messages">
          {conversation.length === 1 &&
            <div className={"message bot"}>
              Please feel free to enter any message to begin your conversation with your AI helper!
            </div>
          }
          {conversation.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              {message.content}
            </div>
          ))}
          {responding && (
            <div className="message bot">
              <div className="dot" />
              <div className="dot" />
              <div className="dot" />
            </div>
          )}
        </div>

        {/* Text Input and Submit Button */}
        <form onSubmit={handleSubmit} className="message-input-form">
          {/* Text Input */}
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
          />

          {/* Submit Button */}
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default ChatBot;
