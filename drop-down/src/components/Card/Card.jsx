import React, { useState } from "react";
import "./card.css";
import data from "../../data/data";

export default function Card() {
  const [tasks, setTasks] = useState(data);
  const [titleColors, setTitleColors] = useState({});

  const colors = ["#A54B4A", "#4A71A5", "#4AA561", "#A5A14A"];

  const handleDragStart = (event, task, categoryIndex) => {
    event.dataTransfer.setData("task", JSON.stringify(task));
    event.dataTransfer.setData("categoryIndex", categoryIndex);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event, categoryIndex) => {
    const task = JSON.parse(event.dataTransfer.getData("task"));
    const prevCategoryIndex = event.dataTransfer.getData("categoryIndex");

    if (prevCategoryIndex !== categoryIndex) {
      const newTasks = [...tasks];
      const prevTasks = { ...newTasks[prevCategoryIndex].tasks };
      delete prevTasks[task.id];

      newTasks[prevCategoryIndex] = {
        ...newTasks[prevCategoryIndex],
        tasks: prevTasks,
      };

      newTasks[categoryIndex] = {
        ...newTasks[categoryIndex],
        tasks: { ...newTasks[categoryIndex].tasks, [task.id]: task.name },
      };

      setTasks(newTasks);
    }
  };

  return (
    <div className="cardContainer">
      {tasks.map((category, categoryIndex) => {
        const id = category.id;
        const tasks = category.tasks;

        if (!titleColors[id]) {
          setTitleColors((prevColors) => ({
            ...prevColors,
            [id]: colors[categoryIndex % colors.length],
          }));
        }

        return (
          <div key={id} className="card">
            <div
              className="header"
              style={{ backgroundColor: titleColors[id] }}
            >
              <div className="title">{id}</div>
            </div>
            <div
              className="list"
              onDragOver={(event) => handleDragOver(event)}
              onDrop={(event) => handleDrop(event, categoryIndex)}
            >
              {Object.entries(tasks).map(([taskId, taskName]) => (
                <div
                  key={taskId}
                  className="listItem"
                  draggable="true"
                  onDragStart={(event) =>
                    handleDragStart(
                      event,
                      { id: taskId, name: taskName },
                      categoryIndex
                    )
                  }
                >
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
