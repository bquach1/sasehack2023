import React, { useEffect, useState } from "react";
import { Calendar, Modal, Rate, Tooltip, Input, Button } from "antd";
import styled from "styled-components";
import AddIcon from "@mui/icons-material/AddCircle";
import CircleIcon from "@mui/icons-material/Circle";
import NavBar from "../Navbar";
import axios from "axios";
import { RATING_COLORS } from "../constants";

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
    console.log(ratings);
  })

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/insert")
      .then((response) => {
        if (response.status === 200) {
          setRatings(response.data);
        }
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });
  }, []);

  useEffect(() => {
    if (ratings[currentDate] && ratings[currentDate].reflection.length) {
      setReflection(ratings[currentDate].reflection);
    } else {
      setReflection("");
    }
  }, [currentDate, ratings]);

  useEffect(() => {
    console.log(ratings);
  });

  const renderCell = (value) => {
    console.log(value.$d.toLocaleDateString());
    return (
      <>
        {ratings
          .filter((item) => item.date === value.$d.toLocaleDateString())
          .map((item, index) => (
            <div
              key={index} // Add a unique key if you're rendering a list
              style={{
                borderRadius: 10,
                padding: 10,
                backgroundColor: RATING_COLORS[item.rating],
              }}
            >
              {item.reflection}
            </div>
          ))}
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
    if (rating !== 0 || reflection !== "") {
      let newRating = { currentDate, rating, reflection };
      if (ratings[currentDate] && rating === 0) {
        newRating = {
          rating: ratings[currentDate].rating,
          reflection: reflection,
        };
      } else if (ratings[currentDate] && reflection === "") {
        newRating = {
          rating: rating,
          reflection: ratings[currentDate].reflection,
        };
      }

      setRatings((prevRatings) => {
        const newKey = Object.keys(prevRatings).length + 1;
        const updatedRatings = {
          ...prevRatings,
          [newKey]: newRating,
        };

        axios
          .post("http://127.0.0.1:5000/insert", updatedRatings, {
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
      <div>
        <NavBar />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
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

            {rating !== 0 ? (
              <CircleIcon style={{ color: RATING_COLORS[rating] }} />
            ) : ratings[currentDate] &&
              rating !== ratings[currentDate].rating ? (
              <CircleIcon
                style={{ color: RATING_COLORS[ratings[currentDate].rating] }}
              />
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
