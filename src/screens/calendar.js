import React, { useEffect, useState } from "react";
import { Calendar, Modal, Rate, Tooltip, Input, Button } from "antd";
import styled from "styled-components";
import AddIcon from "@mui/icons-material/AddCircle";
import CircleIcon from "@mui/icons-material/Circle";
import NavBar from "../Navbar";
import axios from "axios";
import RATING_COLORS from "../constants";

const CalendarWrapper = styled.div`
  background-color: #daf0f7;
  padding: 20px;

  .selected-date {
    margin-top: 1%;
    display: flex;
    justify-content: center;
  }

  .add-icon {
    &:hover {
      opacity: 0.5;
      cursor: pointer;
    }
  }
`;

const TrackingCalendar = styled(Calendar)`
  width: 90%;
  margin: 0 auto;
  border: 1px solid black;
  padding: 10px;
  border-radius: 10px;
`;

const customIcons = {
  1: <CircleIcon style={{ color: "#FFCCCB" }} />,
  2: <CircleIcon style={{ color: "#FFD580" }} />,
  3: <CircleIcon style={{ color: "#FFDF00" }} />,
  4: <CircleIcon style={{ color: "#9ACD32" }} />,
  5: <CircleIcon style={{ color: "#008000" }} />,
};

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [openModal, setOpenModal] = useState(false);

  const [ratings, setRatings] = useState([]);

  const [rating, setRating] = useState(0);
  const [reflection, setReflection] = useState("");

  let currentDate = date.toLocaleDateString();

  useEffect(() => {
    if (ratings[currentDate] && ratings[currentDate].reflection.length) {
      setReflection(ratings[currentDate].reflection);
    } else {
      setReflection("");
    }
  }, [currentDate, ratings]);

  const renderCell = (value) => {
    return (
      <>
        {value.$d.toLocaleDateString() in ratings && (
          <div
            style={{
              borderRadius: 10,
              padding: 10,
              backgroundColor:
                ratings[value.$d.toLocaleDateString()].rating === 1
                  ? "#FFCCCB"
                  : ratings[value.$d.toLocaleDateString()].rating === 2
                  ? "#FFD580"
                  : ratings[value.$d.toLocaleDateString()].rating === 3
                  ? "#FFDF00"
                  : ratings[value.$d.toLocaleDateString()].rating === 4
                  ? "#9ACD32"
                  : ratings[value.$d.toLocaleDateString()].rating === 5
                  ? "#008000"
                  : "white",
            }}
          >
            {ratings[value.$d.toLocaleDateString()].reflection}
          </div>
        )}
        {value.$d.toLocaleDateString() === currentDate && (
          <div className="selected-date">
            <Tooltip title={"Change your rating and reflection for this day!"}>
              <AddIcon
                className="add-icon"
                onClick={() => setOpenModal(true)}
              />
            </Tooltip>
          </div>
        )}
      </>
    );
  };

  const handleModalConfirm = () => {
    setOpenModal(false);
  };

  const handleSubmitModal = () => {
    if (rating !== 0 && reflection !== "") {
      const newRating = { rating, reflection };

      setRatings((prevRatings) => {
        const updatedRatings = {
          ...prevRatings,
          [currentDate]: newRating,
        };

        axios
          .post("http://127.0.0.1:5000/test", updatedRatings, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            if (response.status === 200) {
              console.log(JSON.stringify(response.data));
            }
          })
          .catch((error) => {
            console.error("Error sending data:", error);
          });

        setRating(0);
        setReflection("");

        setOpenModal(false);
        return updatedRatings;
      });
    } else {
      setOpenModal(false);
    }
  };

  return (
    <CalendarWrapper>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <NavBar />
        <span>Mental Health App</span>
        <span>
          <strong>Currently Selected Date:</strong> {currentDate}
        </span>
      </div>
      <TrackingCalendar
        onChange={(e) => setDate(e.$d)}
        cellRender={renderCell}
        ratings={ratings}
      />
      <Modal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onOk={handleModalConfirm}
        width={800}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
          }}
        >
          <span>
            <strong>Rate your Day!</strong>
          </span>
          <div style={{ display: "flex", alignItems: "center" }}>
            <strong style={{ marginRight: 5 }}>Current State: </strong>

            {(ratings[currentDate] && ratings[currentDate].rating === 1) ||
            rating === 1 ? (
              <CircleIcon style={{ color: "#FFCCCB" }} />
            ) : (ratings[currentDate] && ratings[currentDate].rating === 2) ||
              rating === 2 ? (
              <CircleIcon style={{ color: "#FFD580" }} />
            ) : (ratings[currentDate] && ratings[currentDate].rating === 3) ||
              rating === 3 ? (
              <CircleIcon style={{ color: "#FFDF00" }} />
            ) : (ratings[currentDate] && ratings[currentDate].rating === 4) ||
              rating === 4 ? (
              <CircleIcon style={{ color: "#9ACD32" }} />
            ) : (ratings[currentDate] && ratings[currentDate].rating === 5) ||
              rating === 5 ? (
              <CircleIcon style={{ color: "#008000" }} />
            ) : ratings[currentDate] &&
              rating !== ratings[currentDate].rating ? (
              <CircleIcon style={{ color: RATING_COLORS[rating] }} />
            ) : null}
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", width: "90%" }}
          >
            <Rate
              character={({ index }) => customIcons[index + 1]}
              onChange={(e) => setRating(e)}
              style={{ display: "flex", justifyContent: "space-between" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>Bad</div>
              <div>Good</div>
            </div>
          </div>

          <div style={{ width: "90%" }}>
            <Input
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Reflect on how your day went!"
            />
          </div>
          <Button onClick={handleSubmitModal}>Submit</Button>
        </div>
      </Modal>
    </CalendarWrapper>
  );
};

export default CalendarPage;
