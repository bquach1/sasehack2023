import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Overview = () => {
  const [summary, setSummary] = useState('');

  useEffect(() => {
    // Make an API request to fetch the summary when the component mounts
    axios.get('http://127.0.0.1:5000/summary')
      .then(response => {
        setSummary(response.data.reply);
      })
      .catch(error => {
        console.error('Error fetching summary:', error);
      });
  }, []);

  return (
    <div className="todo-list">
      <h3>Overview</h3>
      <p>{summary}</p>
    </div>
  );
};

export default Overview;

