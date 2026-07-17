import React, { useEffect, useState } from "react";
import axios from "axios";

const History = () => {

  const [history, setHistory] = useState([]);

  useEffect(() => {

    fetchHistory();

  }, []);

  const fetchHistory = async () => {

    try {

      const response = await axios.get(
        "http://localhost:3000/api/interview/history"
      );

      setHistory(response.data);

    } catch (error) {

      console.log(error);

    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">

      <h1 className="text-4xl font-bold mb-8">
        Interview History
      </h1>

      {history.map((item) => (

        <div
          key={item._id}
          className="bg-gray-900 p-6 rounded-xl mb-4"
        >
          <h2 className="text-xl font-bold">
            {item.role}
          </h2>

          <p>
            Experience: {item.experience}
          </p>

          <p>
            Score: {item.score}/100
          </p>

          <p>
            {item.feedback}
          </p>
        </div>

      ))}

    </div>
  );
};

export default History;