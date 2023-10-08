import React, { useState } from "react";
import "./chatbot.css";
import NavBar from "../Navbar";

function ChatBot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return;

    // Add the user's message to the chat
    setMessages((prevMessages) => [
      { text: input, sender: "user" },
      ...prevMessages,
    ]);
    setInput("");

    try {
      // Send the user's message to the Flask back-end
      const response = await fetch("http://localhost:5000/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (response.ok) {
        const data = await response.json();
        // Add the chatbot's response to the chat
        setMessages((prevMessages) => [
          { text: data.message, sender: "bot" },
          ...prevMessages,
        ]);
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
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}`}>
              {message.text}
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
