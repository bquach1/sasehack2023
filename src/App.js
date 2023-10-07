import "./App.css";
import CalendarPage from "./screens/calendar";
import LandingPage from "./screens/landing";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
