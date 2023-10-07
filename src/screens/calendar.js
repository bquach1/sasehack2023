import React, { useEffect, useState } from "react";
import { Calendar, Modal, Rate } from "antd";
import styled from "styled-components";
import AddIcon from "@mui/icons-material/AddCircle";
import CircleIcon from "@mui/icons-material/Circle";

const CalendarWrapper = styled.div`
  background-color: #daf0f7;
  padding: 20px;

  .selected-date {
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

  td {
    background-color: ${(props) =>
      console.log(props)
    }
  }
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
  const [rating, setRating] = useState(0);

  const [ratings, setRatings] = useState({});

  let currentDate = date.toLocaleDateString();

  useEffect(() => {
    console.log(ratings);
  });

  const renderCell = (value) => {
    if (value.$d.toLocaleDateString() === currentDate) {
      return (
        <div className="selected-date">
          <AddIcon className="add-icon" onClick={() => setOpenModal(true)} />
        </div>
      );
    }
  };

  const handleModalConfirm = () => {
    setOpenModal(false);
  };

  return (
    <CalendarWrapper>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span>Mental Health App</span>
        <span>
          <strong>Currently Selected Date:</strong> {currentDate}
        </span>
      </div>
      <TrackingCalendar
        onChange={(e) => setDate(e.$d)}
        onSelect={(e) => console.log(e)}
        cellRender={renderCell}
        rating={rating}
      />
      <Modal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        onOk={handleModalConfirm}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>Rate your Day!</span>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Rate
              defaultValue={3}
              character={({ index }) => customIcons[index + 1]}
              onChange={(e) => {
                setRating(e);
                setRatings({ ...ratings, [currentDate]: e });
              }}
            />
          </div>
        </div>
      </Modal>
    </CalendarWrapper>
  );
};

export default CalendarPage;
