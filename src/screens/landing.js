import React, { useEffect, useState } from "react";
import { Button, Card } from "antd";
import { useNavigate } from "react-router-dom";
import Bread from "../images/bread.png";
import Calendar from "../images/calendar.png";
import Chatbot from "../images/chatbot.png";
import Profile from "../images/profile.png";
import "./landing.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const [slideNumber, setSlideNumber] = useState(0);

  const slides = [
    {
      cover: <img src={Bread} alt="Egg toast" style={{ height: 375 }} />,
      content: "Presented by LSU Bread Boiz",
    },
    {
      cover: <img src={Calendar} alt="Calendar page" style={{ height: 375 }} />,
      content:
        "Make a calendar to log how your days are going. View color-coded dates to see trends in your weeks and personal notes.",
    },
    {
      cover: <img src={Chatbot} alt="Chatbot page" style={{ height: 375 }} />,
      content:
        "Consult with a mental-health focused AI chatbot to reflect on your days.",
    },
    {
      cover: <img src={Profile} alt="Profile page" style={{ height: 325 }} />,
      content: "Keep a personal profile and goals to make your days better!",
    },
  ];

  const nextSlide = () => {
    setSlideNumber((prevSlide) => (prevSlide + 1) % slides.length);
  };

  const prevSlide = () => {
    setSlideNumber(
      (prevSlide) => (prevSlide - 1 + slides.length) % slides.length
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#ADD8E6",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center", // Center the cards horizontally
          alignItems: "center", // Center the cards vertically
        }}
      >
        {slides.map((slide, index) => (
          <div
            style={{
              position: "absolute",
              top: "30%",
              display: "flex",
              margin: "0 auto",
            }}
          >
            <Card
              key={index}
              cover={slide.cover}
              style={{
                display: "flex",
              }}
              className={`card-content ${
                index !== slideNumber ? "hidden" : ""
              }`}
            >
              <p style={{ maxWidth: 300, textAlign: "left" }}>
                {slide.content}
              </p>
            </Card>
          </div>
        ))}
      </div>
      <div
        style={{
          width: "80%",
          padding: 20,
          height: "80%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <h2>Psy-ki (気)</h2>
        <div>
          気: Japanese character that refers to one's spirit, mind, natural
          energy, or health.
        </div>
        <Button
          style={{ marginTop: "1%" }}
          onClick={() => navigate("/calendar")}
        >
          Start your Day!
        </Button>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "15%",
          justifyContent: "space-between",
          display: "flex",
          width: "70%",
        }}
      >
        <Button onClick={prevSlide}>Previous</Button>
        <Button onClick={nextSlide}>Next</Button>
      </div>
    </div>
  );
};

export default LandingPage;
