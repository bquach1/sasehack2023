import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import Bread from "../images/bread.png";

const LandingPage = () => {
  const navigate = useNavigate();

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
          border: "1px solid black",
          borderRadius: 15,
          width: "80%",
          padding: 20,
          height: "80%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h2>Psy-ki (气)</h2>
        <img src={Bread} alt="Egg toast" width={200} />
        <div>Project made by LSU Bread Boiz</div>
        <div>Log daily feelings on how your day went</div>
        <div>Get AI-generated feedback and ways to grow.</div>
        <Button onClick={() => navigate("/calendar")}>Start your Day!</Button>
      </div>
    </div>
  );
};

export default LandingPage;
