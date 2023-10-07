import React, { useState } from "react";
import { Calendar, Modal } from "antd";
import styled from "styled-components";
import AddIcon from "@mui/icons-material/AddCircle";

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
`;

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [openModal, setOpenModal] = useState(false);

  const renderCell = (value) => {
    if (value.$d.toLocaleDateString() === date.toLocaleDateString()) {
      return (
        <div className="selected-date">
          <AddIcon className="add-icon" onClick={() => setOpenModal(true)} />
        </div>
      );
    }
  };

  const handleModalConfirm = () => {
    setOpenModal(false);
  }

  return (
    <CalendarWrapper>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span>Mental Health App</span>
        <span>
          <strong>Currently Selected Date:</strong> {date.toLocaleDateString()}
        </span>
      </div>
      <TrackingCalendar
        onChange={(e) => setDate(e.$d)}
        onSelect={(e) => console.log(e)}
        cellRender={renderCell}
      />
      <Modal open={openModal} onCancel={() => setOpenModal(false)} onOk={handleModalConfirm}/>
    </CalendarWrapper>
  );
};

export default CalendarPage;
