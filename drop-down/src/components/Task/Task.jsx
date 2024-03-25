import React, { useState } from "react";
import "./task.css";
import data from "../../data/data";
import { Droppable } from "react-beautiful-dnd";

export default function Task(props, id) {
  const [titleColors, setTitleColors] = useState({});
  const colors = ["#A54B4A", "#4A71A5", "#4AA561", "#A5A14A"];
  console.log("Title Colors:", titleColors);

  return (
    <div className="cardContainer">
      {data.map((item, index) => {
        const category = Object.keys(item)[0]; // Get the category (e.g., todo, pending, done)
        const tasks = item[category]; // Get the tasks for the category

        // Set color for this category if not already set
        if (!titleColors[category]) {
          setTitleColors((prevColors) => ({
            ...prevColors,
            [category]: colors[index % colors.length], // Get color from array based on index
          }));
        }
        const titleMap = {
          toDo: "To Do",
          pending: "Pending",
          done: "Done",
          even: "Even",
        };

        return (
          <div key={index} className="card">
            <div
              className="header"
              style={{ backgroundColor: titleColors[category] }}
            >
              <div className="title">{titleMap[category]}</div>
            </div>
            <Droppable droppableId={id}>
              {(provided, snapshot) => {
                <div
                  className="list"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  {Object.values(tasks).map((task, index) => (
                    <div key={index} className="listItem">
                      {task}
                    </div>
                  ))}
                </div>;
              }}
            </Droppable>
          </div>
        );
      })}
    </div>
  );
}
