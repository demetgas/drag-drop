import React, { useState } from "react";
import "./card.css";
import data from "../../data/data";

export default function Card() {
  const [titleColors, setTitleColors] = useState({});
  const colors = ["#A54B4A", "#4A71A5", "#4AA561", "#A5A14A"];
  console.log("Title Colors:", titleColors);

  return (
    <div className="cardContainer">
      {data.map((x, index) => {
        const id = x.id; // Get the category id (e.g., "To Do", "Pending", "Done", "Even")
        const tasks = x.tasks; //Get the tasks for the category

        // Set color for this category if not already set
        if (!titleColors[id]) {
          setTitleColors((prevColors) => ({
            ...prevColors,
            [id]: colors[index % colors.length], // Get color from array based on index
          }));
        }

        return (
          <div key={index} className="card">
            <div
              className="header"
              style={{ backgroundColor: titleColors[id] }}
            >
              <div className="title">{id}</div>
            </div>
            <div className="list">
              {Object.entries(tasks).map(([taskId, taskName]) => (
                <div key={taskId} className="listItem" draggable>
                  {taskName}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
