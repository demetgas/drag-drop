import React, { useState } from "react";
import "./card.css";
import data from "../../data/data";

export default function Card() {
  const [titleColors, setTitleColors] = useState({});
  const [array, setArray] = useState(data);
  const [showMoreTasks, setShowMoreTasks] = useState({});

  const colors = ["#A54B4A", "#4A71A5", "#4AA561", "#A5A14A"];

  const handleDrop = (e, newCategoryId) => {
    const taskId = e.dataTransfer.getData("id");
    console.log("Dropped task ID:", taskId);

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

    setArray(newData);
  };

  const toggleShowMoreTasks = (categoryId) => {
    setShowMoreTasks((prevState) => ({
      ...prevState,
      [categoryId]: !prevState[categoryId],
    }));
  };

  return (
    <div className="cardContainer">
      {array.map((x, index) => {
        const id = x.id;
        const tasks = x.tasks;

        if (!titleColors[id]) {
          setTitleColors((prevColors) => ({
            ...prevColors,
            [id]: colors[index % colors.length],
          }));
        }

        const displayTasks = showMoreTasks[id]
          ? Object.entries(tasks)
          : Object.entries(tasks).slice(0, 5);

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
              {displayTasks.map(([taskId, task]) => (
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
              {Object.values(tasks).length > 5 && (
                <button className="btn" onClick={() => toggleShowMoreTasks(id)}>
                  {showMoreTasks[id] ? "Show Less" : "Load More"}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
