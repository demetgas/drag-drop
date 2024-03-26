import React, { useState } from "react";
import "./card.css";
import data from "../../data/data";

export default function Card() {
  const [titleColors, setTitleColors] = useState({});
  const [array, setArray] = useState(data); // Initialize state with data
  const colors = ["#A54B4A", "#4A71A5", "#4AA561", "#A5A14A"];

  const handleDrop = (e, newCategoryId) => {
    const taskId = e.dataTransfer.getData("id");
    console.log("Dropped task ID:", taskId);

    // Find the category in the data array
    const newData = array.map((category) => {
      if (category.id === newCategoryId) {
        return {
          ...category,
          tasks: {
            ...category.tasks,
            [taskId]: array.find((cat) => cat.tasks[taskId]),
          },
        };
      } else {
        const newTasks = { ...category.tasks };
        delete newTasks[taskId];
        return {
          ...category,
          tasks: newTasks,
        };
      }
    });

    // Update the data array
    setArray(newData);
  };
  function load() {}

  return (
    <div className="cardContainer">
      {array.map((x, index) => {
        const id = x.id; // Get the category id (e.g., "To Do", "Pending", "Done", "Even")
        const tasks = x.tasks; // Get the tasks for the category

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
            <div
              className="list"
              onDrop={(e) => handleDrop(e, id)}
              onDragOver={(e) => e.preventDefault()}
            >
              {Object.entries(tasks).map(([taskId, task]) => (
                <div
                  key={taskId}
                  className="listItem"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("id", taskId);
                    console.log(task);
                  }}
                >
                  {taskId}
                </div>
              ))}
              {Object.values(tasks).length > 4 && (
                <button className="btn" onClick={load}>
                  Load More
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
