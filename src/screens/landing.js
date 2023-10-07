import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <div>Project made by LSU Bread Boiz</div>
      <div>Log daily feelings on how your day went</div>
      <div>Get AI-generated feedback and ways to grow.</div>
      <Button onClick={() => navigate("/calendar")}>Start your Day!</Button>
    </>
  );
};

export default LandingPage;
