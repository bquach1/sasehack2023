import "./App.css";
import CalendarPage from "./screens/calendar";
import LandingPage from "./screens/landing";
import ChatBot from "./screens/chatbot";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Profile from "./screens/profile";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/chatbot" element={<ChatBot/>}/>
          <Route path="/overview" element={<Profile/>}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
