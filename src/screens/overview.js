import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spin } from "antd";
import styled from "styled-components";

const OverviewWrapper = styled.div`
`

const Overview = () => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Make an API request to fetch the summary when the component mounts
    axios
      .get("http://127.0.0.1:5000/summary")
      .then((response) => {
        setSummary(response.data.reply);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching summary:", error);
      });
  }, []);

  return (
    <OverviewWrapper>
      <h3>Overview</h3>
      <div style={{height: "60%", overflowY: "scroll"}}>
        {loading ? (
          <div>
            <Spin style={{ marginBottom: "10%" }} />
            <div>Please wait, loading responses...</div>
          </div>
        ) : (
          <div style={{maxHeight: 200, overflowY: "scroll"}}>
          {summary}
          </div>
        )}
      </div>
    </OverviewWrapper>
  );
};

export default Overview;
