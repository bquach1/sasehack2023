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
  padding-bottom: 20px;

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
    axios
      .get("http://127.0.0.1:5000/insert")
      .then((response) => {
        if (response.status === 200) {
          setRatings(
            response.data.map((item) => {
              const { _id, ...rest } = item;
              return rest;
            })
          );
        }
      })
      .catch((error) => {
        console.error("Error sending data:", error);
      });
  }, []);

  useEffect(() => {
    if (
      Object.values(ratings).some(
        (rating) => rating.date === currentDate && rating.reflection.length
      )
    ) {
      setReflection(
        Object.values(ratings).find((rating) => rating.date === currentDate)
          .reflection
      );
    } else {
      setReflection("");
    }
  }, [currentDate, ratings]);

  const renderCell = (value) => {
    return (
      <>
        {Object.values(ratings)
          .filter((item) => item.date === value.$d.toLocaleDateString())
          .map((item, index) => (
            <div
              key={index}
              style={{
                borderRadius: 10,
                padding: 10,
                backgroundColor: RATING_COLORS[item.rating],
                height: 30,
                overflowY: "scroll",
              }}
            >
              <div style={{ color: item.rating === 5 ? "white" : "black" }}>
                {item.reflection}
              </div>
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

  const handleSubmitModal = () => {
    if (rating !== 0 || reflection !== "") {
      let newRating = { date: currentDate, rating, reflection };
      if (
        Object.values(ratings).some((rating) => {
          return rating.date === currentDate;
        }) &&
        rating === 0
      ) {
        newRating = {
          date: currentDate,
          rating: Object.values(ratings).find(
            (rating) => rating.date === currentDate
          ).rating,
          reflection: reflection,
        };
      } else if (
        Object.values(ratings).some((rating) => {
          return rating.date === currentDate;
        }) &&
        reflection === ""
      ) {
        newRating = {
          date: currentDate,
          rating: rating,
          reflection: Object.values(ratings).find(
            (rating) => rating.date === currentDate
          ).reflection,
        };
      }

      setRatings((prevRatings) => {
        let updatedRatings = {};
        const index = Object.values(ratings).findIndex(
          (ratingObj) => ratingObj.date === currentDate
        );

        if (
          Object.values(prevRatings).some(
            (rating) => rating.date === currentDate
          )
        ) {
          updatedRatings = {
            ...prevRatings,
            [index]: newRating,
          };
        } else {
          const newKey = Object.keys(prevRatings).length + 1;
          updatedRatings = {
            ...prevRatings,
            [newKey]: newRating,
          };
        }

        axios
          .post("http://127.0.0.1:5000/insert", updatedRatings, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            if (response.status === 200) {
              JSON.stringify(response.data);
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
      <NavBar />
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
        onOk={handleSubmitModal}
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
            ) : Object.values(ratings).some(
                (rating) => rating.date === currentDate
              ) &&
              rating !==
                Object.values(ratings).find(
                  (rating) => rating.date === currentDate
                ).rating ? (
              <CircleIcon
                style={{
                  color:
                    RATING_COLORS[
                      Object.values(ratings).find(
                        (rating) => rating.date === currentDate
                      ).rating
                    ],
                }}
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

          <div style={{ width: "90%", marginTop: "1%" }}>
            <Input
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Reflect on how your day went!"
            />
          </div>
          <div style={{ marginTop: "1%" }}>
            <strong>Today's Reflection: </strong>
            {ratings &&
              Object.values(ratings).some(
                (rating) => currentDate === rating.date
              ) &&
              Object.values(ratings).find(
                (rating) => currentDate === rating.date
              ).reflection}
          </div>
        </div>
      </Modal>
    </CalendarWrapper>
  );
};

export default CalendarPage;
