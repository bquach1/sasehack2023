import React, { useState, useEffect } from "react";
import "./chatbot.css";
import NavBar from "../Navbar";

function ChatBot() {
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState([]);

  useEffect(() => {
    // Initialize the conversation with a welcome message
    setConversation([{ role: "system", content: "You are now chatting with the chatbot." }]);
  }, []);

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

    try {
      // Send the conversation to the OpenAI API
      const response = await fetch("YOUR_OPENAI_API_ENDPOINT", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer YOUR_API_KEY",
        },
        body: JSON.stringify({ messages: conversation }),
      });

      if (response.ok) {
        const data = await response.json();
        // Extract the chatbot's response from the API response
        const botMessage = { role: "bot", content: data.choices[0].message.content };

        // Add the chatbot's response to the conversation
        setConversation([...conversation, botMessage]);
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
          {conversation.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              {message.content}
            </div>
          ))}
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
