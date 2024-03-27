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
    const taskNumber = parseInt(taskId.replace("task", ""));
    if (newCategoryId === "Even" && taskNumber % 2 !== 0) {
      return;
    }

    const updatedData = array.map((category) => {
      if (category.id === newCategoryId) {
        return {
          ...category,
          tasks: [...category.tasks, { name: taskId }], // Add the dropped task to the new category
        };
      } else {
        return {
          ...category,
          tasks: category.tasks.filter((task) => task.name !== taskId), // Remove the task from the current category
        };
      }
    });

    setArray(updatedData);
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

        // Check if tasks is an array before slicing
        const displayTasks = showMoreTasks[id] ? tasks : tasks.slice(0, 5);

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
              {displayTasks.map((task, taskIndex) => (
                <div
                  key={taskIndex}
                  className="listItem"
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData("id", task.name);
                  }}
                >
                  {task.name}
                </div>
              ))}
              {tasks.length > 5 && (
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
